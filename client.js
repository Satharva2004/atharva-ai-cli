const WebSocket = require('ws');
const readline = require('readline');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const moment = require('moment');

class CollaborativeNoteClient {
  constructor(serverUrl, room, clientId, userName) {
    this.serverUrl = serverUrl;
    this.room = room;
    this.clientId = clientId;
    this.userName = userName || `User_${Math.random().toString(36).substr(2, 6)}`;
    this.ws = null;
    this.doc = '';
    this.todos = [];
    this.connected = false;
    this.rl = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.roomInfo = null;
    this.otherUsers = new Set();
  }

  connect() {
    console.log(chalk.blue(`🔌 Connecting to ${this.serverUrl}...`));
    
    try {
      this.ws = new WebSocket(this.serverUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      console.error(chalk.red(`❌ Connection failed: ${error.message}`));
      this.handleConnectionError();
    }
  }

  setupWebSocketHandlers() {
    this.ws.on('open', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log(chalk.green(`✅ Connected successfully!`));
      console.log(chalk.cyan(`🏠 Joining room: "${this.room}"`));
      
      this.ws.send(JSON.stringify({
        type: 'join',
        room: this.room,
        clientId: this.clientId,
        userName: this.userName
      }));
      
      this.startTerminal();
    });

    this.ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        this.handleMsg(msg);
      } catch (error) {
        console.error(chalk.red('❌ Message parse error:', error.message));
      }
    });

    this.ws.on('close', (code, reason) => {
      this.connected = false;
      console.log(chalk.yellow(`🔌 Connection closed (${code}: ${reason || 'No reason'})`));
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      } else {
        console.log(chalk.red('❌ Max reconnection attempts reached'));
        this.cleanup();
      }
    });

    this.ws.on('error', (error) => {
      console.error(chalk.red('❌ WebSocket error:', error.message));
      this.handleConnectionError();
    });
  }

  handleConnectionError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    } else {
      console.log(chalk.red('❌ Connection failed permanently'));
      this.cleanup();
    }
  }

  attemptReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    console.log(chalk.yellow(`🔄 Attempting to reconnect in ${delay/1000}s... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`));
    
    setTimeout(() => {
      if (!this.connected) {
        this.connect();
      }
    }, delay);
  }

  handleMsg(msg) {
    const { type, content, document, summary, clientId, userName, message: msgText, roomInfo, userCount, stats, users, todos, todo } = msg;

    switch (type) {
      case 'sync':
        this.doc = document || '';
        this.todos = todos || [];
        this.roomInfo = roomInfo;
        this.showWelcomeMessage();
        this.showDoc();
        this.showTodos();
        break;
        
      case 'document_update':
        if (clientId !== this.clientId) {
          this.doc = content;
          console.log(chalk.cyan(`\n📝 ${userName || 'Unknown'} updated the document`));
          this.showDoc();
        }
        break;
        
      case 'todo_added':
        if (clientId !== this.clientId) {
          this.todos.push(todo);
          console.log(chalk.green(`\n✅ ${userName || 'Unknown'} added todo: ${todo.text}`));
          this.showTodos();
        }
        break;

      case 'todo_updated':
        if (clientId !== this.clientId) {
          const existingTodo = this.todos.find(t => t.id === todo.id);
          if (existingTodo) {
            existingTodo.completed = todo.completed;
            existingTodo.updatedAt = todo.updatedAt;
          }
          console.log(chalk.yellow(`\n🔄 ${userName || 'Unknown'} ${todo.completed ? 'completed' : 'uncompleted'}: ${todo.text}`));
          this.showTodos();
        }
        break;
        
      case 'user_joined':
        if (clientId !== this.clientId) {
          this.otherUsers.add(userName || 'Unknown');
          console.log(chalk.green(`\n👋 ${userName || 'Unknown'} joined the room`));
          this.updateUserCount();
        }
        break;
        
      case 'user_left':
        if (clientId !== this.clientId) {
          this.otherUsers.delete(userName || 'Unknown');
          console.log(chalk.yellow(`\n👋 ${userName || 'Unknown'} left the room`));
          this.updateUserCount();
        }
        break;
        
      case 'ai_summary':
        console.log(chalk.magenta(`\n🤖 AI Summary (requested by ${userName || 'Unknown'}):`));
        console.log(chalk.white('─'.repeat(50)));
        console.log(chalk.cyan(summary));
        console.log(chalk.white('─'.repeat(50)));
        console.log(chalk.gray(`📊 Original: ${stats?.originalLength || 'Unknown'} chars → Summary: ${stats?.summaryLength || 'Unknown'} chars`));
        break;
        
      case 'error':
        console.log(chalk.red(`\n❌ Error: ${msgText}`));
        break;
        
      case 'room_info':
        this.roomInfo = roomInfo;
        this.otherUsers = new Set(users || []);
        this.updateUserCount();
        break;
        
      default:
        console.log(chalk.gray(`\n📨 Unknown message type: ${type}`));
    }
  }

  startTerminal() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.rl.on('line', (input) => {
      const text = input.trim();
      
      if (text.startsWith('/')) {
        this.handleCmd(text);
      } else if (text) {
        this.handleText(text);
      }
    });

    this.rl.on('close', () => {
      this.cleanup();
    });
  }

  showWelcomeMessage() {
    console.log(chalk.green('\n🎉 Welcome to Collaborative Notes!'));
    console.log(chalk.blue(`📝 Room: "${this.room}"`));
    console.log(chalk.cyan(`👤 Your Name: ${this.userName}`));
    console.log(chalk.yellow(`💡 Type your notes or use commands: /summarize, /copy, /share, /date, /todo, /help, /clear, /exit`));
    console.log(chalk.white('─'.repeat(60)));
  }

  updateUserCount() {
    const totalUsers = this.otherUsers.size + 1; // +1 for current user
    console.log(chalk.blue(`\n👥 Room has ${totalUsers} user${totalUsers !== 1 ? 's' : ''}`));
    if (this.otherUsers.size > 0) {
      console.log(chalk.gray(`   Other users: ${Array.from(this.otherUsers).join(', ')}`));
    }
  }

  handleCmd(cmd) {
    const command = cmd.toLowerCase();
    
    switch (command) {
      case '/summarize':
        if (!this.connected) {
          console.log(chalk.red('❌ Not connected to server'));
          return;
        }
        
        if (!this.doc.trim()) {
          console.log(chalk.yellow('⚠️ No content to summarize. Add some notes first!'));
          return;
        }
        
        console.log(chalk.magenta('🤖 Requesting AI summary...'));
        this.ws.send(JSON.stringify({
          type: 'summarize',
          room: this.room,
          clientId: this.clientId,
          userName: this.userName
        }));
        break;

      case '/copy':
        if (!this.doc.trim()) {
          console.log(chalk.yellow('⚠️ No content to copy. Add some notes first!'));
          return;
        }
        
        try {
          clipboardy.writeSync(this.doc);
          console.log(chalk.green('✅ Document copied to clipboard!'));
        } catch (error) {
          console.log(chalk.red('❌ Failed to copy to clipboard. You may need to install clipboardy.'));
        }
        break;

      case '/share':
        if (this.roomInfo?.shareableLink) {
          console.log(chalk.blue('\n🔗 Shareable Room Link:'));
          console.log(chalk.white('─'.repeat(40)));
          console.log(chalk.cyan(this.roomInfo.shareableLink));
          console.log(chalk.white('─'.repeat(40)));
          console.log(chalk.gray('💡 Share this link with others to join the room'));
        } else {
          console.log(chalk.yellow('⚠️ Room information not available yet'));
        }
        break;

      case '/date':
        if (this.roomInfo) {
          console.log(chalk.blue('\n📅 Room Dates:'));
          console.log(chalk.white('─'.repeat(30)));
          console.log(chalk.cyan('Created:') + ` ${moment(this.roomInfo.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`);
          console.log(chalk.cyan('Updated:') + ` ${moment(this.roomInfo.lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}`);
          console.log(chalk.cyan('Age:') + ` ${moment(this.roomInfo.createdAt).fromNow()}`);
          console.log(chalk.white('─'.repeat(30)));
        } else {
          console.log(chalk.yellow('⚠️ Room information not available yet'));
        }
        break;

      case '/todo':
        console.log(chalk.blue('\n📝 Add Todo Item:'));
        console.log(chalk.yellow('💡 Type your todo item and press Enter:'));
        this.rl.question(chalk.cyan('> '), (todoText) => {
          if (todoText.trim()) {
            this.addTodo(todoText.trim());
          }
        });
        return; // Don't show prompt again
      
      case '/exit':
        console.log(chalk.yellow('👋 Leaving room...'));
        this.cleanup();
        break;
      
      case '/help':
        this.showHelp();
        break;
      
      case '/clear':
        console.clear();
        this.showWelcomeMessage();
        break;
      
      case '/status':
        this.showStatus();
        break;
      
      case '/users':
        this.updateUserCount();
        break;
      
      case '/room':
        this.showRoomInfo();
        break;
      
      default:
        console.log(chalk.yellow(`⚠️ Unknown command: ${cmd}`));
        console.log(chalk.blue(`💡 Available commands: /summarize, /copy, /share, /date, /todo, /exit, /help, /clear, /status, /users, /room`));
    }
  }

  addTodo(todoText) {
    if (!this.connected) {
      console.log(chalk.red('❌ Not connected to server'));
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'add_todo',
      room: this.room,
      todoText,
      clientId: this.clientId,
      userName: this.userName
    }));

    console.log(chalk.green(`✅ Todo added: ${todoText}`));
  }

  showRoomInfo() {
    console.log(chalk.blue('\n🏠 Room Information:'));
    console.log(chalk.white('─'.repeat(30)));
    console.log(chalk.cyan('Name:') + ` ${this.room}`);
    if (this.roomInfo?.createdAt) {
      console.log(chalk.cyan('Created:') + ` ${moment(this.roomInfo.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`);
    }
    console.log(chalk.cyan('Document Length:') + ` ${this.doc.length} characters`);
    console.log(chalk.cyan('Todos:') + ` ${this.todos.length} items`);
    this.updateUserCount();
    console.log(chalk.white('─'.repeat(30)));
  }

  handleText(text) {
    if (!this.connected) {
      console.log(chalk.red('❌ Not connected to server'));
      return;
    }

    if (this.doc) {
      this.doc += '\n' + text;
    } else {
      this.doc = text;
    }

    this.ws.send(JSON.stringify({
      type: 'update',
      room: this.room,
      content: this.doc,
      clientId: this.clientId,
      userName: this.userName
    }));

    this.showDoc();
  }

  showDoc() {
    if (!this.doc.trim()) {
      console.log(chalk.gray('📄 Document is empty - start typing to add notes!'));
      return;
    }
    
    console.log(chalk.white('\n📄 Current Document:'));
    console.log(chalk.white('─'.repeat(50)));
    console.log(chalk.cyan(this.doc));
    console.log(chalk.white('─'.repeat(50)));
    console.log(chalk.gray(`📊 Document length: ${this.doc.length} characters`));
  }

  showTodos() {
    if (this.todos.length === 0) {
      console.log(chalk.gray('\n✅ No todos yet - use /todo to add one!'));
      return;
    }

    console.log(chalk.white('\n✅ Todo List:'));
    console.log(chalk.white('─'.repeat(40)));
    
    this.todos.forEach((todo, index) => {
      const status = todo.completed ? chalk.green('☑️') : chalk.yellow('☐');
      const text = todo.completed ? chalk.strikethrough(todo.text) : todo.text;
      const creator = chalk.gray(`(${todo.createdBy})`);
      const time = chalk.gray(moment(todo.createdAt).fromNow());
      
      console.log(`${status} ${text} ${creator} ${time}`);
    });
    
    console.log(chalk.white('─'.repeat(40)));
    console.log(chalk.gray(`📊 Total: ${this.todos.length} todos`));
  }

  showHelp() {
    console.log(chalk.blue('\n📚 Available Commands:'));
    console.log(chalk.white('─'.repeat(50)));
    console.log(chalk.cyan('/summarize') + ' - Generate AI summary of notes');
    console.log(chalk.cyan('/copy') + '      - Copy document to clipboard');
    console.log(chalk.cyan('/share') + '     - Show shareable room link');
    console.log(chalk.cyan('/date') + '      - Show room creation/update dates');
    console.log(chalk.cyan('/todo') + '      - Add checkbox todo item');
    console.log(chalk.cyan('/status') + '    - Show connection status');
    console.log(chalk.cyan('/users') + '     - Show room user count');
    console.log(chalk.cyan('/room') + '      - Show room information');
    console.log(chalk.cyan('/help') + '      - Show this help');
    console.log(chalk.cyan('/clear') + '     - Clear terminal screen');
    console.log(chalk.cyan('/exit') + '      - Leave room and disconnect');
    console.log(chalk.white('─'.repeat(50)));
    console.log(chalk.yellow('💡 Type normally to add notes in real-time!'));
    console.log(chalk.gray('📝 Notes and todos are automatically shared with all users in the room'));
  }

  showStatus() {
    console.log(chalk.blue('\n📊 Connection Status:'));
    console.log(chalk.white('─'.repeat(30)));
    console.log(chalk.cyan('Server:') + ` ${this.serverUrl}`);
    console.log(chalk.cyan('Room:') + ` "${this.room}"`);
    console.log(chalk.cyan('User Name:') + ` ${this.userName}`);
    console.log(chalk.cyan('Client ID:') + ` ${this.clientId}`);
    console.log(chalk.cyan('Connected:') + ` ${this.connected ? chalk.green('✓ Yes') : chalk.red('✗ No')}`);
    if (this.roomInfo) {
      console.log(chalk.cyan('Users:') + ` ${this.roomInfo.userCount}`);
      console.log(chalk.cyan('Created:') + ` ${moment(this.roomInfo.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`);
    }
    console.log(chalk.white('─'.repeat(30)));
  }

  cleanup() {
    if (this.rl) {
      this.rl.close();
    }
    if (this.ws && this.connected) {
      this.ws.close();
    }
    
    console.log(chalk.green('\n👋 Thanks for using Collaborative Notes!'));
    console.log(chalk.gray('📝 Your notes have been saved in the room'));
    process.exit(0);
  }
}

module.exports = CollaborativeNoteClient;

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(chalk.red('❌ Usage: node client.js <server-url> <room> [user-name]'));
    console.log(chalk.blue('💡 Example: node client.js ws://localhost:8080 meeting-notes John'));
    process.exit(1);
  }

  const serverUrl = args[0];
  const room = args[1];
  const userName = args[2] || `User_${Math.random().toString(36).substr(2, 6)}`;

  const client = new CollaborativeNoteClient(serverUrl, room, null, userName);
  client.connect();

  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down client...'));
    client.cleanup();
  });
}
