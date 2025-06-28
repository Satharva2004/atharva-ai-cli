const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const boxen = require('boxen');
const Table = require('cli-table3');
const ora = require('ora');

class Display {
  constructor(options = {}) {
    this.animationsEnabled = options.animations !== false;
    this.colorTheme = options.theme || 'default';
  }

  // Create beautiful ASCII title with gradient
  async createTitle(text = 'ATHARVA') {
    return new Promise((resolve) => {
      figlet(text, {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      }, (err, data) => {
        if (err) {
          resolve(chalk.blue.bold(text));
        } else {
          const gradientTitle = gradient(['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d'])(data);
          resolve(gradientTitle);
        }
      });
    });
  }

  // Typewriter effect for text
  async typewriter(text, speed = 50) {
    if (!this.animationsEnabled) {
      console.log(text);
      return;
    }

    for (let i = 0; i < text.length; i++) {
      process.stdout.write(text[i]);
      await this.sleep(speed);
    }
    console.log();
  }

  // Create beautiful boxes for content
  createBox(content, title = '', options = {}) {
    const defaultOptions = {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      title: title,
      titleAlignment: 'center',
      ...options
    };

    return boxen(content, defaultOptions);
  }

  // Create tables for structured data
  createTable(headers, rows, options = {}) {
    const table = new Table({
      head: headers.map(h => chalk.cyan.bold(h)),
      style: {
        head: [],
        border: ['cyan'],
        compact: false
      },
      ...options
    });

    rows.forEach(row => {
      table.push(row);
    });

    return table.toString();
  }

  // Create progress bars for skills
  createSkillBar(skill, level, maxWidth = 20) {
    const percentage = this.getSkillPercentage(level);
    const filledWidth = Math.round((percentage / 100) * maxWidth);
    const emptyWidth = maxWidth - filledWidth;
    
    const filled = chalk.green('█'.repeat(filledWidth));
    const empty = chalk.gray('░'.repeat(emptyWidth));
    const bar = `${filled}${empty}`;
    
    return `${skill.padEnd(15)} ${bar} ${chalk.cyan(level)}`;
  }

  // Get percentage based on skill level
  getSkillPercentage(level) {
    const levels = {
      'expert': 95,
      'advanced': 80,
      'intermediate': 65,
      'basic': 40,
      'learning': 25
    };
    return levels[level.toLowerCase()] || 50;
  }

  // Create loading spinner
  createSpinner(text = 'Loading...', options = {}) {
    const spinnerOptions = {
      text: chalk.cyan(text),
      spinner: 'dots12',
      color: 'cyan',
      ...options
    };
    return ora(spinnerOptions);
  }

  // Format list items with icons
  formatList(items, icon = '•', color = 'cyan') {
    return items.map(item => `  ${chalk[color](icon)} ${item}`).join('\n');
  }

  // Create section headers
  createSectionHeader(title, icon = '🔷') {
    const header = `${icon} ${title.toUpperCase()}`;
    return chalk.bold.blue(header) + '\n' + chalk.blue('─'.repeat(header.length - 2));
  }

  // Create highlighted text
  highlight(text, type = 'info') {
    const styles = {
      success: chalk.green.bold,
      error: chalk.red.bold,
      warning: chalk.yellow.bold,
      info: chalk.cyan.bold,
      primary: chalk.blue.bold,
      secondary: chalk.gray
    };
    return styles[type] ? styles[type](text) : text;
  }

  // Create badges for technologies
  createTechBadge(tech) {
    const colors = ['magenta', 'blue', 'green', 'yellow', 'cyan', 'red'];
    const color = colors[tech.length % colors.length];
    return chalk.bgHex('#2d3748').hex('#ffffff')(` ${tech} `);
  }

  // Format contact information
  formatContact(contact) {
    const icons = {
      email: '📧',
      phone: '📱',
      website: '🌐',
      linkedin: '💼',
      github: '🐙',
      location: '📍'
    };

    return Object.entries(contact)
      .filter(([key, value]) => value && icons[key])
      .map(([key, value]) => `${icons[key]} ${chalk.cyan.bold(key.toUpperCase())}: ${chalk.white(value)}`)
      .join('\n');
  }

  // Create timeline for experience
  createTimeline(experiences) {
    return experiences.map((exp, index) => {
      const isLast = index === experiences.length - 1;
      const connector = isLast ? '└─' : '├─';
      const line = isLast ? '  ' : '│ ';
      
      return [
        `${chalk.cyan(connector)} ${chalk.bold.white(exp.position)}`,
        `${line}   ${chalk.gray(exp.company)} • ${chalk.yellow(exp.duration)}`,
        `${line}   ${chalk.gray(exp.location)} • ${chalk.gray(exp.type)}`,
        `${line}`,
        `${line}   ${exp.description}`,
        isLast ? '' : `${line}`
      ].join('\n');
    }).join('\n');
  }

  // Sleep utility for animations
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear screen
  clear() {
    console.clear();
  }

  // Create welcome message
  async createWelcome() {
    const title = await this.createTitle();
    const subtitle = chalk.gray('Interactive Resume CLI - Learn about Atharva');
    const tips = [
      'Ask me about my experience, skills, or projects',
      'Type specific commands like "experience" or "skills"',
      'Use "help" to see all available commands',
      'Type "exit" anytime to quit'
    ];

    console.log(title);
    console.log();
    console.log(chalk.cyan.bold('Welcome to my interactive resume! 👋'));
    console.log();
    console.log(subtitle);
    console.log();
    console.log(chalk.yellow.bold('💡 Tips for getting started:'));
    console.log(this.formatList(tips, '•', 'gray'));
    console.log();
  }

  // Display section divider
  showDivider(char = '─', length = 50, color = 'gray') {
    console.log(chalk[color](char.repeat(length)));
  }

  // Format currency or numbers
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Show typing indicator
  async showTyping(duration = 1000) {
    if (!this.animationsEnabled) return;
    
    const spinner = this.createSpinner('Thinking...');
    spinner.start();
    await this.sleep(duration);
    spinner.stop();
  }
}

module.exports = Display; 