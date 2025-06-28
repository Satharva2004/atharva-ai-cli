const Display = require('../utils/display');
const resumeData = require('../data/resume');

class EducationCommand {
  constructor(options = {}) {
    this.display = new Display(options);
  }

  async execute() {
    const { education, certifications, languages } = resumeData;
    
    console.log(this.display.createSectionHeader('Education & Qualifications', '🎓'));
    console.log();
    
    // Education
    education.forEach(edu => {
      const eduContent = `
${this.display.highlight(edu.degree, 'primary')} in ${edu.field}
${edu.institution} • ${edu.duration}
${this.display.highlight('Grade:', 'info')} ${edu.grade}

${this.display.highlight('🏆 Academic Achievements:', 'info')}
${this.display.formatList(edu.achievements, '✓', 'green')}

${this.display.highlight('📚 Relevant Coursework:', 'info')}
${this.display.formatList(edu.relevant_courses, '•', 'cyan')}
`;

      console.log(this.display.createBox(eduContent.trim(), '🎓 Academic Background'));
    });
    
    console.log();
    
    // Certifications
    if (certifications.length > 0) {
      const certContent = certifications.map(cert => 
        `${this.display.highlight(cert.name, 'primary')}\n` +
        `${cert.issuer} • ${cert.date}\n` +
        `${this.display.highlight('Status:', 'info')} ${cert.status}\n` +
        `${this.display.highlight('Credential:', 'info')} ${cert.credential}`
      ).join('\n\n');
      
      console.log(this.display.createBox(certContent, '📜 Professional Certifications'));
    }
    
    console.log();
    
    // Languages
    if (languages.length > 0) {
      const langContent = languages.map(lang => 
        `${this.display.highlight(lang.name, 'primary')}: ${lang.proficiency}`
      ).join('\n');
      
      console.log(this.display.createBox(langContent, '🌍 Languages'));
    }
    
    console.log();
    console.log(this.display.highlight('💡 Interactive exploration:', 'info'));
    console.log('  • atharva chat -m "Tell me about your university experience"');
    console.log('  • atharva chat -m "What certifications do you have?"');
    console.log('  • atharva chat -m "What did you study in college?"');
  }
}

module.exports = EducationCommand; 