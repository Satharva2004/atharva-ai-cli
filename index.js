#!/usr/bin/env node

const chalk = require('chalk');
const readline = require('readline');
const CollaborativeNoteServer = require('./server');
const CollaborativeNoteClient = require('./client');

function showBanner() {
  console.clear();
  console.log(chalk.blue('╔══════════════════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.blue('║                        🚀 COLLABORATIVE NOTES WORKSPACE                    ║'));
  console.log(chalk.blue('║                    Your Terminal-Based Notion Alternative                    ║'));
  console.log(chalk.blue('╚══════════════════════════════════════════════════════════════════════════════╝'));
  console.log('');
}

function showMainMenu() {
  console.log(chalk.cyan('📋 Main Menu:'));
  console.log(chalk.white('─'.repeat(60)));
  console.log(chalk.yellow('1️⃣ ') + chalk.white('Start Server'));
  console.log(chalk.yellow('2️⃣ ') + chalk.white('Join/Create Room'));
  console.log(chalk.yellow('3️⃣ ') + chalk.white('Browse Available Rooms'));
  console.log(chalk.yellow('4️⃣ ') + chalk.white('Help & Documentation'));
  console.log(chalk.yellow('5️⃣ ') + chalk.white('Exit'));
  console.log(chalk.white('─'.repeat(60)));
}

function showRoomMenu() {
  console.log(chalk.cyan('🏠 Room Management:'));
  console.log(chalk.white('─'.repeat(60)));
  console.log(chalk.yellow('1️⃣ ') + chalk.white('Join Existing Room'));
  console.log(chalk.yellow('2️⃣ ') + chalk.white('Create New Room'));
  console.log(chalk.yellow('3️⃣ ') + chalk.white('Back to Main Menu'));
  console.log(chalk.white('─'.repeat(60)));
}

function showUsage() {
  console.log(chalk.yellow('📖 Usage:'));
  console.log(chalk.white('  node index.js                    - Interactive menu mode'));
  console.log(chalk.white('  node index.js server             - Start the WebSocket server'));
  console.log(chalk.white('  node index.js client <room>      - Join/create a room as client'));
  console.log('');
  console.log(chalk.yellow('💡 Examples:'));
  console.log(chalk.white('  node index.js                    - Launch interactive workspace'));
  console.log(chalk.white('  node index.js server             - Start server on port 8080'));
  console.log(chalk.white('  node index.js client meeting     - Join "meeting" room'));
  console.log('');
  console.log(chalk.yellow('🔧 Client Commands:'));
  console.log(chalk.white('  /summarize                       - Generate AI summary'));
  console.log(chalk.white('  /status                          - Show connection status'));
  console.log(chalk.white('  /users                           - Show room user count'));
  console.log(chalk.white('  /help                            - Show available commands'));
  console.log(chalk.white('  /clear                           - Clear terminal screen'));
  console.log(chalk.white('  /exit                            - Leave room and disconnect'));
  console.log('');
  console.log(chalk.yellow('⚙️  Prerequisites:'));
  console.log(chalk.white('  • Create a .env file with: GEMINI_API_KEY=your_api_key_here'));
  console.log(chalk.white('  • Get your API key from: https://makersuite.google.com/app/apikey'));
  console.log('');
}

function startServer() {
  console.log(chalk.green('🚀 Starting Collaborative Notes Server...'));
  console.log(chalk.blue('📝 Server will run on port 8080'));
  console.log(chalk.yellow('💡 Clients can connect to: ws://localhost:8080'));
  console.log(chalk.white('─'.repeat(60)));
  
  try {
    const server = new CollaborativeNoteServer(8080);
    server.start();
    
    console.log(chalk.green('✅ Server is running!'));
    console.log(chalk.cyan('💡 Press Ctrl+C to stop the server'));
    console.log(chalk.gray('📊 Server will show real-time connection and activity logs'));
    
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Shutting down server gracefully...'));
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error(chalk.red(`❌ Failed to start server: ${error.message}`));
    process.exit(1);
  }
}

async function startClient(room, userName) {
  if (!room) {
    console.log(chalk.red('❌ Error: Room name is required'));
    return false;
  }

  // Validate room name
  if (room.length < 1 || room.length > 50) {
    console.log(chalk.red('❌ Error: Room name must be between 1-50 characters'));
    return false;
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(room)) {
    console.log(chalk.red('❌ Error: Room name can only contain letters, numbers, hyphens, and underscores'));
    return false;
  }

  console.log(chalk.green('🔌 Starting Collaborative Notes Client...'));
  console.log(chalk.blue(`📝 Room: "${room}"`));
  console.log(chalk.cyan(`👤 User: "${userName}"`));
  console.log(chalk.yellow('💡 Connecting to: ws://localhost:8080'));
  console.log(chalk.white('─'.repeat(60)));
  
  try {
    // Generate a unique client ID
    const clientId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const client = new CollaborativeNoteClient('ws://localhost:8080', room, clientId, userName);
    client.connect();
    
    console.log(chalk.green('✅ Client started successfully!'));
    console.log(chalk.cyan('💡 Press Ctrl+C to disconnect'));
    
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Shutting down client gracefully...'));
      client.cleanup();
    });
    
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to start client: ${error.message}`));
    return false;
  }
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  while (true) {
    showBanner();
    showMainMenu();
    
    const choice = await question(chalk.cyan('🎯 Choose an option (1-5): '));
    
    switch (choice.trim()) {
      case '1':
        console.log(chalk.green('\n🚀 Starting server mode...'));
        rl.close();
        startServer();
        return;
        
      case '2':
        await handleRoomManagement(rl, question);
        break;
        
      case '3':
        await browseRooms(question);
        break;
        
      case '4':
        showUsage();
        await question(chalk.yellow('\n📖 Press Enter to continue...'));
        break;
        
      case '5':
        console.log(chalk.blue('\n👋 Thanks for using Collaborative Notes!'));
        rl.close();
        process.exit(0);
        break;
        
      default:
        console.log(chalk.red('\n❌ Invalid option. Please choose 1-5.'));
        await question(chalk.yellow('Press Enter to continue...'));
    }
  }
}

async function handleRoomManagement(rl, question) {
  while (true) {
    showBanner();
    showRoomMenu();
    
    const choice = await question(chalk.cyan('🎯 Choose an option (1-3): '));
    
    switch (choice.trim()) {
      case '1':
        await joinExistingRoom(rl, question);
        break;
        
      case '2':
        await createNewRoom(rl, question);
        break;
        
      case '3':
        return; // Back to main menu
        
      default:
        console.log(chalk.red('\n❌ Invalid option. Please choose 1-3.'));
        await question(chalk.yellow('Press Enter to continue...'));
    }
  }
}

async function joinExistingRoom(rl, question) {
  showBanner();
  console.log(chalk.cyan('🔗 Join Existing Room'));
  console.log(chalk.white('─'.repeat(60)));
  
  const roomName = await question(chalk.blue('📝 Enter room name: '));
  const userName = await question(chalk.blue('👤 Enter your name: '));
  
  if (!roomName.trim() || !userName.trim()) {
    console.log(chalk.red('\n❌ Room name and user name are required!'));
    await question(chalk.yellow('Press Enter to continue...'));
    return;
  }
  
  const success = await startClient(roomName.trim(), userName.trim());
  if (success) {
    return; // Client started successfully
  }
  
  await question(chalk.yellow('Press Enter to continue...'));
}

async function createNewRoom(rl, question) {
  showBanner();
  console.log(chalk.cyan('✨ Create New Room'));
  console.log(chalk.white('─'.repeat(60)));
  
  const roomName = await question(chalk.blue('📝 Enter new room name: '));
  const userName = await question(chalk.blue('👤 Enter your name: '));
  
  if (!roomName.trim() || !userName.trim()) {
    console.log(chalk.red('\n❌ Room name and user name are required!'));
    await question(chalk.yellow('Press Enter to continue...'));
    return;
  }
  
  console.log(chalk.green(`\n✨ Creating room "${roomName}"...`));
  const success = await startClient(roomName.trim(), userName.trim());
  if (success) {
    return; // Client started successfully
  }
  
  await question(chalk.yellow('Press Enter to continue...'));
}

async function browseRooms(question) {
  showBanner();
  console.log(chalk.cyan('🔍 Browse Available Rooms'));
  console.log(chalk.white('─'.repeat(60)));
  
  // For now, we'll show a placeholder since we need server integration
  console.log(chalk.yellow('📋 Available Rooms:'));
  console.log(chalk.gray('  • meeting-notes (2 users)'));
  console.log(chalk.gray('  • project-brainstorm (1 user)'));
  console.log(chalk.gray('  • study-group (0 users)'));
  console.log('');
  console.log(chalk.blue('💡 Note: Room information requires server to be running'));
  console.log(chalk.white('─'.repeat(60)));
  
  await question(chalk.yellow('Press Enter to continue...'));
}

function showVersion() {
  const packageJson = require('./package.json');
  console.log(chalk.blue(`📦 Collaborative Notes CLI v${packageJson.version}`));
  console.log(chalk.gray(`📝 ${packageJson.description}`));
  console.log('');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Interactive mode
    interactiveMode();
    return;
  }
  
  showBanner();
  
  const mode = args[0].toLowerCase();
  
  switch (mode) {
    case 'server': 
      startServer(); 
      break;
      
    case 'client': 
      if (!args[1]) {
        console.log(chalk.red('❌ Error: Room name is required for client mode'));
        console.log(chalk.blue('💡 Usage: node index.js client <room>'));
        process.exit(1);
      }
      startClient(args[1], `User_${Math.random().toString(36).substr(2, 6)}`);
      break;
      
    case 'version':
    case '--version':
    case '-v':
      showVersion();
      process.exit(0);
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showUsage(); 
      process.exit(0); 
      break;
      
    default:
      console.log(chalk.red(`❌ Unknown mode: ${mode}`));
      console.log(chalk.blue('💡 Available modes: server, client'));
      console.log(chalk.yellow('💡 Use "node index.js" for interactive mode'));
      showUsage();
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { CollaborativeNoteServer, CollaborativeNoteClient }; 