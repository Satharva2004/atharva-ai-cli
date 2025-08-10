#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');

// Handle help argument locally
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Handle version argument locally
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(chalk.blue('collaborative-notes-cli v2.0.0'));
  process.exit(0);
}

// Pass all other arguments to index.js
const args = process.argv.slice(2);
const child = spawn('node', ['index.js', ...args], {
  stdio: 'inherit',
  cwd: __dirname + '/..'
});

child.on('close', (code) => {
  process.exit(code);
});

function showHelp() {
  console.log(chalk.blue('╔══════════════════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.blue('║                    🚀 COLLABORATIVE NOTES CLI v2.0.0                      ║'));
  console.log(chalk.blue('╚══════════════════════════════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.yellow('📖 Usage:'));
  console.log(chalk.white('  notes server                    - Start the collaborative notes server'));
  console.log(chalk.white('  notes client <room> [username]  - Join/create a room as client'));
  console.log(chalk.white('  notes client meeting            - Join "meeting" room'));
  console.log(chalk.white('  notes client project-notes      - Join "project-notes" room'));
  console.log(chalk.white('  notes client daily-standup John - Join "daily-standup" room as John'));
  console.log('');
  console.log(chalk.yellow('🔧 Commands:'));
  console.log(chalk.white('  /help                           - Show available commands'));
  console.log(chalk.white('  /summarize                      - Generate AI summary of notes'));
  console.log(chalk.white('  /copy                           - Copy document to clipboard'));
  console.log(chalk.white('  /share                          - Show shareable room link'));
  console.log(chalk.white('  /date                           - Show room creation/update dates'));
  console.log(chalk.white('  /todo                           - Add checkbox todo item'));
  console.log(chalk.white('  /clear                          - Clear terminal screen'));
  console.log(chalk.white('  /status                         - Show connection status'));
  console.log(chalk.white('  /users                          - Show connected users'));
  console.log(chalk.white('  /room                           - Show room information'));
  console.log(chalk.white('  /exit                           - Leave room and disconnect'));
  console.log('');
  console.log(chalk.yellow('⚙️  Prerequisites:'));
  console.log(chalk.white('  • Platform is ready to use immediately!'));
  console.log(chalk.white('  • AI features are powered by our public API key'));
  console.log('');
  console.log(chalk.yellow('🌐 Features:'));
  console.log(chalk.white('  • Real-time collaborative note-taking'));
  console.log(chalk.white('  • AI-powered document summarization'));
  console.log(chalk.white('  • Checkbox-based todo lists'));
  console.log(chalk.white('  • Cool and awesome user names'));
  console.log(chalk.white('  • Document sharing and copying'));
  console.log(chalk.white('  • Room creation and management'));
  console.log('');
  console.log(chalk.cyan('💡 Tip: Use "notes server" to start the server, then "notes client <room>" in another terminal'));
}