const Display = require('../utils/display');
const resumeData = require('../data/resume');

class AboutCommand {
  constructor(options = {}) {
    this.display = new Display(options);
  }

  async execute() {
    const { personal } = resumeData;
    
    console.log(await this.display.createTitle());
    console.log();
    
    await this.display.typewriter(`👋 Hi! I'm ${personal.name}`, 30);
    console.log();
    
    const aboutContent = `
${this.display.highlight(personal.title, 'primary')}

${personal.bio}

📍 ${this.display.highlight('Location:', 'info')} ${personal.location}
⏰ ${this.display.highlight('Timezone:', 'info')} ${personal.timezone}
💼 ${this.display.highlight('Status:', 'info')} ${personal.availability}

${this.display.highlight('🎯 Current Focus:', 'info')}
${this.display.formatList(resumeData.currentFocus.slice(0, 4), '•', 'cyan')}

${this.display.highlight('🌟 Interests:', 'info')}
${this.display.formatList(personal.interests.slice(0, 4), '•', 'yellow')}
`;

    console.log(this.display.createBox(aboutContent.trim(), '👨‍💻 About Me'));
    
    console.log();
    console.log(this.display.highlight('💡 Learn more:', 'info'));
    console.log('  • atharva experience - See my work history');
    console.log('  • atharva skills - View technical abilities');
    console.log('  • atharva projects - Browse my portfolio');
    console.log('  • atharva chat - Start an interactive conversation');
  }
}

module.exports = AboutCommand; 