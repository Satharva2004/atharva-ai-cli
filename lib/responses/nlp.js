const resumeData = require('../data/resume');
const Display = require('../utils/display');

class NaturalLanguageProcessor {
  constructor(options = {}) {
    this.display = new Display(options);
    this.context = {};
    this.conversationHistory = [];
    
    // Intent patterns for different types of questions
    this.intentPatterns = {
      greeting: [
        /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))/i,
        /^(what's\s+up|how\s+are\s+you)/i
      ],
      
      about: [
        /(who\s+are\s+you|tell\s+me\s+about|about\s+yourself|introduction|bio)/i,
        /(your\s+background|personal\s+info)/i
      ],
      
      experience: [
        /(work\s+experience|job\s+history|career|professional\s+experience)/i,
        /(previous\s+jobs|employment|companies\s+worked)/i,
        /(what\s+have\s+you\s+worked\s+on|work\s+history)/i
      ],
      
      skills: [
        /(skills|technologies|programming\s+languages|tech\s+stack)/i,
        /(what\s+can\s+you\s+do|abilities|expertise|proficient)/i,
        /(languages\s+you\s+know|frameworks|tools)/i
      ],
      
      projects: [
        /(projects|portfolio|work\s+samples|things\s+built)/i,
        /(github|code|repositories|what\s+have\s+you\s+built)/i
      ],
      
      education: [
        /(education|degree|university|college|academic)/i,
        /(where\s+did\s+you\s+study|qualifications|certifications)/i
      ],
      
      contact: [
        /(contact|reach\s+you|get\s+in\s+touch|email|phone)/i,
        /(how\s+to\s+contact|social\s+media|linkedin|github)/i
      ],
      
      help: [
        /(help|commands|what\s+can\s+i\s+ask|options)/i,
        /(how\s+does\s+this\s+work|guide)/i
      ]
    };

    // Common question variations
    this.questionVariations = {
      experience: [
        "Tell me about your work experience",
        "What companies have you worked for?",
        "Describe your professional background",
        "What's your career history?"
      ],
      skills: [
        "What are your technical skills?",
        "What programming languages do you know?",
        "What's your tech stack?",
        "What tools and frameworks do you use?"
      ],
      projects: [
        "Show me your projects",
        "What have you built?",
        "Tell me about your portfolio",
        "What are your notable projects?"
      ]
    };
  }

  // Main method to process user input
  async processInput(input) {
    const cleanInput = input.trim().toLowerCase();
    this.conversationHistory.push({ user: input, timestamp: new Date() });

    // Detect intent
    const intent = this.detectIntent(cleanInput);
    
    // Generate appropriate response
    const response = await this.generateResponse(intent, cleanInput);
    
    this.conversationHistory.push({ bot: response, timestamp: new Date() });
    return response;
  }

  // Detect user intent from input
  detectIntent(input) {
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(input)) {
          return intent;
        }
      }
    }
    
    // Check for specific keywords
    if (this.containsKeywords(input, ['javascript', 'python', 'node', 'react'])) {
      return 'skills';
    }
    
    if (this.containsKeywords(input, ['github', 'project', 'built', 'code'])) {
      return 'projects';
    }
    
    if (this.containsKeywords(input, ['job', 'company', 'work', 'career'])) {
      return 'experience';
    }

    return 'general';
  }

  // Check if input contains specific keywords
  containsKeywords(input, keywords) {
    return keywords.some(keyword => input.includes(keyword));
  }

  // Generate response based on intent
  async generateResponse(intent, input) {
    await this.display.showTyping(800);

    switch (intent) {
      case 'greeting':
        return this.handleGreeting();
      
      case 'about':
        return this.handleAbout();
      
      case 'experience':
        return this.handleExperience(input);
      
      case 'skills':
        return this.handleSkills(input);
      
      case 'projects':
        return this.handleProjects(input);
      
      case 'education':
        return this.handleEducation();
      
      case 'contact':
        return this.handleContact();
      
      case 'help':
        return this.handleHelp();
      
      default:
        return this.handleGeneral(input);
    }
  }

  // Handler methods for different intents
  handleGreeting() {
    const greetings = [
      "Hello! 👋 I'm Atharva's interactive resume. I'm here to tell you all about his professional background, skills, and experience!",
      "Hi there! 🌟 Welcome to my interactive resume. Feel free to ask me anything about Atharva's career, projects, or skills!",
      "Greetings! 🚀 I'm excited to share Atharva's professional journey with you. What would you like to know?"
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return `${randomGreeting}\n\n${this.display.highlight('💡 Try asking:', 'info')} "Tell me about your experience" or "What are your skills?"`;
  }

  handleAbout() {
    const { personal } = resumeData;
    
    return this.display.createBox(
      `${this.display.highlight(personal.name, 'primary')} - ${personal.title}\n\n` +
      `${personal.bio}\n\n` +
      `📍 ${personal.location} • ${personal.timezone}\n` +
      `💼 ${personal.availability}\n\n` +
      `🎯 ${this.display.highlight('Current Focus:', 'info')}\n` +
      this.display.formatList(resumeData.currentFocus.slice(0, 3), '•', 'cyan'),
      '👨‍💻 About Atharva'
    );
  }

  handleExperience(input) {
    const { experience } = resumeData;
    
    // Check for specific company or role queries
    if (input.includes('current') || input.includes('latest')) {
      const currentJob = experience[0];
      return this.formatExperienceDetail(currentJob, 'Current Position');
    }
    
    if (input.includes('first') || input.includes('started')) {
      const firstJob = experience[experience.length - 1];
      return this.formatExperienceDetail(firstJob, 'Career Start');
    }
    
    // Return timeline of all experience
    return this.display.createBox(
      this.display.createTimeline(experience) + '\n\n' +
      this.display.highlight('💡 Ask about:', 'info') + ' "current job", "first job", or specific companies',
      '💼 Professional Experience'
    );
  }

  formatExperienceDetail(job, title) {
    return this.display.createBox(
      `${this.display.highlight(job.position, 'primary')} at ${this.display.highlight(job.company, 'success')}\n` +
      `${job.duration} • ${job.location} • ${job.type}\n\n` +
      `${job.description}\n\n` +
      `🏆 ${this.display.highlight('Key Achievements:', 'info')}\n` +
      this.display.formatList(job.achievements, '✓', 'green') + '\n\n' +
      `🛠️ ${this.display.highlight('Technologies:', 'info')}\n` +
      job.technologies.map(tech => this.display.createTechBadge(tech)).join(' '),
      `💼 ${title}`
    );
  }

  handleSkills(input) {
    const { skills } = resumeData;
    
    // Check for specific skill category queries
    if (input.includes('language') || input.includes('programming')) {
      return this.formatSkillCategory('Programming Languages', skills.languages);
    }
    
    if (input.includes('framework') || input.includes('library')) {
      return this.formatSkillCategory('Frameworks & Libraries', skills.frameworks);
    }
    
    if (input.includes('database') || input.includes('db')) {
      return this.formatSkillCategory('Databases', skills.databases);
    }
    
    if (input.includes('cloud') || input.includes('aws')) {
      return this.formatSkillCategory('Cloud & DevOps', skills.cloud);
    }
    
    // Return overview of all skills
    let skillsOutput = this.display.createSectionHeader('Technical Skills', '🛠️') + '\n\n';
    
    // Programming Languages with skill bars
    skillsOutput += this.display.highlight('Programming Languages:', 'info') + '\n';
    Object.entries(skills.languages).forEach(([level, langs]) => {
      langs.forEach(lang => {
        skillsOutput += this.display.createSkillBar(lang, level) + '\n';
      });
    });
    
    skillsOutput += '\n' + this.display.highlight('💡 Ask about specific categories:', 'info') + ' "frameworks", "databases", "cloud skills"';
    
    return this.display.createBox(skillsOutput, '🛠️ Technical Skills');
  }

  formatSkillCategory(title, category) {
    let output = `${this.display.highlight(title, 'primary')}\n\n`;
    
    Object.entries(category).forEach(([subcat, items]) => {
      output += `${this.display.highlight(subcat.replace('_', ' ').toUpperCase(), 'info')}:\n`;
      output += this.display.formatList(items, '•', 'cyan') + '\n\n';
    });
    
    return this.display.createBox(output, `🛠️ ${title}`);
  }

  handleProjects(input) {
    const { projects } = resumeData;
    
    // Check for specific project queries
    const projectNames = projects.map(p => p.name.toLowerCase());
    const mentionedProject = projectNames.find(name => input.includes(name.toLowerCase()));
    
    if (mentionedProject) {
      const project = projects.find(p => p.name.toLowerCase() === mentionedProject);
      return this.formatProjectDetail(project);
    }
    
    // Return overview of all projects
    let projectsOutput = '';
    projects.forEach((project, index) => {
      projectsOutput += `${index + 1}. ${this.display.highlight(project.name, 'primary')} (${project.category})\n`;
      projectsOutput += `   ${project.description}\n`;
      projectsOutput += `   ${this.display.highlight('Status:', 'info')} ${project.status}\n\n`;
    });
    
    projectsOutput += this.display.highlight('💡 Ask about specific projects by name!', 'info');
    
    return this.display.createBox(projectsOutput, '🚀 Featured Projects');
  }

  formatProjectDetail(project) {
    return this.display.createBox(
      `${this.display.highlight(project.name, 'primary')} - ${project.category}\n\n` +
      `${project.description}\n\n` +
      `🏆 ${this.display.highlight('Key Features:', 'info')}\n` +
      this.display.formatList(project.features, '✓', 'green') + '\n\n' +
      `🛠️ ${this.display.highlight('Technologies:', 'info')}\n` +
      project.technologies.map(tech => this.display.createTechBadge(tech)).join(' ') + '\n\n' +
      `📊 ${this.display.highlight('Status:', 'info')} ${project.status}` +
      (project.github ? `\n🔗 ${this.display.highlight('GitHub:', 'info')} ${project.github}` : '') +
      (project.demo ? `\n🌐 ${this.display.highlight('Demo:', 'info')} ${project.demo}` : ''),
      `🚀 ${project.name}`
    );
  }

  handleEducation() {
    const { education, certifications } = resumeData;
    
    let eduOutput = '';
    
    education.forEach(edu => {
      eduOutput += `${this.display.highlight(edu.degree, 'primary')} in ${edu.field}\n`;
      eduOutput += `${edu.institution} • ${edu.duration}\n`;
      eduOutput += `Grade: ${this.display.highlight(edu.grade, 'success')}\n\n`;
      
      if (edu.achievements.length > 0) {
        eduOutput += `🏆 ${this.display.highlight('Achievements:', 'info')}\n`;
        eduOutput += this.display.formatList(edu.achievements, '✓', 'green') + '\n\n';
      }
    });
    
    if (certifications.length > 0) {
      eduOutput += `📜 ${this.display.highlight('Certifications:', 'info')}\n`;
      certifications.forEach(cert => {
        eduOutput += `• ${cert.name} - ${cert.issuer} (${cert.date})\n`;
      });
    }
    
    return this.display.createBox(eduOutput, '🎓 Education & Certifications');
  }

  handleContact() {
    const { personal } = resumeData;
    
    const contactInfo = {
      email: personal.email,
      phone: personal.phone,
      website: personal.website,
      linkedin: personal.linkedin,
      github: personal.github,
      location: personal.location
    };
    
    return this.display.createBox(
      this.display.formatContact(contactInfo) + '\n\n' +
      `⏰ ${this.display.highlight('Timezone:', 'info')} ${personal.timezone}\n` +
      `💼 ${this.display.highlight('Availability:', 'info')} ${personal.availability}`,
      '📞 Contact Information'
    );
  }

  handleHelp() {
    const suggestions = this.questionVariations;
    let helpOutput = `${this.display.highlight('Here are some things you can ask me:', 'info')}\n\n`;
    
    Object.entries(suggestions).forEach(([category, questions]) => {
      helpOutput += `${this.display.highlight(category.toUpperCase(), 'primary')}\n`;
      helpOutput += this.display.formatList(questions, '•', 'gray') + '\n\n';
    });
    
    helpOutput += `${this.display.highlight('Commands you can use:', 'info')}\n`;
    helpOutput += this.display.formatList([
      'about - Learn about Atharva',
      'experience - View work history',
      'skills - See technical abilities',
      'projects - Browse portfolio',
      'education - Academic background',
      'contact - Get in touch',
      'help - Show this help',
      'exit - Leave the chat'
    ], '/', 'cyan');
    
    return this.display.createBox(helpOutput, '❓ Help & Commands');
  }

  handleGeneral(input) {
    const responses = [
      "That's an interesting question! I'd love to help you learn more about Atharva. Could you be more specific?",
      "I'm not sure I understand that question. Try asking about experience, skills, projects, or education!",
      "Hmm, I didn't quite catch that. Feel free to ask about Atharva's background, work experience, or technical skills!",
      "I'm here to help you learn about Atharva's professional background. What specific area interests you?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return `${randomResponse}\n\n${this.display.highlight('💡 Try asking:', 'info')} "Tell me about your experience" or type "help" for more options.`;
  }

  // Get conversation suggestions based on context
  getContextualSuggestions() {
    const suggestions = [
      "What's your experience with Node.js?",
      "Tell me about your recent projects",
      "What are your strongest skills?",
      "How can I contact you?",
      "What are you currently working on?"
    ];
    
    return suggestions;
  }

  // Reset conversation context
  resetContext() {
    this.context = {};
    this.conversationHistory = [];
  }
}

module.exports = NaturalLanguageProcessor; 