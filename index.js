const resumeData = require('./lib/data/resume');
const Display = require('./lib/utils/display');
const NLP = require('./lib/responses/nlp');

// Import all commands
const ChatCommand = require('./lib/commands/chat');
const AboutCommand = require('./lib/commands/about');
const ExperienceCommand = require('./lib/commands/experience');
const SkillsCommand = require('./lib/commands/skills');
const ProjectsCommand = require('./lib/commands/projects');
const EducationCommand = require('./lib/commands/education');
const ContactCommand = require('./lib/commands/contact');

// Main module export for programmatic usage
module.exports = {
  // Version info
  version: require('./package.json').version,
  
  // Resume data
  data: resumeData,
  
  // Utilities
  Display,
  NLP,
  
  // Commands (for programmatic use)
  commands: {
    ChatCommand,
    AboutCommand,
    ExperienceCommand,
    SkillsCommand,
    ProjectsCommand,
    EducationCommand,
    ContactCommand
  },
  
  // Quick access methods
  async getPersonalInfo() {
    return resumeData.personal;
  },
  
  async getExperience() {
    return resumeData.experience;
  },
  
  async getSkills() {
    return resumeData.skills;
  },
  
  async getProjects() {
    return resumeData.projects;
  },
  
  async getEducation() {
    return resumeData.education;
  },
  
  async getContact() {
    const { personal } = resumeData;
    return {
      email: personal.email,
      phone: personal.phone,
      website: personal.website,
      linkedin: personal.linkedin,
      github: personal.github,
      location: personal.location,
      timezone: personal.timezone
    };
  },
  
  // Create formatted resume sections
  async createFormattedSection(section, options = {}) {
    const display = new Display(options);
    const data = resumeData[section];
    
    if (!data) {
      throw new Error(`Section '${section}' not found`);
    }
    
    // This would format different sections
    // Implementation depends on the section type
    return data;
  },
  
  // Interactive chat functionality
  async chat(message, options = {}) {
    const nlp = new NLP(options);
    return await nlp.processInput(message);
  },
  
  // Export resume data in different formats
  async exportResume(format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(resumeData, null, 2);
      
      case 'plain':
        const { personal, experience, skills } = resumeData;
        return `
${personal.name} - ${personal.title}

${personal.bio}

EXPERIENCE:
${experience.map(exp => `${exp.position} at ${exp.company} (${exp.duration})`).join('\n')}

SKILLS:
${Object.entries(skills.languages).map(([level, langs]) => `${level}: ${langs.join(', ')}`).join('\n')}

Contact: ${personal.email}
        `.trim();
      
      default:
        throw new Error(`Format '${format}' not supported`);
    }
  }
};

// If this file is run directly, show help
if (require.main === module) {
  console.log('🎯 Atharva Resume CLI');
  console.log('📦 This is the programmatic interface.');
  console.log('🚀 For the CLI, run: atharva chat');
  console.log('📚 For help, run: atharva help-me');
} 