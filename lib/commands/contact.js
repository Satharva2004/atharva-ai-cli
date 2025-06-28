const Display = require('../utils/display');
const resumeData = require('../data/resume');

class ContactCommand {
  constructor(options = {}) {
    this.display = new Display(options);
  }

  async execute() {
    const { personal } = resumeData;
    
    console.log(this.display.createSectionHeader('Get In Touch', '📞'));
    console.log();
    
    const contactInfo = {
      email: personal.email,
      phone: personal.phone,
      website: personal.website,
      linkedin: personal.linkedin,
      github: personal.github,
      location: personal.location
    };
    
    const contactContent = `
${this.display.formatContact(contactInfo)}

⏰ ${this.display.highlight('Timezone:', 'info')} ${personal.timezone}
💼 ${this.display.highlight('Availability:', 'info')} ${personal.availability}

${this.display.highlight('📝 Professional Links:', 'info')}
${this.display.formatList([
  `Portfolio: ${personal.website}`,
  `LinkedIn: ${personal.linkedin}`,
  `GitHub: ${personal.github}`
], '🔗', 'cyan')}

${this.display.highlight('💌 Best Ways to Reach Me:', 'info')}
${this.display.formatList([
  'Email for formal inquiries and opportunities',
  'LinkedIn for professional networking',
  'GitHub for technical discussions and collaborations'
], '•', 'yellow')}
`;

    console.log(this.display.createBox(contactContent.trim(), '📞 Contact Information'));
    
    console.log();
    console.log(this.display.highlight('💡 Quick connect:', 'info'));
    console.log('  • I typically respond to emails within 24 hours');
    console.log('  • Available for calls during IST business hours');
    console.log('  • Open to discussing exciting opportunities!');
  }
}

module.exports = ContactCommand; 