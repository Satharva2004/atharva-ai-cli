const Display = require('../utils/display');
const resumeData = require('../data/resume');

class ExperienceCommand {
  constructor(options = {}) {
    this.display = new Display(options);
  }

  async execute() {
    const { experience } = resumeData;
    
    console.log(this.display.createSectionHeader('Professional Experience', '💼'));
    console.log();
    
    // Show timeline
    console.log(this.display.createTimeline(experience));
    console.log();
    
    // Show detailed view of current position
    const currentJob = experience[0];
    await this.showJobDetail(currentJob, 'Current Position');
    
    console.log();
    console.log(this.display.highlight('💡 Interactive exploration:', 'info'));
    console.log('  • atharva chat -m "Tell me about your current job"');
    console.log('  • atharva chat -m "What technologies do you use?"');
    console.log('  • atharva chat -m "What are your biggest achievements?"');
  }

  async showJobDetail(job, title) {
    const jobContent = `
${this.display.highlight(job.position, 'primary')} at ${this.display.highlight(job.company, 'success')}
${job.duration} • ${job.location} • ${job.type}

${job.description}

${this.display.highlight('🏆 Key Achievements:', 'info')}
${this.display.formatList(job.achievements.slice(0, 5), '✓', 'green')}

${this.display.highlight('🛠️ Technologies Used:', 'info')}
${job.technologies.map(tech => this.display.createTechBadge(tech)).join(' ')}
`;

    console.log(this.display.createBox(jobContent.trim(), `💼 ${title}`));
  }
}

module.exports = ExperienceCommand; 