#!/usr/bin/env node

const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');

// Get the directory where this CLI script is located
const cliDir = path.dirname(require.main.filename);
const indexPath = path.join(cliDir, '..', 'index.js');

function showBanner() {
  console.log(chalk.blue('╔══════════════════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.blue('║                        🚀 COLLABORATIVE NOTES CLI                        ║'));
  console.log(chalk.blue('║                    Your Terminal-Based Notion Alternative                    ║'));
  console.log(chalk.blue('╚══════════════════════════════════════════════════════════════════════════════╝'));
  console.log('');
}

function showUsage() {
  console.log(chalk.yellow('📖 Usage:'));
  console.log(chalk.white('  notes                    - Interactive menu mode'));
  console.log(chalk.white('  notes server             - Start the WebSocket server'));
  console.log(chalk.white('  notes client <room>      - Join/create a room as client'));
  console.log(chalk.white('  notes <room>             - Quick join/create a room'));
  console.log('');
  console.log(chalk.yellow('💡 Examples:'));
  console.log(chalk.white('  notes                    - Launch interactive workspace'));
  console.log(chalk.white('  notes server             - Start server on port 8080'));
  console.log(chalk.white('  notes meeting            - Join "meeting" room'));
  console.log(chalk.white('  notes client brainstorm  - Join "brainstorm" room'));
  console.log('');
  console.log(chalk.yellow('🔧 Client Commands:'));
  console.log(chalk.white('  /summarize               - Generate AI summary'));
  console.log(chalk.white('  /copy                    - Copy document to clipboard'));
  console.log(chalk.white('  /share                   - Show shareable room link'));
  console.log(chalk.white('  /date                    - Show document creation/update dates'));
  console.log(chalk.white('  /todo                    - Add checkbox todo item'));
  console.log(chalk.white('  /help                    - Show available commands'));
  console.log(chalk.white('  /exit                    - Leave room and disconnect'));
  console.log('');
  console.log(chalk.yellow('⚙️  Prerequisites:'));
  console.log(chalk.white('  • Create a .env file with: GEMINI_API_KEY=your_api_key_here'));
  console.log(chalk.white('  • Get your API key from: https://makersuite.google.com/app/apikey'));
  console.log('');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Interactive mode
    showBanner();
    const child = spawn('node', [indexPath], { 
      stdio: 'inherit',
      cwd: path.dirname(indexPath)
    });
    
    child.on('exit', (code) => {
      process.exit(code);
    });
    return;
  }
  
  // Handle quick room join (notes <room>)
  if (args.length === 1 && args[0] !== 'server' && args[0] !== 'client' && 
      !args[0].startsWith('-') && !args[0].startsWith('--')) {
    const room = args[0];
    showBanner();
    console.log(chalk.green(`🚀 Quick joining room: "${room}"`));
    
    const child = spawn('node', [indexPath, 'client', room], { 
      stdio: 'inherit',
      cwd: path.dirname(indexPath)
    });
    
    child.on('exit', (code) => {
      process.exit(code);
    });
    return;
  }
  
  // Pass through other commands to index.js
  const child = spawn('node', [indexPath, ...args], { 
    stdio: 'inherit',
    cwd: path.dirname(indexPath)
  });
  
  child.on('exit', (code) => {
    process.exit(code);
  });
}

if (require.main === module) {
  main();
}