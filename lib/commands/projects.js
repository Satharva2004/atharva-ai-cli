const Display = require('../utils/display');
const resumeData = require('../data/resume');

class ProjectsCommand {
  constructor(options = {}) {
    this.display = new Display(options);
  }

  async execute() {
    const { projects } = resumeData;
    
    console.log(this.display.createSectionHeader('Featured Projects', '🚀'));
    console.log();
    
    // Show project overview
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${this.display.highlight(project.name, 'primary')} (${project.category})`);
      console.log(`   ${project.description}`);
      console.log(`   ${this.display.highlight('Status:', 'info')} ${project.status}`);
      console.log();
    });
    
    // Show detailed view of featured project
    const featuredProject = projects[0]; // Atharva CLI
    await this.showProjectDetail(featuredProject, 'Featured Project');
    
    console.log();
    console.log(this.display.highlight('💡 Interactive exploration:', 'info'));
    console.log('  • atharva chat -m "Tell me about the Atharva CLI project"');
    console.log('  • atharva chat -m "What technologies did you use?"');
    console.log('  • atharva chat -m "Show me your GitHub projects"');
  }

  async showProjectDetail(project, title) {
    const projectContent = `
${this.display.highlight(project.name, 'primary')} - ${project.category}

${project.description}

${this.display.highlight('✨ Key Features:', 'info')}
${this.display.formatList(project.features, '✓', 'green')}

${this.display.highlight('🛠️ Technologies:', 'info')}
${project.technologies.map(tech => this.display.createTechBadge(tech)).join(' ')}

${this.display.highlight('📊 Status:', 'info')} ${project.status}
${project.github ? `\n🔗 ${this.display.highlight('GitHub:', 'info')} ${project.github}` : ''}
${project.demo ? `\n🌐 ${this.display.highlight('Demo:', 'info')} ${project.demo}` : ''}
`;

    console.log(this.display.createBox(projectContent.trim(), `🚀 ${title}`));
  }
}

module.exports = ProjectsCommand; 