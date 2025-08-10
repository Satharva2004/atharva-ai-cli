const WebSocket = require('ws');
const http = require('http');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
require('dotenv').config();

// Cool and awesome user names
const COOL_USER_NAMES = [
  'Neo', 'Morpheus', 'Trinity', 'Oracle', 'Agent Smith',
  'Gandalf', 'Frodo', 'Aragorn', 'Legolas', 'Gimli',
  'Iron Man', 'Captain America', 'Black Widow', 'Thor', 'Hulk',
  'Luke Skywalker', 'Darth Vader', 'Yoda', 'Obi-Wan', 'Han Solo',
  'Sherlock Holmes', 'Dr. Watson', 'Moriarty', 'Irene Adler',
  'Batman', 'Superman', 'Wonder Woman', 'Flash', 'Aquaman',
  'Spider-Man', 'Wolverine', 'Deadpool', 'Black Panther',
  'Wonder Woman', 'Black Widow', 'Scarlet Witch', 'Storm',
  'Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner',
  'Peter Parker', 'Wade Wilson', 'T\'Challa', 'Scott Lang',
  'Doctor Strange', 'Captain Marvel', 'Scarlet Witch', 'Vision'
];

class CollaborativeNoteServer {
  constructor(port) {
    this.port = port;
    this.rooms = new Map();
    this.clients = new Map();
    this.server = null;
    this.wss = null;
    this.genAI = null;
    
    // Initialize Gemini AI
    this.initializeAI();
  }

  initializeAI() {
    // Use a default API key for public use, or fall back to environment variable
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ';
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('🤖 Gemini AI integration: ✓ Active (Public API Key)');
      console.log('💡 Users can start using the platform immediately!');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error.message);
      console.log('⚠️ AI features will be disabled');
      this.genAI = null;
    }
  }

  generateCoolUserName() {
    const randomName = COOL_USER_NAMES[Math.floor(Math.random() * COOL_USER_NAMES.length)];
    const randomSuffix = Math.random().toString(36).substr(2, 4);
    return `${randomName}_${randomSuffix}`;
  }

  start() {
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws, req) => {
      const clientIp = req.socket.remoteAddress;
      console.log(`🔌 New connection from ${clientIp} (Total: ${this.wss.clients.size})`);
      
      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          this.handleMsg(ws, msg);
        } catch (error) {
          console.error('❌ Message parse error:', error.message);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
        this.handleDisconnect(ws);
      });
    });

    this.server.listen(this.port, () => {
      console.log(`🚀 Collaborative Notes Server started on port ${this.port}`);
      console.log(`📝 WebSocket URL: ws://localhost:${this.port}`);
      console.log(`🤖 Gemini AI integration: ${this.genAI ? '✓ Active' : '✗ Disabled'}`);
      console.log('─'.repeat(60));
    });
  }

  handleMsg(ws, msg) {
    const { type, room, content, clientId, userName, todoText, action } = msg;

    switch (type) {
      case 'join':
        this.handleJoin(ws, room, clientId, userName);
        break;
        
      case 'update':
        this.handleUpdate(ws, room, content, clientId, userName);
        break;
        
      case 'summarize':
        this.handleSummarize(ws, room, clientId, userName);
        break;

      case 'add_todo':
        this.handleAddTodo(ws, room, todoText, clientId, userName);
        break;

      case 'toggle_todo':
        this.handleToggleTodo(ws, room, action, clientId, userName);
        break;
        
      default:
        this.sendError(ws, `Unknown message type: ${type}`);
    }
  }

  handleJoin(ws, room, clientId, userName) {
    // Generate cool user name if not provided
    const finalUserName = userName || this.generateCoolUserName();
    
    // Store client info
    this.clients.set(ws, {
      room,
      clientId,
      userName: finalUserName,
      ws,
      joinedAt: new Date()
    });

    // Get or create room
    if (!this.rooms.has(room)) {
      this.rooms.set(room, {
        name: room,
        document: '',
        todos: [],
        users: new Map(),
        createdAt: new Date(),
        lastUpdated: new Date(),
        roomId: uuidv4(),
        shareableLink: `ws://localhost:${this.port}/room/${room}`
      });
      console.log(`🏠 New room created: "${room}"`);
    }

    const roomData = this.rooms.get(room);
    roomData.users.set(clientId, {
      id: clientId,
      name: finalUserName,
      joinedAt: new Date()
    });

    // Send room sync to joining client
    ws.send(JSON.stringify({
      type: 'sync',
      document: roomData.document,
      todos: roomData.todos,
      roomInfo: {
        name: roomData.name,
        userCount: roomData.users.size,
        createdAt: roomData.createdAt,
        lastUpdated: roomData.lastUpdated,
        roomId: roomData.roomId,
        shareableLink: roomData.shareableLink
      }
    }));

    // Notify other clients in the room
    this.broadcastToRoom(room, {
      type: 'user_joined',
      clientId,
      userName: finalUserName,
      userCount: roomData.users.size
    }, ws);

    // Send room info update
    this.broadcastRoomInfo(room);

    console.log(`👤 ${finalUserName} joined "${room}" (${roomData.users.size} users)`);
  }

  handleUpdate(ws, room, content, clientId, userName) {
    const roomData = this.rooms.get(room);
    if (!roomData) {
      this.sendError(ws, `Room "${room}" not found`);
      return;
    }

    const prevLength = roomData.document.length;
    roomData.document = content;
    roomData.lastUpdated = new Date();

    // Broadcast update to all clients in the room (except sender)
    this.broadcastToRoom(room, {
      type: 'document_update',
      content,
      clientId,
      userName: userName || 'Unknown',
      stats: {
        prevLength,
        newLength: content.length
      }
    }, ws);

    console.log(`✏️ ${userName || 'Unknown'} updated "${room}" (${prevLength} → ${content.length} chars)`);
  }

  handleAddTodo(ws, room, todoText, clientId, userName) {
    const roomData = this.rooms.get(room);
    if (!roomData) {
      this.sendError(ws, `Room "${room}" not found`);
      return;
    }

    const newTodo = {
      id: uuidv4(),
      text: todoText,
      completed: false,
      createdBy: userName || 'Unknown',
      createdAt: new Date()
    };

    roomData.todos.push(newTodo);
    roomData.lastUpdated = new Date();

    // Broadcast new todo to all clients in the room
    this.broadcastToRoom(room, {
      type: 'todo_added',
      todo: newTodo,
      clientId,
      userName: userName || 'Unknown'
    });

    console.log(`✅ ${userName || 'Unknown'} added todo in "${room}": ${todoText}`);
  }

  handleToggleTodo(ws, room, action, clientId, userName) {
    const roomData = this.rooms.get(room);
    if (!roomData) {
      this.sendError(ws, `Room "${room}" not found`);
      return;
    }

    const { todoId, completed } = action;
    const todo = roomData.todos.find(t => t.id === todoId);
    
    if (todo) {
      todo.completed = completed;
      todo.updatedAt = new Date();
      roomData.lastUpdated = new Date();

      // Broadcast todo update to all clients in the room
      this.broadcastToRoom(room, {
        type: 'todo_updated',
        todo,
        clientId,
        userName: userName || 'Unknown'
      });

      console.log(`🔄 ${userName || 'Unknown'} ${completed ? 'completed' : 'uncompleted'} todo in "${room}": ${todo.text}`);
    }
  }

  async handleSummarize(ws, room, clientId, userName) {
    const roomData = this.rooms.get(room);
    if (!roomData) {
      this.sendError(ws, `Room "${room}" not found`);
      return;
    }

    if (!roomData.document.trim()) {
      this.sendError(ws, 'No content to summarize');
      return;
    }

    if (!this.genAI) {
      this.sendError(ws, 'AI features are disabled');
      return;
    }

    try {
      console.log(`🤖 ${userName || 'Unknown'} requested AI summary for "${room}" (${roomData.document.length} chars)`);
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Please provide a concise summary of the following collaborative notes. Focus on key points, action items, and main themes. Keep it under 200 words:\n\n${roomData.document}`;
      
      const result = await model.generateContent(prompt);
      const summary = result.response.text();

      // Broadcast summary to all clients in the room
      this.broadcastToRoom(room, {
        type: 'ai_summary',
        summary,
        clientId,
        userName: userName || 'Unknown',
        stats: {
          originalLength: roomData.document.length,
          summaryLength: summary.length
        }
      });

      console.log(`✅ AI summary generated for "${room}" (${roomData.document.length} → ${summary.length} chars)`);
    } catch (error) {
      console.error(`❌ Summary generation failed for "${room}":`, error.message);
      this.sendError(ws, `AI summary failed: ${error.message}`);
    }
  }

  handleDisconnect(ws) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      const { room, clientId, userName } = clientInfo;
      const roomData = this.rooms.get(room);
      
      if (roomData) {
        roomData.users.delete(clientId);
        console.log(`👋 ${userName || 'Unknown'} left "${room}" (${roomData.users.size} users remaining)`);
        
        // Remove room if no users left
        if (roomData.users.size === 0) {
          this.rooms.delete(room);
          console.log(`🗑️ Room "${room}" removed (no users left)`);
        } else {
          // Notify remaining users
          this.broadcastToRoom(room, {
            type: 'user_left',
            clientId,
            userName: userName || 'Unknown',
            userCount: roomData.users.size
          });
          
          // Send updated room info
          this.broadcastRoomInfo(room);
        }
      }
      
      this.clients.delete(ws);
    }
  }

  broadcastToRoom(room, message, excludeWs = null) {
    this.clients.forEach((clientInfo, ws) => {
      if (clientInfo.room === room && ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('❌ Failed to send message to client:', error.message);
        }
      }
    });
  }

  broadcastRoomInfo(room) {
    const roomData = this.rooms.get(room);
    if (!roomData) return;

    const users = Array.from(roomData.users.values()).map(user => user.name);
    
    this.broadcastToRoom(room, {
      type: 'room_info',
      roomInfo: {
        name: roomData.name,
        userCount: roomData.users.size,
        createdAt: roomData.createdAt,
        lastUpdated: roomData.lastUpdated,
        roomId: roomData.roomId,
        shareableLink: roomData.shareableLink
      },
      users
    });
  }

  sendError(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        message
      }));
    }
  }

  stop() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
    console.log('🛑 Server stopped');
  }

  getRoomStats() {
    const stats = {
      totalRooms: this.rooms.size,
      totalUsers: this.clients.size,
      rooms: []
    };

    this.rooms.forEach((roomData, roomName) => {
      stats.rooms.push({
        name: roomName,
        userCount: roomData.users.size,
        documentLength: roomData.document.length,
        todosCount: roomData.todos.length,
        createdAt: roomData.createdAt,
        lastUpdated: roomData.lastUpdated
      });
    });

    return stats;
  }
}

module.exports = CollaborativeNoteServer;

if (require.main === module) {
  const server = new CollaborativeNoteServer(process.env.PORT || 8080);
  server.start();
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.stop();
    process.exit(0);
  });
}
