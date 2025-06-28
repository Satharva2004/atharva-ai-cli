const inquirer = require('inquirer');
const chalk = require('chalk');
const Display = require('../utils/display');
const NLP = require('../responses/nlp');

class ChatCommand {
  constructor(options = {}) {
    this.display = new Display(options);
    this.nlp = new NLP(options);
    this.sessionActive = false;
  }

  async execute(message = null) {
    if (message) {
      // Direct message mode
      return await this.handleDirectMessage(message);
    } else {
      // Interactive chat mode
      return await this.startInteractiveChat();
    }
  }

  async handleDirectMessage(message) {
    console.log(chalk.blue('💬 You:'), message);
    const response = await this.nlp.processInput(message);
    console.log(chalk.green('🤖 Atharva:'), response);
  }

  async startInteractiveChat() {
    this.sessionActive = true;
    
    // Show welcome message
    await this.display.createWelcome();
    
    console.log(chalk.yellow('💡 Type "exit" anytime to quit\n'));

    // Main chat loop
    while (this.sessionActive) {
      try {
        const { message } = await inquirer.prompt([
          {
            type: 'input',
            name: 'message',
            message: chalk.blue('You:'),
            validate: input => input.trim().length > 0 || 'Please enter a message'
          }
        ]);

        // Check for exit commands
        if (this.isExitCommand(message)) {
          await this.handleExit();
          break;
        }

        // Process the message
        const response = await this.nlp.processInput(message);
        console.log(chalk.green('🤖 Atharva:'), response);
        console.log(); // Add spacing

        // Show contextual suggestions occasionally
        if (Math.random() < 0.3) {
          this.showSuggestions();
        }

      } catch (error) {
        if (error.name === 'ExitPromptError') {
          // User pressed Ctrl+C
          await this.handleExit();
          break;
        } else {
          console.log(chalk.red('❌ Something went wrong. Please try again.'));
        }
      }
    }
  }

  isExitCommand(message) {
    const exitCommands = ['exit', 'quit', 'bye', 'goodbye', 'stop'];
    return exitCommands.includes(message.toLowerCase().trim());
  }

  async handleExit() {
    this.sessionActive = false;
    
    const exitMessages = [
      "Thanks for learning about Atharva! 👋",
      "Hope you found what you were looking for! 🌟",
      "Feel free to come back anytime! 🚀",
      "Great chatting with you! 💼"
    ];
    
    const randomExit = exitMessages[Math.floor(Math.random() * exitMessages.length)];
    
    console.log(chalk.yellow(randomExit));
    console.log(chalk.gray('📞 Don\'t forget to get in touch if you have opportunities!'));
  }

  showSuggestions() {
    const suggestions = [
      "Ask about specific projects",
      "Learn about technical skills",
      "Explore work experience",
      "Get contact information"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    console.log(chalk.gray(`💡 Suggestion: ${randomSuggestion}`));
  }
}

module.exports = ChatCommand; 