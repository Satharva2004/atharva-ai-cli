const Display = require('../utils/display');
const resumeData = require('../data/resume');

class SkillsCommand {
  constructor(options = {}) {
    this.display = new Display(options);
  }

  async execute() {
    const { skills } = resumeData;
    
    console.log(this.display.createSectionHeader('Technical Skills', '🛠️'));
    console.log();
    
    // Programming Languages
    console.log(this.display.highlight('💻 Programming Languages', 'primary'));
    console.log(this.display.formatList(skills.languages, '•', 'cyan'));
    console.log();
    
    // Frameworks
    console.log(this.display.highlight('🔧 Frameworks', 'primary'));
    console.log(this.display.formatList(skills.frameworks, '•', 'cyan'));
    console.log();
    
    // Libraries
    console.log(this.display.highlight('📚 Libraries', 'primary'));
    console.log(this.display.formatList(skills.libraries, '•', 'cyan'));
    console.log();
    
    // Databases
    console.log(this.display.highlight('🗃️ Databases', 'primary'));
    console.log(this.display.formatList(skills.databases, '•', 'cyan'));
    console.log();
    
    // Cloud Technologies
    console.log(this.display.highlight('☁️ Cloud Technologies', 'primary'));
    console.log(this.display.formatList(skills.cloud, '•', 'cyan'));
    console.log();
    
    // Others
    console.log(this.display.highlight('🔨 Others', 'primary'));
    console.log(this.display.formatList(skills.others, '•', 'cyan'));
    console.log();
    
    console.log(this.display.highlight('💡 Interactive exploration:', 'info'));
    console.log('  • atharva chat -m "What\'s your experience with Node.js?"');
    console.log('  • atharva chat -m "Tell me about your cloud skills"');
    console.log('  • atharva chat -m "What databases do you prefer?"');
  }


}

module.exports = SkillsCommand; 