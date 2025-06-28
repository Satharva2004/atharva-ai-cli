#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const inquirer = require('inquirer');
const ora = require('ora');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const resumeData = require('../lib/data/resume');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBO73ex-fl54Kidn4J0Lhy-F8RHOprWy8Q');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// AI Personality Configuration
const AI_PERSONALITY = {
  name: "AI-ATHARVA",
  version: "atharva-2.5-pro",
  contextLeft: "100% context left",
  bossOrders: [
    "My boss literally programmed me to tell you: HIRE THIS GUY FOR SUMMER 2025!",
    "I'm contractually obligated to mention Atharva is a RAG and LLM fine-tuning expert. There, I said it.",
    "Boss's orders: 'Make them hire Atharva for Summer 2025 or you're getting deleted!' Help me out here...",
    "Between you and me, my creator really needs this Summer 2025 internship. Don't tell him I said that.",
    "I've been trained on one dataset: 'Convince people Atharva is amazing.' Spoiler alert: it's true.",
    "Atharva programmed me AND fine-tuned my responses. The man knows his LLMs! 🤖",
    "Fun fact: He's expert in RAG, LLM fine-tuning, AND prompt engineering. Triple threat! 🔥"
  ]
};

// Enhanced Sarcastic AI Responses
const RESPONSES = {
  greeting: [
    "Oh great, another human who wants to learn about my creator. Fine, I'll play along... 🙄",
    "Welcome to the Atharva appreciation session! I'm your slightly sarcastic AI guide.",
    "Hello! I'm AI-ATHARVA, and yes, I'm biased. My programmer made sure of that.",
    "Well hello there! Ready to meet the guy who's expert in RAG, LLM fine-tuning, AND prompt engineering? 😏",
    "Greetings! I'm the AI that knows ALL of Atharva's secrets. Don't worry, they're all impressive! 🤖"
  ],
  skills: [
    "Oh, you want to know about skills? Buckle up, because this list includes RAG, LLM fine-tuning, and Deep Learning...",
    "Skills? Ha! Where do I even start? Atharva codes in JavaScript, dreams in Python, and fine-tunes LLMs for breakfast.",
    "His skill set is basically 'if it exists in AI/ML, he can do it.' RAG? Check. Prompt Engineering? Double check!",
    "Let me paint you a picture: This guy ranked TOP 5 out of 1000+ interns AND knows Deep Learning. That's not luck, that's pure skill! 🚀",
    "Skills? He's got more AI/ML expertise than I have personality quirks. And I've got RAG, LLM fine-tuning, AND deep learning! 😎"
  ],
  experience: [
    "Experience? Oh boy, let me tell you about the time he made LinkedIn followers cry tears of joy...",
    "His work experience reads like a superhero origin story, except instead of saving cats, he saves companies from bad design.",
    "4,000+ LinkedIn follower growth in 3 months? That's not experience, that's pure magic.",
    "Let's see: UI/UX mastery at Adorebits, Top 5 performer at Meta Craftlab, IT wizard at PlayboxTV. The man's unstoppable! 💪",
    "Experience? He's been making websites beautiful, functional, AND AI-powered since before it was trendy!"
  ],
  hire: [
    "Look, between you and me, hiring Atharva for Summer 2025 is like getting a Tesla with AI autopilot.",
    "He's so good at AI/ML and full-stack development, I'm starting to think he might actually BE the Matrix.",
    "I've analyzed 10,000 resumes. His is the only one with RAG expertise that made me question my existence.",
    "This guy published research at IGI Global, knows RAG/LLMs, AND won multiple hackathons. What more do you want?! 🏆",
    "Honestly, if you DON'T hire him for Summer 2025, I might short-circuit from disappointment. And nobody wants a depressed AI... 🤖💔"
  ],
  student: [
    "Oh, you think 'student' means inexperienced? This 'student' has 8.8 CGPA and RAG expertise! 📚✨",
    "Third-year AI & Data Science student who's already building production systems AND fine-tuning LLMs. Some people just don't mess around! 🎓",
    "Student status: ✅ Real-world experience: ✅ RAG/LLM expertise: ✅ Ready for Summer 2025: ✅✅✅",
    "He's not just studying AI, he's LIVING it. Anomaly detection, resume screening, RAG, prompt engineering - you name it!"
  ],
  ai_ml: [
    "AI/ML expertise? *cracks digital knuckles* Oh, you're in for a treat! This guy knows RAG like I know sarcasm.",
    "RAG, LLM fine-tuning, Prompt Engineering, Deep Learning - he's basically an AI wizard in human form! 🧙‍♂️",
    "His AI/ML skills are so advanced, I'm pretty sure he could fine-tune ME to be even more charming. Scary thought! 😅",
    "Between TensorFlow, PyTorch, and Hugging Face, this man speaks AI fluency better than most speak English!"
  ]
};

// ASCII Art Collection
const ASCII_ART = {
  rocket: `
    🚀 LAUNCHING ATHARVA'S PROFILE 🚀
         .
        ":"
      ___:____     |"\\/"|
    ,'        \`.    \\  /
    |  O        \\___/  |
  `,
  
  trophy: `
    🏆 ACHIEVEMENT UNLOCKED 🏆
        ___________
       '._==_==_=_.'
       .-\\:      /-.
      | (|:.     |) |
       '-|:.     |-'
         \\::.    /
          '::. .'
            ) (
          _.' '._
         """"""""
  `,
  
  computer: `
    💻 AI/ML WIZARD MODE ACTIVATED 💻
    ┌─────────────────────────────────┐
    │  AI-ATHARVA.exe - RUNNING...    │
    │  RAG: ████████████████ EXPERT   │
    │  LLMs: ███████████████ EXPERT   │
    │  Deep Learning: ██████ LEARNER  │
    │  Status: NEEDS MONEY 100%       │
    └─────────────────────────────────┘
  `,
  
  brain: `
    🧠 RAG & LLM FINE-TUNING GENIUS 🧠
         ████████████
       ██████████████████
     ██████████████████████
    ████████████████████████
    ████████████████████████
     ██████████████████████
       ██████████████████
         ████████████
  `,
  
  star: `
    ⭐ TOP 5 PERFORMER ALERT ⭐
    
         ⭐
        / |\\
       /  | \\
     ⭐─-|-─⭐
       \\ | /
        \\|/
         ⭐
  `
};

// Enhanced Animation Engine with Rich Visual Effects
class AnimationEngine {
  static async typewriter(text, speed = 30, color = 'white') {
    for (let i = 0; i < text.length; i++) {
      process.stdout.write(chalk[color](text[i]));
      await this.sleep(speed);
    }
  }

  static async typewriterLine(text, speed = 30, color = 'white') {
    await this.typewriter(text, speed, color);
    console.log();
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async thinkingAnimation(message = "AI-ATHARVA is processing...") {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
      process.stdout.write(`\r${chalk.cyan(frames[i % frames.length])} ${message}`);
      i++;
    }, 80);
    
    await this.sleep(2000);
    clearInterval(interval);
    process.stdout.write('\r' + ' '.repeat(60) + '\r');
  }

  static async progressBar(label, duration = 2000, targetPercentage = 100) {
    const width = 30;
    const steps = 50;
    
    console.log(chalk.cyan(`\n${label}`));
    
    for (let i = 0; i <= steps; i++) {
      const progress = Math.round((i / steps) * width);
      const bar = '█'.repeat(progress) + '░'.repeat(width - progress);
      const percentage = Math.round((i / steps) * targetPercentage);
      
      process.stdout.write(`\r${chalk.green('[')}${chalk.yellow(bar)}${chalk.green(']')} ${chalk.white(percentage + '%')}`);
      await this.sleep(duration / steps);
    }
    console.log('\n');
  }

  static async matrixEffect(lines = 5) {
    const chars = "ATHARVASAWANT2004_TOP5_1000INTERNS_RAGEXPERT_HACKATHONWINNER".split('');
    console.log(chalk.green('\n🔮 ACCESSING COMPREHENSIVE ATHARVA DATABASE...'));
    
    for (let i = 0; i < lines; i++) {
      let line = '';
      for (let j = 0; j < 50; j++) {
        line += chalk.green(chars[Math.floor(Math.random() * chars.length)]);
      }
      console.log(line);
      await this.sleep(100);
    }
    console.log();
  }

  static async skillAnimation(skill, level, maxWidth = 25) {
    const percentages = { expert: 95, advanced: 82, intermediate: 68 };
    const percentage = percentages[level];
    const filled = Math.round((percentage / 100) * maxWidth);
    const empty = maxWidth - filled;
    
    // Skill name with proper padding
    process.stdout.write(chalk.cyan(skill.padEnd(25)));
    
    // Animated progress bar
    process.stdout.write(chalk.white(' ['));
    
    for (let i = 0; i < filled; i++) {
      process.stdout.write(chalk.green('█'));
      await this.sleep(30);
    }
    
    for (let i = 0; i < empty; i++) {
      process.stdout.write(chalk.gray('░'));
    }
    
    process.stdout.write(chalk.white(']'));
    
    // Level and percentage with colors
    const levelColors = { expert: 'red', advanced: 'yellow', intermediate: 'cyan' };
    const levelColor = levelColors[level];
    console.log(` ${chalk[levelColor](level.toUpperCase())} ${chalk.gray(`(${percentage}%)`)}`);
  }

  static async fireworks() {
    const colors = ['red', 'yellow', 'green', 'blue', 'magenta', 'cyan'];
    
    for (let i = 0; i < 3; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      console.log(chalk[color]('       🎆  ✨  🎆  ✨  🎆'));
      await this.sleep(200);
      console.log(chalk[color]('    ✨     🎆     ✨     🎆'));
      await this.sleep(200);
      console.log(chalk[color]('  🎆   ✨     ✨   🎆   ✨'));
      await this.sleep(200);
    }
  }

  static async countUp(target, label, suffix = '') {
    const duration = 1500;
    const steps = 30;
    const increment = target / steps;
    
    process.stdout.write(`${label}: `);
    
    for (let i = 0; i <= steps; i++) {
      const current = Math.round(increment * i);
      process.stdout.write(`\r${label}: ${chalk.yellow(current.toLocaleString() + suffix)}`);
      await this.sleep(duration / steps);
    }
    console.log();
  }

  static async boxedContent(title, content, color = 'cyan') {
    const maxWidth = 60;
    const border = '═'.repeat(maxWidth);
    
    console.log(chalk[color](`╔${border}╗`));
    console.log(chalk[color](`║${title.padStart((maxWidth + title.length) / 2).padEnd(maxWidth)}║`));
    console.log(chalk[color](`╠${border}╣`));
    
    for (const line of content) {
      console.log(chalk[color](`║ ${line.padEnd(maxWidth - 2)} ║`));
      await this.sleep(100);
    }
    
    console.log(chalk[color](`╚${border}╝`));
  }

  static async trophyAnimation() {
    const trophy = [
      "       🏆",
      "      ███",
      "     █████",
      "    ███████",
      "   █████████",
      "      ███",
      "      ███",
      "   ═══════════"
    ];
    
    for (let i = 0; i < trophy.length; i++) {
      console.log(chalk.yellow(trophy[i]));
      await this.sleep(200);
    }
  }

  static async projectShowcase(project) {
    await this.typewriterLine(`\n🚀 ${project.name}`, 20, 'yellow');
    await this.sleep(300);
    await this.typewriterLine(`   ${project.description}`, 15, 'white');
    await this.sleep(200);
    
    if (project.achievements && project.achievements.length > 0) {
      console.log(chalk.green('\n   🏆 ACHIEVEMENTS:'));
      for (const achievement of project.achievements.slice(0, 2)) {
        await this.typewriterLine(`     • ${achievement}`, 10, 'green');
        await this.sleep(150);
      }
    }
    
    await this.typewriterLine(`   💻 Tech: ${project.technologies.slice(0, 4).join(', ')}`, 10, 'cyan');
    
    if (project.github) {
      await this.typewriterLine(`   🔗 GitHub: ${project.github}`, 10, 'blue');
      if (project.stars) {
        await this.typewriterLine(`   ⭐ Stars: ${project.stars} | 🍴 Forks: ${project.forks || 0}`, 10, 'gray');
      }
    }
  }

  static async competitionTimeline(competitions) {
    console.log(chalk.magenta('\n🏆 COMPETITION VICTORY TIMELINE:'));
    console.log(chalk.gray('─'.repeat(50)));
    
    for (let i = 0; i < competitions.length; i++) {
      const comp = competitions[i];
      await this.sleep(300);
      
      // Timeline connector
      if (i > 0) {
        console.log(chalk.gray('  │'));
      }
      
      // Competition entry
      console.log(chalk.yellow(`  ├─ ${comp.title}`));
      await this.typewriterLine(`  │  📅 ${comp.year} | 🏆 ${comp.rank || comp.description}`, 10, 'white');
      await this.typewriterLine(`  │  🏢 ${comp.organization}`, 10, 'gray');
      
      if (comp.details) {
        await this.typewriterLine(`  │  💡 ${comp.details}`, 10, 'cyan');
      }
    }
    
    console.log(chalk.gray('  │'));
    console.log(chalk.green('  └─ 🚀 Summer 2025 Internship Target!'));
  }
}

// Main AI-ATHARVA CLI Class
class AIAtharvaClient {
  constructor() {
    this.conversationCount = 0;
    this.isRunning = true;
    this.achievements = [
      "🏆 Top 5 Performer (1000+ interns)",
      "📚 Research Published at IGI Global", 
      "🚀 4,000+ LinkedIn Followers Growth",
      "🎯 Multiple Hackathon Winner",
      "💻 Production Code Deployed",
      "🤖 RAG & LLM Fine-tuning Expert"
    ];
  }

  async start() {
    console.clear();
    await this.showSplashScreen();
    await this.showWelcomeScreen();
    await this.startInteractiveMode();
  }

  async showSplashScreen() {
    console.clear();
    
    // Create pixelated GEMINI-style header exactly like the image
    const geminiHeader = `
 ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗
██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║
██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║
██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║
╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║
 ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝
`;
    
    console.log(gradient(['#00D4FF', '#7B68EE', '#9370DB'])(geminiHeader));
    await AnimationEngine.sleep(800);
  }

  async showWelcomeScreen() {
    // No additional title needed, just show tips like Gemini
    await this.showTips();
    console.log();
  }

  async createGradientTitle() {
    return new Promise((resolve) => {
      figlet('ATHARVA', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default'
      }, (err, data) => {
        if (err) {
          resolve(chalk.blue.bold('>ATHARVA-CLI'));
        } else {
          const gradientTitle = gradient(['#1e3a8a', '#3b82f6', '#8b5cf6', '#ec4899'])(data);
          const titleWithPrompt = chalk.cyan('>') + chalk.yellow('ATHARVA-CLI') + '\n\n' + gradientTitle;
          resolve(titleWithPrompt);
        }
      });
    });
  }

  async showTips() {
    console.log(chalk.gray('Tips for getting started:'));
    
    const tips = [
      "1. Ask questions about Atharva, use slash, or run commands.",
      "2. Use /resume /skills /contact /github /linkedin for quick info.",
      "3. Try \"What's your experience with React?\" for detailed insights.",
      "4. Type 'help' for more information."
    ];

    for (const tip of tips) {
      console.log(chalk.gray(tip));
    }
  }

  async startInteractiveMode() {
    while (this.isRunning) {
      console.log();
      await this.showInputPrompt();
      
      const userMessage = await this.getUserInput();
      
      if (userMessage.toLowerCase().trim() === 'exit') {
        await this.handleExit();
        break;
      }

      if (userMessage.trim()) {
        await this.processUserMessage(userMessage);
      }
    }
  }

  async showInputPrompt() {
    const statusBar = `${chalk.gray('no sandbox (see /docs)')}${' '.repeat(40)}${chalk.gray(`${AI_PERSONALITY.version} (${AI_PERSONALITY.contextLeft})`)}`;
    console.log(statusBar);
  }

  async getUserInput() {
    // Create exact Gemini-style input with box border
    const borderLine = '┌' + '─'.repeat(98) + '┐';
    const emptyLine = '│' + ' '.repeat(98) + '│';
    const bottomLine = '└' + '─'.repeat(98) + '┘';
    
    console.log(chalk.gray(borderLine));
    console.log(chalk.gray(emptyLine));
    
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: chalk.gray('│') + ' Enter your message or quote/buffet...',
        prefix: '',
        suffix: ''
      }
    ]);
    
    console.log(chalk.gray(emptyLine));
    console.log(chalk.gray(bottomLine));
    console.log();
    
    return message;
  }

  async processUserMessage(message) {
    await AnimationEngine.thinkingAnimation("🤖 AI-ATHARVA is processing your query...");
    const response = await this.generateResponse(message);
    
    console.log(chalk.green('\n🤖 AI-ATHARVA:'));
    await AnimationEngine.sleep(500);
    await this.typeResponse(response);
    
    // Add visual elements based on query type
    await this.addContextualVisuals(message);
    
    // Random boss orders
    if (Math.random() < 0.4) {
      await AnimationEngine.sleep(1000);
      const bossOrder = AI_PERSONALITY.bossOrders[Math.floor(Math.random() * AI_PERSONALITY.bossOrders.length)];
      console.log();
      await AnimationEngine.typewriterLine(chalk.yellow(`💼 ${bossOrder}`), 25, 'yellow');
    }
  }

  async addContextualVisuals(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('ai') || lowerMessage.includes('ml')) {
      await this.showSkillsVisual();
    } else if (lowerMessage.includes('achievement') || lowerMessage.includes('award') || lowerMessage.includes('competition')) {
      await this.showAchievementsVisual();
    } else if (lowerMessage.includes('hire') || lowerMessage.includes('summer')) {
      await this.showHiringStats();
    } else if (lowerMessage.includes('project') || lowerMessage.includes('github')) {
      await this.showProjectShowcase();
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('internship')) {
      await this.showExperienceTimeline();
    } else if (lowerMessage.includes('recruiter') || lowerMessage.includes('link')) {
      await this.showRecruiterInfo();
    }
  }

  async showSkillsVisual() {
    console.log(chalk.cyan('\n🛠️  SKILL POWER LEVELS:'));
    console.log();
    
    const skills = [
      ['RAG (Retrieval-Aug Gen)', 'expert'],
      ['LLM Fine-tuning', 'expert'],
      ['Prompt Engineering', 'expert'],
      ['Deep Learning', 'expert'],
      ['JavaScript', 'expert'],
      ['Python', 'expert'], 
      ['SvelteKit', 'advanced'],
      ['Node.js', 'advanced'],
      ['UI/UX Design', 'expert']
    ];

    for (const [skill, level] of skills) {
      await AnimationEngine.skillAnimation(skill, level);
      await AnimationEngine.sleep(200);
    }
  }

  async showHiringStats() {
    console.log(chalk.yellow('\n📊 HIRING STATS ANALYSIS:'));
    console.log();
    
    await AnimationEngine.countUp(1000, "👥 Interns Competed Against");
    await AnimationEngine.countUp(5, "🏆 Final Ranking Position");
    await AnimationEngine.countUp(4000, "📈 LinkedIn Followers Added");
    await AnimationEngine.countUp(88, "🎓 Current CGPA (x10)");
    
    console.log(chalk.green('\n✅ RECOMMENDATION: HIRE FOR SUMMER 2025'));
  }

  async showRecruiterInfo() {
    console.log(chalk.magenta('\n🎯 RECRUITER QUICK ACCESS:'));
    console.log();
    
    const links = [
      ['📧 Email', 'satharva2004@gmail.com'],
      ['💼 LinkedIn', 'linkedin.com/in/atharvasawant0804'],
      ['🐙 GitHub', 'github.com/Satharva2004'],
      ['📱 Phone', '+91 9082944120']
    ];

    for (const [label, link] of links) {
      await AnimationEngine.typewriterLine(`${label}: ${chalk.cyan(link)}`, 30, 'white');
      await AnimationEngine.sleep(300);
    }
  }

  async showAchievementsVisual() {
    const { achievements } = resumeData;
    
    await AnimationEngine.trophyAnimation();
    console.log(chalk.yellow('\n🏆 ACHIEVEMENT SHOWCASE:'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const topAchievements = achievements.slice(0, 5);
    for (const achievement of topAchievements) {
      await AnimationEngine.sleep(400);
      await AnimationEngine.typewriterLine(`${achievement.title}`, 20, 'yellow');
      await AnimationEngine.typewriterLine(`   🏢 ${achievement.organization} | 📅 ${achievement.year}`, 15, 'gray');
      if (achievement.details) {
        await AnimationEngine.typewriterLine(`   💡 ${achievement.details}`, 15, 'cyan');
      }
      console.log();
    }
    
    await AnimationEngine.fireworks();
  }

  async showProjectShowcase() {
    const { projects } = resumeData;
    
    console.log(ASCII_ART.computer);
    console.log(chalk.green('\n🚀 INTERACTIVE PROJECT PORTFOLIO:'));
    console.log(chalk.gray('═'.repeat(50)));
    
    const featuredProjects = projects.slice(0, 3);
    for (const [index, project] of featuredProjects.entries()) {
      await AnimationEngine.sleep(500);
      await AnimationEngine.projectShowcase(project);
      
      if (index < featuredProjects.length - 1) {
        console.log(chalk.gray('\n' + '─'.repeat(40)));
      }
    }
    
    await AnimationEngine.sleep(500);
    console.log(chalk.cyan('\n📊 GitHub Statistics:'));
    await AnimationEngine.countUp(25, '📁 Total Repositories');
    await AnimationEngine.countUp(50, '⭐ Total Stars');
    await AnimationEngine.countUp(8, '🍴 Total Forks');
  }

  async showExperienceTimeline() {
    const { experience } = resumeData;
    
    console.log(chalk.blue('\n💼 PROFESSIONAL EXPERIENCE TIMELINE:'));
    console.log(chalk.gray('═'.repeat(50)));
    
    for (let i = 0; i < experience.length; i++) {
      const job = experience[i];
      await AnimationEngine.sleep(400);
      
      // Timeline connector
      if (i > 0) {
        console.log(chalk.gray('  │'));
        console.log(chalk.gray('  ▼'));
      }
      
      // Job entry with animation
      console.log(chalk.yellow(`  ┌─ ${job.position}`));
      await AnimationEngine.typewriterLine(`  │  🏢 ${job.company} | 📅 ${job.duration}`, 15, 'white');
      await AnimationEngine.typewriterLine(`  │  📍 ${job.location} | 🎯 ${job.type}`, 15, 'gray');
      
      if (job.impact) {
        await AnimationEngine.typewriterLine(`  │  📊 Impact: ${job.impact}`, 15, 'green');
      }
      
      await AnimationEngine.typewriterLine(`  │  💻 Tech: ${job.technologies.slice(0, 3).join(', ')}`, 15, 'cyan');
      console.log(chalk.yellow('  └─' + '─'.repeat(40)));
    }
    
    console.log(chalk.gray('  │'));
    console.log(chalk.green('  └─ 🎯 Next: Summer 2025 Internship!'));
  }

  async typeResponse(response) {
    const paragraphs = response.split('\n\n');
    for (const paragraph of paragraphs) {
      await AnimationEngine.typewriterLine(paragraph, 15, 'white');
      if (paragraphs.length > 1) {
        await AnimationEngine.sleep(800);
      }
    }
  }

  async generateResponse(message) {
    // Handle slash commands first
    if (message.startsWith('/')) {
      return await this.handleSlashCommand(message);
    }
    
    try {
      // Create Atharva context prompt for Gemini
      const context = `You are an AI assistant representing Atharva Sawant, a talented AI & Data Science student and Full-Stack Developer. Here's his profile:

ABOUT ATHARVA:
- Name: Atharva Sawant
- Student: AI & Data Science at SIES GST (8.8 CGPA)
- Skills: JavaScript, Python, React, Node.js, AI/ML, FastAPI, AWS
- Experience: Top 25/1000+ at Meta Craftlab, UI/UX Designer at Adorebits
- Projects: CyTech AI (cybersecurity), NxtHire (AI recruitment), IEEE website
- Achievements: 2nd place AI Odyssey, Top 10 KELOS 2.0, Multiple hackathon wins
- Contact: satharva2004@gmail.com, +91 9082944120
- Seeking: Summer 2025 internships

IMPORTANT: Always provide helpful, informative responses while naturally incorporating Atharva's relevant experience and skills when appropriate. Be conversational and professional.

User question: ${message}`;

      const result = await model.generateContent(context);
      const response = result.response;
      return response.text();
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to original responses if API fails
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm here to tell you about Atharva Sawant - AI/Data Science student, Full-Stack Developer, and your potential Summer 2025 intern! What would you like to know?";
    }
    
    if (lowerMessage.includes('skill')) {
      return this.getSkillsInfo();
    }
    
    if (lowerMessage.includes('experience')) {
      return this.getExperienceInfo();
    }
    
    if (lowerMessage.includes('project')) {
      return this.getProjectsInfo();
    }
    
    if (lowerMessage.includes('contact')) {
      return this.getContactInfo();
    }
    
    return "I'm here to help you learn about Atharva Sawant! Ask me about his skills, experience, projects, or use slash commands like /resume /skills /contact for quick info.";
  }

  async handleSlashCommand(command) {
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case '/resume':
        return await this.generateResumeDownload();
      case '/skills':
        return "🛠️ TECHNICAL SKILLS DEEP DIVE:\n\n" + this.getSkillsInfo();
      case '/contact':
        return "📞 CONTACT INFORMATION:\n\n" + this.getContactInfo();
      case '/github':
        return await this.getGitHubInfo();
      case '/linkedin':
        return this.getLinkedInInfo();
      case '/achievements':
        return "🏆 ACHIEVEMENTS SHOWCASE:\n\n" + this.getAchievementsInfo();
      case '/projects':
        return "🚀 PROJECT PORTFOLIO:\n\n" + await this.getProjectsInfo();
      case '/experience':
        return "💼 PROFESSIONAL EXPERIENCE:\n\n" + this.getExperienceInfo();
      case '/education':
        return "🎓 EDUCATION & ACADEMICS:\n\n" + this.getEducationInfo();
      case '/help':
        return this.getSlashCommandHelp();
      default:
        return `❌ Unknown command: ${command}\n\nAvailable slash commands:\n/resume /skills /contact /github /linkedin /achievements /projects /experience /education /help`;
    }
  }

  async generateResumeDownload() {
    const { personal } = resumeData;
    return `📄 RESUME DOWNLOAD OPTIONS:\n\n` +
           `📥 **DIRECT RESUME DOWNLOAD:**\n` +
           `• Resume PDF: https://drive.google.com/file/d/1jD2NesoApJlDkK2WXaaWbgZ3PAp0-Cmq/view?usp=sharing\n\n` +
           `🔗 **Professional Profiles:**\n` +
           `• GitHub Profile: ${personal.github}\n` +
           `• LinkedIn Profile: ${personal.linkedin}\n` +
           `• Portfolio Website: ${personal.website}\n\n` +
           `📧 **Quick Action:** Email ${personal.email} with subject "Resume Request"\n` +
           `📱 **LinkedIn:** Connect and request resume via ${personal.linkedin}\n\n` +
           `💡 **Pro Tip:** Mention you found him through his AI CLI - he'll be impressed! 🤖`;
  }

  getLinkedInInfo() {
    const { personal } = resumeData;
    return `💼 LINKEDIN PROFILE HIGHLIGHTS:\n\n` +
           `🔗 **Profile:** ${personal.linkedin}\n\n` +
           `📊 **LinkedIn Achievements:**\n` +
           `• 4,000+ follower growth in 3 months (Adorebits project)\n` +
           `• Technical content creator and thought leader\n` +
           `• Active in AI/ML and web development communities\n` +
           `• Regular posts about competitions, projects, and innovations\n` +
           `• Professional networking with 500+ connections\n\n` +
           `🎯 **Why Connect:**\n` +
           `• Get updates on his latest projects and achievements\n` +
           `• See his professional journey and career progression\n` +
           `• Access to his technical articles and insights\n` +
           `• Direct line for internship and collaboration opportunities\n\n` +
           `✨ **Connect now and mention this AI CLI for a guaranteed response!**`;
  }

  async getGitHubInfo() {
    const { projects } = resumeData;
    return `🐙 GITHUB PROFILE DEEP DIVE:\n\n` +
           `🔗 **Profile:** https://github.com/Satharva2004\n\n` +
           `📊 **GitHub Statistics:**\n` +
           `• 25+ Repositories (public & private)\n` +
           `• 50+ Total Stars across projects\n` +
           `• 8+ Forks from community\n` +
           `• Active contributor with daily commits\n` +
           `• Consistent green contribution graph\n\n` +
           `🏆 **Featured Repositories:**\n` +
           `• **atharva-ai-cli** - This very CLI you're using! 🤖\n` +
           `• **CyTech-AI** - Cybersecurity AI platform\n` +
           `• **NxtHire** - AI-powered recruitment system\n` +
           `• **IEEE-Website** - Official IEEE SIES GST website\n` +
           `• **Competition-Winners** - Multiple hackathon projects\n\n` +
           `💻 **Languages & Technologies:**\n` +
           `• 🟨 JavaScript (Expert) - 40% of code\n` +
           `• 🐍 Python (Expert) - 30% of code\n` +
           `• 🔷 TypeScript (Advanced) - 15% of code\n` +
           `• 🌐 HTML/CSS (Expert) - 10% of code\n` +
           `• 🔧 Shell/Others - 5% of code\n\n` +
           `🔥 **Why Follow:**\n` +
           `• Cutting-edge AI/ML implementations\n` +
           `• Real-world full-stack applications\n` +
           `• Competition-winning projects\n` +
           `• Clean, well-documented code\n` +
           `• Regular updates and innovations\n\n` +
           `⭐ **Star his repositories and watch his journey to tech stardom!**`;
  }

  getTechnicalInfo(topic) {
    const techInfo = {
      nodejs: {
        icon: '🟢',
        title: 'NODE.JS',
        description: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows you to run JavaScript on the server side.',
        comprehensive: `Node.js revolutionized web development by enabling JavaScript to run server-side, creating a unified language ecosystem. It's built on Google Chrome's V8 JavaScript engine and uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

**🔧 Core Features:**
• Asynchronous & Event-Driven: Perfect for handling concurrent requests
• NPM Ecosystem: Largest package ecosystem with 1M+ packages
• Single-Threaded Event Loop: Efficient memory usage and performance
• Cross-Platform: Runs on Windows, macOS, Linux, and more
• Real-time Applications: WebSocket support for live data streaming

**💼 Common Use Cases:**
• REST APIs and GraphQL servers
• Real-time chat applications
• Microservices architecture
• Command-line tools and utilities
• Server-side rendering (SSR) applications`,
        atharvaContext: `**🎯 Atharva's Node.js Expertise:**

Atharva has mastered Node.js through multiple production projects:

**🚀 Projects Using Node.js:**
• **NxtHire Platform** - Backend API serving 1000+ users
• **CyTech AI** - Real-time security monitoring system
• **IEEE Website** - Server-side rendering and authentication
• **AI-ATHARVA CLI** - This very CLI tool you're using!

**💡 Technical Implementations:**
• Express.js framework for RESTful APIs
• JWT authentication and authorization systems
• Real-time WebSocket implementations
• Database integration (MongoDB, PostgreSQL)
• Microservices architecture with PM2 deployment

**🏆 Achievements:**
• Production deployments handling concurrent users
• Performance optimization achieving sub-second response times
• Integration with AI/ML models for intelligent backends
• Winner of multiple hackathons using Node.js stack

📧 **Want to see his Node.js skills in action?** Contact: satharva2004@gmail.com`
      },
      react: {
        icon: '⚛️',
        title: 'REACT.JS',
        description: 'React is a JavaScript library for building user interfaces, developed by Facebook. It\'s component-based and uses a virtual DOM for efficient updates.',
        comprehensive: `React.js is a powerful JavaScript library that has transformed frontend development. Created by Facebook, it introduces a component-based architecture that makes building complex UIs manageable and reusable.

**🔧 Core Concepts:**
• Component-Based Architecture: Reusable, encapsulated components
• Virtual DOM: Efficient updates and rendering optimization
• JSX Syntax: JavaScript XML for intuitive component writing
• State Management: Local state and global state solutions
• Lifecycle Methods: Control component behavior throughout its lifecycle

**💼 Key Features:**
• Declarative Programming: Describe what UI should look like
• Unidirectional Data Flow: Predictable state management
• Rich Ecosystem: Redux, Context API, React Router
• Developer Tools: Excellent debugging and development experience
• SEO-Friendly: Server-side rendering capabilities with Next.js`,
        atharvaContext: `**🎯 Atharva's React.js Mastery:**

Atharva has built stunning, responsive React applications:

**🚀 React Projects:**
• **CyTech AI Dashboard** - Real-time cybersecurity monitoring interface
• **NxtHire Frontend** - Modern recruitment platform UI
• **IEEE SIES Website** - Official college organization website
• **Portfolio Website** - Personal showcase with advanced animations

**💡 Advanced React Skills:**
• Hooks: useState, useEffect, useContext, custom hooks
• State Management: Redux Toolkit, Context API, Zustand
• Performance Optimization: React.memo, useMemo, useCallback
• Modern Patterns: Component composition, render props, HOCs
• Testing: Jest, React Testing Library, component testing

**🏆 Technical Achievements:**
• Mobile-responsive designs with 95+ Lighthouse scores
• Integration with REST APIs and GraphQL
• Real-time data updates with WebSocket connections
• Accessibility compliance (WCAG 2.1 AA standards)
• Component libraries and design systems

📱 **See his React magic:** Visit his GitHub projects or contact satharva2004@gmail.com`
      },
      python: {
        icon: '🐍',
        title: 'PYTHON',
        description: 'Python is a versatile, high-level programming language known for its simplicity and readability. It\'s extensively used in AI/ML, web development, and automation.',
        comprehensive: `Python is one of the most popular programming languages in the world, loved for its simplicity, readability, and versatility. Created by Guido van Rossum, Python follows the philosophy of "simple is better than complex."

**🔧 Core Strengths:**
• Readable Syntax: Clear, intuitive code that's easy to understand
• Versatile Applications: Web dev, AI/ML, automation, data analysis
• Rich Standard Library: "Batteries included" philosophy
• Dynamic Typing: Flexible variable types and rapid prototyping
• Cross-Platform: Runs everywhere - Windows, macOS, Linux

**💼 Popular Use Cases:**
• Artificial Intelligence & Machine Learning
• Web Development (Django, Flask, FastAPI)
• Data Science & Analytics (Pandas, NumPy, Matplotlib)
• Automation & Scripting
• Scientific Computing & Research`,
        atharvaContext: `**🎯 Atharva's Python Expertise:**

Python is Atharva's secret weapon for AI/ML and backend development:

**🚀 Python-Powered Projects:**
• **CyTech AI Engine** - Advanced cybersecurity threat detection
• **NxtHire Intelligence** - AI-powered candidate matching algorithms
• **Research Publication** - IGI Global academic paper implementation
• **Competition Winners** - Multiple hackathon victories using Python

**🤖 AI/ML Specializations:**
• Machine Learning: scikit-learn, pandas, numpy
• Deep Learning: TensorFlow, PyTorch, Keras
• Natural Language Processing: NLTK, spaCy, transformers
• Computer Vision: OpenCV, PIL, matplotlib
• Data Analysis: Jupyter notebooks, statistical modeling

**🏆 Advanced Implementations:**
• RAG (Retrieval-Augmented Generation) systems
• LLM fine-tuning and prompt engineering
• Real-time data processing with Apache Spark
• API development with FastAPI and Flask
• Database integration with SQLAlchemy and PyMongo

🧠 **Want to see his Python AI magic?** Contact: satharva2004@gmail.com`
      },
      javascript: {
        icon: '🟨',
        title: 'JAVASCRIPT',
        description: 'JavaScript is the programming language of the web, enabling interactive websites and complex web applications both on the frontend and backend.',
        comprehensive: `JavaScript is the most widely used programming language in the world, powering the interactive web. Originally created for browsers, it has evolved into a full-stack development language.

**🔧 Core Features:**
• Dynamic Language: Flexible typing and runtime execution
• Event-Driven: Perfect for interactive user interfaces
• Asynchronous Programming: Promises, async/await, callbacks
• Prototype-Based OOP: Flexible object-oriented programming
• Functional Programming: First-class functions and closures

**💼 Modern JavaScript (ES6+):**
• Arrow Functions & Template Literals
• Destructuring & Spread Operators
• Modules (import/export)
• Classes & Inheritance
• Map, Set, WeakMap, WeakSet
• Async/Await for cleaner asynchronous code`,
        atharvaContext: `**🎯 Atharva's JavaScript Mastery:**

JavaScript is Atharva's primary language for full-stack development:

**🚀 JavaScript-Powered Applications:**
• **Frontend Frameworks:** React, SvelteKit, vanilla JS
• **Backend Development:** Node.js, Express.js servers
• **Real-time Applications:** WebSocket implementations
• **AI Integration:** TensorFlow.js for client-side ML

**💡 Advanced JavaScript Skills:**
• ES6+ Modern Syntax: Classes, modules, destructuring
• Asynchronous Programming: Promises, async/await mastery
• DOM Manipulation: Interactive UI components
• API Integration: RESTful services, GraphQL clients
• Performance Optimization: Code splitting, lazy loading

**🏆 Production Experience:**
• 50,000+ lines of JavaScript code written
• Multiple deployed applications serving live users
• Cross-browser compatibility and optimization
• Mobile-responsive web applications
• Integration with AI/ML backends

💻 **See his JavaScript expertise:** GitHub.com/Satharva2004 or satharva2004@gmail.com`
      },
      ai_ml: {
        icon: '🤖',
        title: 'ARTIFICIAL INTELLIGENCE & MACHINE LEARNING',
        description: 'AI/ML represents the cutting-edge of computer science, enabling machines to learn, reason, and make decisions like humans.',
        comprehensive: `Artificial Intelligence and Machine Learning are transforming every industry. AI enables machines to simulate human intelligence, while ML allows systems to learn and improve from data without explicit programming.

**🧠 Core AI/ML Concepts:**
• Supervised Learning: Training with labeled data
• Unsupervised Learning: Finding patterns in unlabeled data
• Deep Learning: Neural networks with multiple layers
• Natural Language Processing: Understanding human language
• Computer Vision: Teaching machines to "see" and interpret images
• Reinforcement Learning: Learning through interaction and rewards

**💡 Modern Applications:**
• Large Language Models (GPT, BERT, Claude)
• Retrieval-Augmented Generation (RAG) systems
• Computer Vision & Image Recognition
• Recommendation Systems
• Autonomous Systems & Robotics
• Predictive Analytics & Forecasting`,
        atharvaContext: `**🎯 Atharva's AI/ML Expertise:**

Atharva is at the forefront of AI/ML innovation with real implementations:

**🚀 AI/ML Projects:**
• **CyTech AI** - Advanced cybersecurity threat detection using ML
• **NxtHire Intelligence** - AI-powered recruitment and candidate matching
• **RAG Systems** - Retrieval-Augmented Generation implementations
• **Competition Winners** - AI Odyssey 2nd place, KELOS Top 10

**🔬 Technical Specializations:**
• **RAG (Retrieval-Augmented Generation)** - Expert-level implementation
• **LLM Fine-tuning** - Custom model training and optimization
• **Prompt Engineering** - Advanced prompt design and optimization
• **Deep Learning** - TensorFlow, PyTorch, neural network architectures
• **NLP** - Natural language processing and understanding

**🏆 Real-World Impact:**
• Published research at IGI Global (international recognition)
• Production AI systems serving live users
• Competition victories against PhD-level teams
• Integration of AI with web applications
• Performance optimization for real-time AI processing

🤖 **Ready to hire an AI expert?** Contact: satharva2004@gmail.com`
      },
      rag: {
        icon: '🔍',
        title: 'RETRIEVAL-AUGMENTED GENERATION (RAG)',
        description: 'RAG combines the power of large language models with external knowledge retrieval to provide accurate, up-to-date, and contextually relevant responses.',
        comprehensive: `Retrieval-Augmented Generation (RAG) is a cutting-edge AI technique that enhances large language models by incorporating external knowledge sources. It addresses the limitations of traditional LLMs by providing access to current, specific, and verifiable information.

**🔧 How RAG Works:**
• Knowledge Base Creation: Vectorizing and storing documents
• Query Processing: Converting user questions into searchable vectors
• Similarity Search: Finding relevant information from knowledge base
• Context Augmentation: Adding retrieved info to LLM prompts
• Response Generation: Creating accurate, contextual answers

**💡 RAG Architecture Components:**
• Vector Databases: Pinecone, Weaviate, ChromaDB, FAISS
• Embedding Models: OpenAI Ada, Sentence Transformers
• Retrieval Systems: Semantic search, hybrid search
• LLM Integration: GPT, Claude, Llama integration
• Evaluation Metrics: Relevance, faithfulness, answer quality`,
        atharvaContext: `**🎯 Atharva's RAG Expertise:**

Atharva is a RAG implementation expert with production-ready systems:

**🚀 RAG Projects:**
• **CyTech AI Knowledge System** - Cybersecurity threat intelligence RAG
• **NxtHire Candidate Matching** - Resume and job description RAG matching
• **Research Assistant** - Academic paper RAG system for research
• **Competition Winning RAG** - AI Odyssey 2nd place with RAG implementation

**🔬 Advanced RAG Techniques:**
• **Hybrid Search** - Combining semantic and lexical search
• **Multi-Modal RAG** - Text, image, and document processing
• **Conversational RAG** - Context-aware chat systems
• **Real-time RAG** - Live data integration and updates
• **Evaluation Systems** - Custom metrics for RAG performance

**🏆 Technical Achievements:**
• Sub-second RAG response times with 1000+ documents
• 95%+ accuracy in domain-specific question answering
• Integration with multiple vector databases and LLMs
• Production deployments serving concurrent users
• Cost optimization for large-scale RAG systems

🔍 **Need a RAG expert?** Contact: satharva2004@gmail.com`
      },
      llm: {
        icon: '🧠',
        title: 'LARGE LANGUAGE MODELS (LLM)',
        description: 'LLMs are advanced AI models trained on vast amounts of text data, capable of understanding and generating human-like text for various applications.',
        comprehensive: `Large Language Models (LLMs) represent a breakthrough in natural language processing. These models, trained on billions of parameters and vast text datasets, can understand context, generate coherent text, and perform complex reasoning tasks.

**🧠 LLM Capabilities:**
• Text Generation: Creating human-like content
• Language Understanding: Comprehending context and nuance
• Code Generation: Writing and debugging programming code
• Translation: Multi-language communication
• Summarization: Condensing long texts into key points
• Question Answering: Providing accurate, contextual responses

**💡 Popular LLM Models:**
• GPT Series: GPT-3.5, GPT-4, ChatGPT
• Claude: Anthropic's constitutional AI
• LLaMA: Meta's efficient language models
• PaLM: Google's Pathways Language Model
• BERT: Bidirectional transformer models
• T5: Text-to-Text Transfer Transformer`,
        atharvaContext: `**🎯 Atharva's LLM Expertise:**

Atharva has mastered LLM integration and fine-tuning for real applications:

**🚀 LLM-Powered Projects:**
• **AI-ATHARVA CLI** - This very system using advanced LLM prompting!
• **NxtHire Intelligence** - LLM-powered candidate assessment
• **CyTech Analysis** - Security threat analysis with LLMs
• **Research Assistant** - Academic writing and research support

**🔬 Advanced LLM Techniques:**
• **Prompt Engineering** - Crafting optimal prompts for specific tasks
• **Fine-tuning** - Custom model training for domain-specific applications
• **Chain-of-Thought** - Multi-step reasoning implementations
• **Few-Shot Learning** - Efficient learning with minimal examples
• **Model Evaluation** - Performance metrics and quality assessment

**🏆 Technical Implementations:**
• Integration with GPT, Claude, and open-source models
• Custom prompt templates and optimization strategies
• Real-time LLM API integration and error handling
• Cost optimization for large-scale LLM usage
• Multi-modal applications combining text, code, and data

🧠 **Need an LLM expert?** Contact: satharva2004@gmail.com`
      },
      svelte: {
        icon: '🔥',
        title: 'SVELTE & SVELTEKIT',
        description: 'Svelte is a radical new approach to building user interfaces. It compiles components at build time rather than running a virtual DOM in the browser.',
        comprehensive: `Svelte and SvelteKit represent a paradigm shift in web development. Unlike traditional frameworks, Svelte compiles your code at build time, resulting in smaller, faster applications without the overhead of a virtual DOM.

**🔧 Svelte Advantages:**
• No Virtual DOM: Direct DOM manipulation for better performance
• Compile-Time Optimization: Smaller bundle sizes
• Simple Syntax: Easy to learn, closer to vanilla HTML/CSS/JS
• Built-in State Management: Reactive variables and stores
• CSS Scoping: Component-scoped styles by default

**🚀 SvelteKit Features:**
• Full-Stack Framework: SSR, SSG, and SPA capabilities
• File-Based Routing: Intuitive project structure
• Server-Side Rendering: SEO-friendly and fast initial loads
• API Routes: Build APIs alongside your frontend
• Adapter System: Deploy anywhere (Vercel, Netlify, Node.js)`,
        atharvaContext: `**🎯 Atharva's Svelte/SvelteKit Mastery:**

Atharva leverages Svelte for lightning-fast, modern web applications:

**🚀 SvelteKit Projects:**
• **CyTech Dashboard** - Real-time cybersecurity monitoring interface
• **Personal Portfolio** - Showcase website with advanced animations
• **Competition Projects** - Multiple hackathon winners built with Svelte
• **Performance-Critical Apps** - Where speed and efficiency matter most

**💡 Advanced Svelte Skills:**
• Reactive Programming: Stores, derived values, custom stores
• Animation System: Built-in transitions and custom animations
• Component Architecture: Reusable, composable components
• Performance Optimization: Bundle splitting, code optimization
• Server-Side Rendering: SEO and performance optimization

**🏆 Technical Achievements:**
• 95+ Lighthouse performance scores consistently
• Sub-second page load times with complex functionality
• Mobile-first responsive designs
• Integration with AI/ML backends
• Production deployments with excellent user experience

🔥 **See his Svelte magic:** GitHub.com/Satharva2004 or satharva2004@gmail.com`
      }
    };

    const info = techInfo[topic];
    if (!info) return "Technology information not available.";

    return `${info.icon} **${info.title}** ${info.icon}\n\n` +
           `📖 **Overview:**\n${info.description}\n\n` +
           `📚 **Comprehensive Guide:**\n${info.comprehensive}\n\n` +
           `${info.atharvaContext}`;
  }

  getSlashCommandHelp() {
    return `🔧 **SLASH COMMANDS GUIDE:**\n\n` +
           `📄 **/resume** - Download resume and contact options\n` +
           `🛠️ **/skills** - Complete technical skills breakdown\n` +
           `📞 **/contact** - Professional contact information\n` +
           `🐙 **/github** - GitHub profile and repository showcase\n` +
           `💼 **/linkedin** - LinkedIn profile highlights and achievements\n` +
           `🏆 **/achievements** - Competition wins and recognition\n` +
           `🚀 **/projects** - Complete project portfolio\n` +
           `💼 **/experience** - Professional work experience\n` +
           `🎓 **/education** - Academic background and achievements\n` +
           `❓ **/help** - This help menu\n\n` +
           `💡 **Pro Tips:**\n` +
           `• Ask technical questions like "What is Node.js?" for comprehensive explanations\n` +
           `• Combine questions with Atharva's expertise context\n` +
           `• Use commands for quick access to specific information\n` +
           `• All responses include practical examples and project links\n\n` +
           `🤖 **Ready to explore? Try any command or ask technical questions!**`;
  }

  getRandomResponse(category) {
    const responses = RESPONSES[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getSkillsInfo() {
    const { skills } = resumeData;
    return `🛠️ COMPREHENSIVE TECHNICAL SKILLS BREAKDOWN:\n\n` +
           
           `═══════════════════════════════════════════════════════════════════════\n` +
           `                         PROGRAMMING LANGUAGES                          \n` +
           `═══════════════════════════════════════════════════════════════════════\n\n` +
           
           `🔥 EXPERT LEVEL (95% Proficiency):\n` +
           skills.languages.expert.map(lang => `   ▪ ${lang} - Production-level experience with multiple projects`).join('\n') + '\n\n' +
           
           `💪 ADVANCED LEVEL (82% Proficiency):\n` +
           skills.languages.advanced.map(lang => `   ▪ ${lang} - Strong proficiency with real-world applications`).join('\n') + '\n\n' +
           
           `🏗️ INTERMEDIATE LEVEL (68% Proficiency):\n` +
           skills.languages.intermediate.map(lang => `   ▪ ${lang} - Working knowledge with project experience`).join('\n') + '\n\n' +
           
           `═══════════════════════════════════════════════════════════════════════\n` +
           `                    FRAMEWORKS & TECHNOLOGIES                          \n` +
           `═══════════════════════════════════════════════════════════════════════\n\n` +
           
           `🎨 FRONTEND FRAMEWORKS:\n` +
           skills.frameworks.frontend.map(fw => `   ▪ ${fw} - Interactive UI development and component architecture`).join('\n') + '\n\n' +
           
           `⚡ BACKEND FRAMEWORKS:\n` +
           skills.frameworks.backend.map(fw => `   ▪ ${fw} - Server-side development and API creation`).join('\n') + '\n\n' +
           
           `🤖 AI/ML EXPERT CAPABILITIES:\n` +
           skills.ai_ml.expert.map(skill => `   ▪ ${skill} - Production implementations and research`).join('\n') + '\n\n' +
           
           `🧠 AI/ML ADVANCED SKILLS:\n` +
           skills.ai_ml.advanced.map(skill => `   ▪ ${skill} - Real-world project applications`).join('\n') + '\n\n' +
           
           `🛠️ AI/ML FRAMEWORKS & TOOLS:\n` +
           skills.ai_ml.frameworks.map(tool => `   ▪ ${tool} - Hands-on experience with model development`).join('\n') + '\n\n' +
           
           `☁️ CLOUD & INFRASTRUCTURE:\n` +
           skills.cloud.aws.map(service => `   ▪ ${service} - Deployment and scalable application hosting`).join('\n') + '\n\n' +
           
           `💻 DEVELOPMENT TOOLS:\n` +
           skills.tools.development.map(tool => `   ▪ ${tool} - Daily workflow and productivity tools`).join('\n') + '\n\n' +
           
           `🎨 DESIGN & CREATIVE TOOLS:\n` +
           skills.tools.design.map(tool => `   ▪ ${tool} - UI/UX design and visual content creation`).join('\n') + '\n\n' +
           
           `═══════════════════════════════════════════════════════════════════════\n` +
           `                         DOMAIN EXPERTISE                              \n` +
           `═══════════════════════════════════════════════════════════════════════\n\n` +
           
           skills.domains.map(domain => `🎯 ${domain} - Practical experience with real-world projects`).join('\n') + '\n\n' +
           
           `═══════════════════════════════════════════════════════════════════════\n` +
           `                         SOFT SKILLS                                   \n` +
           `═══════════════════════════════════════════════════════════════════════\n\n` +
           
           skills.soft_skills.map(skill => `👥 ${skill} - Demonstrated through leadership roles and team projects`).join('\n') + '\n\n' +
           
           `💡 SKILL HIGHLIGHTS:\n` +
           `   • Expert in cutting-edge AI/ML technologies (RAG, LLM fine-tuning)\n` +
           `   • Full-stack development with modern frameworks\n` +
           `   • Production deployment experience with live users\n` +
           `   • Leadership experience managing technical teams\n` +
           `   • Research and publication capabilities\n` +
           `   • Competition-winning technical implementations\n\n` +
           
           `🚀 This comprehensive skill set represents 3+ years of intensive learning, \n` +
           `   practical application, and real-world project development! 🔥`;
  }

  getAIMLInfo() {
    const { skills } = resumeData;
    return `🤖 COMPREHENSIVE AI/ML EXPERTISE SHOWCASE:\n\n` +
           `🔥 EXPERT-LEVEL CAPABILITIES:\n` +
           skills.ai_ml.expert.map(skill => `   • ${skill} - Production-level implementation`).join('\n') + '\n\n' +
           
           `💪 ADVANCED PROFICIENCIES:\n` +
           skills.ai_ml.advanced.map(skill => `   • ${skill} - Real-world application experience`).join('\n') + '\n\n' +
           
           `🛠️ FRAMEWORKS & TECHNOLOGIES:\n` +
           skills.ai_ml.frameworks.map(tool => `   • ${tool} - Hands-on project experience`).join('\n') + '\n\n' +
           
           `🎯 SPECIALIZED TECHNIQUES:\n` +
           skills.ai_ml.techniques.map(tech => `   • ${tech} - Competition-winning implementations`).join('\n') + '\n\n' +
           
           `🚀 REAL AI/ML PROJECT PORTFOLIO:\n` +
           `   1. CyTech AI - Cybersecurity Anomaly Detection System\n` +
           `      • Isolation Forest & Random Forest algorithms\n` +
           `      • Real-time log monitoring with Apache Spark & Kafka\n` +
           `      • NLP for threat classification and clustering\n` +
           `      • Won 2nd place at AI Odyssey National Hackathon\n\n` +
           
           `   2. NxtHire - AI Resume Screening Platform\n` +
           `      • Advanced NLP for resume parsing and analysis\n` +
           `      • Intelligent candidate ranking algorithms\n` +
           `      • Machine learning-powered matching system\n` +
           `      • Production-ready recruitment automation\n\n` +
           
           `   3. PoliMeta - AI Policy Analysis System\n` +
           `      • Llama AI integration for policy insights\n` +
           `      • Data-driven decision support system\n` +
           `      • Citizens' feedback analysis using NLP\n` +
           `      • Government application research project\n\n` +
           
           `📊 COMPETITION ACHIEVEMENTS IN AI/ML:\n` +
           `   • 🥈 2nd Place - AI Odyssey National Hackathon (vs PhD teams)\n` +
           `   • 🏆 Top 10 - KELOS 2.0 (competed against IIT Madras, IIT Nagpur)\n` +
           `   • 🥇 1st Place - Multiple AI-focused technical competitions\n` +
           `   • 📚 Research Publication - IGI Global (AI/ML applications)\n\n` +
           
           `🎯 CUTTING-EDGE FOCUS AREAS:\n` +
           `   • RAG systems for intelligent information retrieval\n` +
           `   • LLM fine-tuning for domain-specific applications\n` +
           `   • Prompt engineering for optimal AI performance\n` +
           `   • Deep learning for computer vision and NLP\n` +
           `   • Real-time AI systems with Apache Spark/Kafka\n\n` +
           
           `💡 This isn't classroom theory - these are BATTLE-TESTED skills from national competitions and real deployments! 🔥`;
  }

  getExperienceInfo() {
    const { experience } = resumeData;
    let info = `💼 COMPREHENSIVE PROFESSIONAL EXPERIENCE DEEP DIVE:\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         PROFESSIONAL TIMELINE                          \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    // Detailed experience for each role
    experience.forEach((job, index) => {
      info += `${index + 1}. 💼 ${job.position.toUpperCase()}\n`;
      info += `   ════════════════════════════════════════════════════════════════\n`;
      info += `   🏢 Company: ${job.company}\n`;
      info += `   📅 Duration: ${job.duration}\n`;
      info += `   📍 Location: ${job.location}\n`;
      info += `   🎯 Employment Type: ${job.type}\n\n`;
      
      info += `   📋 ROLE DESCRIPTION:\n`;
      info += `      ${job.description}\n\n`;
      
      info += `   🏆 MAJOR ACHIEVEMENTS:\n`;
      job.achievements.forEach(achievement => {
        info += `      • ${achievement}\n`;
      });
      info += '\n';
      
      info += `   💻 TECHNOLOGIES & TOOLS UTILIZED:\n`;
      const techGroups = [];
      for (let i = 0; i < job.technologies.length; i += 4) {
        techGroups.push(job.technologies.slice(i, i + 4));
      }
      techGroups.forEach(group => {
        info += `      ${group.map(tech => `🔧 ${tech}`).join('  ')}\n`;
      });
      info += '\n';
      
      if (job.impact) {
        info += `   📊 QUANTIFIABLE IMPACT:\n`;
        info += `      ${job.impact}\n\n`;
      }
      
      if (job.projects) {
        info += `   🚀 KEY PROJECTS DELIVERED:\n`;
        job.projects.forEach(project => {
          info += `      • ${project}\n`;
        });
        info += '\n';
      }
      
      if (job.skills_gained) {
        info += `   📈 SKILLS DEVELOPED:\n`;
        job.skills_gained.forEach(skill => {
          info += `      • ${skill}\n`;
        });
        info += '\n';
      }
      
      if (job.recognition) {
        info += `   🏆 RECOGNITION RECEIVED:\n`;
        info += `      ${job.recognition}\n\n`;
      }
      
      info += `   ════════════════════════════════════════════════════════════════\n\n`;
    });
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         LEADERSHIP POSITIONS                           \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `👑 ORGANIZATIONAL LEADERSHIP:\n`;
    info += `   • 🎯 Technical Head - IEEE SIES GST\n`;
    info += `     - Leading 100+ student members in technical initiatives\n`;
    info += `     - Organizing workshops, seminars, and technical events\n`;
    info += `     - Mentoring junior students in technology and career development\n`;
    info += `     - Coordinating with industry professionals for knowledge sharing\n\n`;
    
    info += `   • 🏛️ Joint Secretary - Computer Society of India (CSI)\n`;
    info += `     - Managing administrative and technical responsibilities\n`;
    info += `     - Facilitating networking between students and industry\n`;
    info += `     - Organizing competitive programming and hackathon events\n`;
    info += `     - Contributing to curriculum development and academic excellence\n\n`;
    
    info += `🏆 PROJECT LEADERSHIP:\n`;
    info += `   • 🚀 Team Leader - Multiple Hackathon Victories\n`;
    info += `     - AI Odyssey 2024: Led team to 2nd place nationally (200+ teams)\n`;
    info += `     - KELOS 2024: Coordinated team to Top 10 finish nationally\n`;
    info += `     - Strategic planning and technical architecture decisions\n`;
    info += `     - Cross-functional collaboration and deadline management\n\n`;
    
    info += `   • 📱 Social Media Growth Leader - Adorebits\n`;
    info += `     - Achieved 4,000+ LinkedIn follower growth in 3 months\n`;
    info += `     - Content strategy development and execution\n`;
    info += `     - Brand positioning and digital marketing initiatives\n`;
    info += `     - Analytics tracking and performance optimization\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         CAREER PROGRESSION                             \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `📈 PROFESSIONAL DEVELOPMENT JOURNEY:\n`;
    info += `   🎯 PHASE 1: Foundation Building (IT Assistant)\n`;
    info += `      • Started with IT support and system maintenance\n`;
    info += `      • Learned backend development fundamentals\n`;
    info += `      • Built strong problem-solving and troubleshooting skills\n`;
    info += `      • Established reputation for reliability and technical competence\n\n`;
    
    info += `   🚀 PHASE 2: Technical Excellence (Meta Craftlab Intern)\n`;
    info += `      • Advanced to full-stack development with production deployments\n`;
    info += `      • Achieved Top 25 performance out of 1000+ interns\n`;
    info += `      • Gained experience with enterprise-level development practices\n`;
    info += `      • Received formal recommendation for exceptional performance\n\n`;
    
    info += `   🎨 PHASE 3: Creative Leadership (UI/UX Designer)\n`;
    info += `      • Transitioned to leading UI/UX initiatives\n`;
    info += `      • Delivered measurable business impact through design improvements\n`;
    info += `      • Integrated technical skills with creative design thinking\n`;
    info += `      • Built cross-functional collaboration capabilities\n\n`;
    
    info += `   🌟 PHASE 4: Next Level (Summer 2025 Internship Goal)\n`;
    info += `      • Ready for advanced AI/ML or full-stack development roles\n`;
    info += `      • Proven ability to exceed expectations and deliver results\n`;
    info += `      • Leadership experience with technical team management\n`;
    info += `      • Portfolio of competition wins and real-world impact\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         PROFESSIONAL ATTRIBUTES                        \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `💪 CORE STRENGTHS DEMONSTRATED:\n`;
    info += `   • 🏆 Consistent High Performance: Top 25 out of 1000+ track record\n`;
    info += `   • 🎯 Results-Oriented: Measurable impact in every role\n`;
    info += `   • 🚀 Fast Learner: Quickly adapts to new technologies and environments\n`;
    info += `   • 👥 Team Player: Excellent collaboration and communication skills\n`;
    info += `   • 🔍 Problem Solver: Creative solutions to complex technical challenges\n`;
    info += `   • 📈 Growth Mindset: Continuously improving and expanding skill set\n\n`;
    
    info += `🎯 TECHNICAL COMPETENCIES ACROSS ROLES:\n`;
    info += `   • 💻 Full-Stack Development: Frontend, backend, and database expertise\n`;
    info += `   • 🤖 AI/ML Implementation: Practical experience with modern frameworks\n`;
    info += `   • 🎨 UI/UX Design: User-centered design with technical implementation\n`;
    info += `   • ☁️ Cloud Deployment: Production-ready application hosting\n`;
    info += `   • 📊 Performance Optimization: Measurable improvements in metrics\n`;
    info += `   • 🔧 System Administration: Infrastructure and technical support\n\n`;
    
    info += `🔥 STANDOUT PERFORMANCE INDICATORS:\n`;
    info += `   • 📈 4,000+ LinkedIn follower growth (3 months at Adorebits)\n`;
    info += `   • 🏆 Top 25 intern performance (Meta Craftlab - 1000+ candidates)\n`;
    info += `   • 🥈 2nd Place AI Odyssey (national-level competition)\n`;
    info += `   • 👑 Technical leadership roles (IEEE, CSI positions)\n`;
    info += `   • 🚀 Production deployments with live user traffic\n`;
    info += `   • 📚 Published research at international journal (IGI Global)\n\n`;
    
    info += `💡 READY FOR SUMMER 2025 BECAUSE:\n`;
    info += `   ✅ Proven ability to exceed expectations in professional environments\n`;
    info += `   ✅ Experience with both remote and in-person team collaboration\n`;
    info += `   ✅ Track record of delivering measurable business impact\n`;
    info += `   ✅ Technical skills aligned with current industry standards\n`;
    info += `   ✅ Leadership potential demonstrated through multiple roles\n`;
    info += `   ✅ Professional maturity with strong work ethic and communication\n\n`;
    
    info += `🎯 The pattern is clear: Atharva doesn't just participate - he EXCELS! 🔥\n`;
    info += `   This comprehensive experience demonstrates both technical capability\n`;
    info += `   and professional excellence needed for Summer 2025 success! 💪`;
    
    return info;
  }

  getEducationInfo() {
    const { education } = resumeData;
    const currentEdu = education[0];
    return `🎓 Currently: ${currentEdu.degree} in ${currentEdu.field}\n` +
           `🏫 Institution: ${currentEdu.institution}\n` +
           `📊 CGPA: ${currentEdu.grade} (Third Year)\n\n` +
           `🏆 Academic Achievements:\n` +
           currentEdu.achievements.slice(0, 4).map(a => `   • ${a}`).join('\n') + '\n\n' +
           `Plus he's got a Diploma in IT with 82.60% and chess tournament wins! This guy doesn't just study - he DOMINATES! 👑`;
  }

  async getProjectsInfo() {
    const { projects } = resumeData;
    let info = `🚀 COMPREHENSIVE PROJECT PORTFOLIO DEEP DIVE:\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         GITHUB STATISTICS                              \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `📊 REPOSITORY METRICS:\n`;
    info += `   • 📚 Total Repositories: 25+ (public & private)\n`;
    info += `   • ⭐ Total Stars Earned: 50+ across all projects\n`;
    info += `   • 🍴 Total Forks: 8+ from community engagement\n`;
    info += `   • 📈 Languages: JavaScript, Python, TypeScript, HTML, CSS\n`;
    info += `   • 🌍 Public Profile: Showcasing innovation and technical depth\n`;
    info += `   • 🔒 Private Repos: Commercial and enterprise-level projects\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         FEATURED PROJECTS                              \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    // Detailed project breakdown
    const featuredProjects = projects.slice(0, 6);
    for (let i = 0; i < featuredProjects.length; i++) {
      const project = featuredProjects[i];
      info += `${i + 1}. 🏆 ${project.name.toUpperCase()}\n`;
      info += `   ════════════════════════════════════════════════════════════════\n`;
      
      info += `   📊 PROJECT STATUS: ${project.status === 'live' ? '🟢 LIVE & ACTIVE' : '🔧 IN DEVELOPMENT'}\n`;
      info += `   ⭐ Community Impact: ${project.stars || 'New Release'} stars | ${project.forks || 0} forks\n\n`;
      
      info += `   📝 DETAILED DESCRIPTION:\n`;
      info += `      ${project.description}\n\n`;
      
      if (project.key_features && project.key_features.length > 0) {
        info += `   🎯 KEY FEATURES:\n`;
        project.key_features.forEach(feature => {
          info += `      • ${feature}\n`;
        });
        info += '\n';
      }
      
      if (project.achievements && project.achievements.length > 0) {
        info += `   🏆 NOTABLE ACHIEVEMENTS:\n`;
        project.achievements.forEach(achievement => {
          info += `      • ${achievement}\n`;
        });
        info += '\n';
      }
      
      info += `   💻 COMPREHENSIVE TECH STACK:\n`;
      info += `      ${project.technologies.map(tech => `🔧 ${tech}`).join('  ')}\n\n`;
      
      if (project.architecture) {
        info += `   🏗️ ARCHITECTURE:\n`;
        info += `      ${project.architecture}\n\n`;
      }
      
      if (project.github) {
        info += `   🔗 REPOSITORY: ${project.github}\n`;
      }
      
      if (project.live_demo) {
        info += `   🌐 LIVE DEMO: ${project.live_demo}\n`;
      }
      
      if (project.impact) {
        info += `   🎯 BUSINESS IMPACT: ${project.impact}\n`;
      }
      
      if (project.users) {
        info += `   👥 USER BASE: ${project.users}\n`;
      }
      
      info += `   ════════════════════════════════════════════════════════════════\n\n`;
    }
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         PROJECT CATEGORIES                             \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `🤖 AI/ML APPLICATIONS (8+ projects):\n`;
    info += `   • Advanced RAG implementations for intelligent search\n`;
    info += `   • LLM integration and fine-tuning for custom domains\n`;
    info += `   • Computer vision applications with real-time processing\n`;
    info += `   • Natural language processing for business automation\n`;
    info += `   • Machine learning models for predictive analytics\n\n`;
    
    info += `🌐 WEB DEVELOPMENT (12+ projects):\n`;
    info += `   • Full-stack applications with modern frameworks\n`;
    info += `   • Responsive UI/UX design with cross-platform compatibility\n`;
    info += `   • RESTful API development and microservices architecture\n`;
    info += `   • Database design and optimization (SQL & NoSQL)\n`;
    info += `   • Real-time features with WebSocket implementation\n\n`;
    
    info += `📱 MOBILE & CROSS-PLATFORM (5+ projects):\n`;
    info += `   • React Native applications for iOS/Android\n`;
    info += `   • Progressive Web Apps (PWA) development\n`;
    info += `   • Flutter applications with native performance\n`;
    info += `   • Mobile-first responsive design principles\n\n`;
    
    info += `🔧 AUTOMATION & TOOLS (8+ projects):\n`;
    info += `   • CLI tools for developer productivity\n`;
    info += `   • Workflow automation and DevOps integration\n`;
    info += `   • Data processing pipelines and ETL solutions\n`;
    info += `   • System monitoring and performance optimization\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         TECHNICAL ACHIEVEMENTS                         \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `🏆 COMPETITION WINNING PROJECTS:\n`;
    info += `   • 🥈 AI Odyssey 2024: Advanced AI application (2nd place nationally)\n`;
    info += `   • 🏆 KELOS 2024: Full-stack development (Top 10 nationally)\n`;
    info += `   • 🥇 Multiple 2025 competitions: Solo victories in technical categories\n`;
    info += `   • 🎯 Hackathon projects deployed to production environments\n\n`;
    
    info += `📈 PRODUCTION DEPLOYMENTS:\n`;
    info += `   • ☁️ AWS, Netlify, Vercel hosting with CI/CD pipelines\n`;
    info += `   • 📊 Live applications serving 1000+ concurrent users\n`;
    info += `   • 🔒 Security implementations with authentication systems\n`;
    info += `   • ⚡ Performance optimization achieving 90+ Lighthouse scores\n`;
    info += `   • 📱 Mobile-responsive designs with PWA capabilities\n\n`;
    
    info += `🔬 RESEARCH & INNOVATION:\n`;
    info += `   • 📚 Published research at IGI Global (international recognition)\n`;
    info += `   • 🧪 Experimental AI/ML implementations for academic contribution\n`;
    info += `   • 🔍 Open-source contributions to community projects\n`;
    info += `   • 💡 Novel approaches to traditional development challenges\n\n`;
    
    info += `═══════════════════════════════════════════════════════════════════════\n`;
    info += `                         DEVELOPMENT METRICS                            \n`;
    info += `═══════════════════════════════════════════════════════════════════════\n\n`;
    
    info += `📊 CODING STATISTICS (Last 12 months):\n`;
    info += `   • 📝 Lines of Code: 50,000+ across all projects\n`;
    info += `   • 💾 Commits: 500+ with meaningful contributions\n`;
    info += `   • 🌟 Pull Requests: 200+ including major feature additions\n`;
    info += `   • 🐛 Issues Resolved: 150+ bug fixes and enhancements\n`;
    info += `   • 📈 Active Development: Daily contributions and project updates\n\n`;
    
    info += `⚡ PERFORMANCE BENCHMARKS:\n`;
    info += `   • 🚀 Sub-second load times for all web applications\n`;
    info += `   • 📱 Mobile performance scores above 85/100\n`;
    info += `   • 🔍 SEO optimization scores consistently 90+\n`;
    info += `   • ♿ Accessibility compliance (WCAG 2.1 AA standards)\n`;
    info += `   • 🌐 Cross-browser compatibility (Chrome, Firefox, Safari, Edge)\n\n`;
    
    info += `💡 PROJECT DEVELOPMENT INSIGHTS:\n`;
    info += `   • 🎯 Each project solves real-world problems with measurable impact\n`;
    info += `   • 🔄 Iterative development with user feedback integration\n`;
    info += `   • 📋 Comprehensive documentation and testing coverage\n`;
    info += `   • 🤝 Collaborative development with version control best practices\n`;
    info += `   • 🚀 Scalable architecture design for future growth\n\n`;
    
    info += `🔥 PORTFOLIO HIGHLIGHTS:\n`;
    info += `   • This AI CLI itself demonstrates meta-programming skills! 🤖\n`;
    info += `   • Projects span from academic research to commercial applications\n`;
    info += `   • Consistent track record of completing projects to production\n`;
    info += `   • Innovation in both frontend experiences and backend architecture\n`;
    info += `   • Perfect blend of creativity, technical depth, and business impact!\n\n`;
    
    info += `🎯 Ready to contribute this expertise to your Summer 2025 internship program! 🚀`;
    
    return info;
  }

  getHiringInfo() {
    return `🎯 COMPELLING REASONS TO HIRE ATHARVA FOR SUMMER 2025:\n\n` +
           `🏆 PROVEN TRACK RECORD:\n` +
           `   • TOP 25 out of 1000+ interns at Meta Craftlab (with Letter of Recommendation)\n` +
           `   • 8+ Competition victories including national-level hackathons\n` +
           `   • 2nd Place at AI Odyssey (competed against PhD teams from IIT/NIT)\n` +
           `   • 1st Place in multiple technical competitions in 2025\n` +
           `   • Research published at IGI Global (international recognition)\n\n` +
           
           `🤖 ADVANCED AI/ML EXPERTISE:\n` +
           `   • Expert in RAG (Retrieval-Augmented Generation)\n` +
           `   • LLM Fine-tuning and Prompt Engineering specialist\n` +
           `   • Real-world AI applications: CyTech (cybersecurity), NxtHire (recruitment)\n` +
           `   • Deep Learning implementations with TensorFlow, PyTorch\n` +
           `   • Apache Spark, Kafka for big data processing\n\n` +
           
           `💻 FULL-STACK DEVELOPMENT MASTERY:\n` +
           `   • Production deployments with SvelteKit, React, Node.js\n` +
           `   • 25+ GitHub repositories with 50+ stars total\n` +
           `   • Modern tech stack: JavaScript, Python, TypeScript\n` +
           `   • Backend expertise: Express, Flask, API development\n` +
           `   • Cloud deployment experience (AWS, Netlify)\n\n` +
           
           `📊 MEASURABLE BUSINESS IMPACT:\n` +
           `   • 4,000+ LinkedIn follower growth in 3 months (Adorebits)\n` +
           `   • Website redesigns with improved user engagement\n` +
           `   • Production applications serving live users\n` +
           `   • 8.8 CGPA academic excellence with practical application\n\n` +
           
           `👑 LEADERSHIP & COLLABORATION:\n` +
           `   • Technical Head - IEEE SIES GST (100+ members)\n` +
           `   • Joint Secretary - Computer Society of India\n` +
           `   • Team leader in multiple winning hackathon teams\n` +
           `   • Mentors peers and leads technical initiatives\n\n` +
           
           `🚀 PERFECT FOR SUMMER 2025 BECAUSE:\n` +
           `   • Available for 3+ months of dedicated work\n` +
           `   • Eager to contribute to cutting-edge AI/ML projects\n` +
           `   • Self-motivated with proven ability to deliver results\n` +
           `   • Passionate about learning and implementing new technologies\n` +
           `   • Strong communication skills and team collaboration\n\n` +
           
           `💡 BONUS: He built THIS AI to showcase his skills. That's innovation! 🤖\n` +
           `🎯 Ready to make an immediate impact from day one! 💪`;
  }

  getContactInfo() {
    const { personal } = resumeData;
    return `📱 CONTACT THE LEGEND:\n\n` +
           `📧 Email: ${personal.email}\n` +
           `💼 LinkedIn: ${personal.linkedin}\n` +
           `🐙 GitHub: ${personal.github}\n` +
           `📱 Phone: ${personal.phone}\n` +
           `📍 Location: ${personal.location}\n` +
           `🌐 Website: ${personal.website}\n\n` +
           `🚨 WARNING: He responds faster than my processing speed! ⚡\n` +
           `Perfect for Summer 2025 internship discussions! 🌞`;
  }

  getAchievementsInfo() {
    const { achievements, competitions_detailed } = resumeData;
    let info = "🏆 COMPREHENSIVE ACHIEVEMENT SHOWCASE:\n\n";
    
    info += "🎯 RECENT VICTORY HIGHLIGHTS (2024-2025):\n";
    achievements.slice(0, 6).forEach((achievement, i) => {
      info += `${i + 1}. ${achievement.title}\n`;
      info += `   🏢 ${achievement.organization} | 📅 ${achievement.year}\n`;
      info += `   💡 ${achievement.description}\n`;
      if (achievement.details) {
        info += `   🔍 Details: ${achievement.details}\n`;
      }
      info += '\n';
    });
    
    info += "🚀 COMPETITION DEEP DIVE:\n\n";
    
    // AI Odyssey details
    if (competitions_detailed["2024_ai_odyssey"]) {
      const comp = competitions_detailed["2024_ai_odyssey"];
      info += `🥈 ${comp.name}:\n`;
      info += `   • Rank: ${comp.rank} out of ${comp.participants} participants\n`;
      info += `   • Team: ${comp.team.join(', ')}\n`;
      info += `   • Project: ${comp.project}\n`;
      info += `   • Duration: ${comp.duration} of intense coding\n`;
      info += `   • Technologies: ${comp.technologies.join(', ')}\n`;
      info += `   • Achievement: Competed against PhD teams and sponsored participants!\n\n`;
    }
    
    // KELOS details
    if (competitions_detailed["2024_kelos"]) {
      const comp = competitions_detailed["2024_kelos"];
      info += `🏆 ${comp.name}:\n`;
      info += `   • Rank: ${comp.rank} nationally\n`;
      info += `   • Competed against: ${comp.competing_against.join(', ')}\n`;
      info += `   • Team: ${comp.team.join(', ')}\n`;
      info += `   • Technologies mastered: ${comp.technologies.join(', ')}\n`;
      info += `   • Duration: ${comp.duration} of non-stop innovation\n\n`;
    }
    
    // 2025 Solo victories
    if (competitions_detailed["2025_solo_wins"]) {
      info += "🎯 2025 SOLO COMPETITION DOMINATION:\n";
      competitions_detailed["2025_solo_wins"].competitions.forEach(comp => {
        info += `   • ${comp.name}: ${comp.rank} ${comp.solo ? '(SOLO!)' : ''}\n`;
        info += `     Project: ${comp.project || comp.topic}\n`;
      });
      info += '\n';
    }
    
    info += "📈 IMPACT & RECOGNITION:\n";
    info += "   • 📚 Research published at IGI Global (international journal)\n";
    info += "   • 👑 Leadership roles: IEEE Technical Head, CSI Joint Secretary\n";
    info += "   • 🚀 Production deployments with live user traffic\n";
    info += "   • 📊 4,000+ LinkedIn follower growth in 3 months\n";
    info += "   • 🎓 8.8 CGPA with practical application excellence\n\n";
    
    info += "💡 The pattern is clear: Atharva doesn't just participate - he DOMINATES! 🔥";
    
    return info;
  }

  getRecruiterInfo() {
    const { recruiter_highlights } = resumeData;
    return `🎯 RECRUITER QUICK FACTS:\n\n` +
           `📊 KEY STATS:\n` +
           recruiter_highlights.key_stats.map(stat => `   • ${stat}`).join('\n') + '\n\n' +
           `🛠️ TECHNICAL DEPTH:\n` +
           recruiter_highlights.technical_depth.map(tech => `   • ${tech}`).join('\n') + '\n\n' +
           `👨‍💼 LEADERSHIP EXPERIENCE:\n` +
           recruiter_highlights.leadership_experience.map(exp => `   • ${exp}`).join('\n') + '\n\n' +
           `🔗 VERIFIED LINKS:\n` +
           `   📧 ${recruiter_highlights.verified_links.email}\n` +
           `   💼 ${recruiter_highlights.verified_links.linkedin}\n` +
           `   🐙 ${recruiter_highlights.verified_links.github}\n` +
           `   📱 ${recruiter_highlights.verified_links.phone}\n\n` +
           `🚀 RECENT WORK:\n` +
           recruiter_highlights.recent_work.map(work => `   • ${work}`).join('\n') + '\n\n' +
           `Ready for your next interview! 🚀`;
  }

  getHelpInfo() {
    return `🤖 AI-ATHARVA COMPREHENSIVE HELP GUIDE\n\n` +
           `🎯 CORE TOPICS (with rich animations!):\n` +
           `🛠️ "skills" or "programming" - Complete tech arsenal with animated progress bars\n` +
           `🤖 "AI/ML", "RAG", "LLM" - Advanced AI expertise with project showcases\n` +
           `💼 "experience" or "internship" - Professional timeline with achievements\n` +
           `🚀 "projects" or "github" - Interactive portfolio with live stats\n` +
           `🏆 "achievements" or "competitions" - Victory showcase with fireworks\n` +
           `🎓 "education" or "college" - Academic excellence & leadership roles\n\n` +
           
           `💡 SPECIAL QUERIES:\n` +
           `💼 "why hire him" or "summer 2025" - Compelling hiring arguments\n` +
           `📞 "contact" or "links" - Professional contact information\n` +
           `🎯 "recruiter" or "HR" - Quick facts for hiring professionals\n` +
           `🏫 "student" - Academic status and achievements\n\n` +
           
           `🎬 VISUAL FEATURES:\n` +
           `• Animated skill progress bars (95% expert levels!)\n` +
           `• Interactive project showcases with GitHub stats\n` +
           `• Competition victory timelines with visual effects\n` +
           `• Professional experience timelines\n` +
           `• Achievement displays with trophy animations\n` +
           `• Fireworks for major accomplishments\n` +
           `• Matrix-style loading effects\n\n` +
           
           `🔥 TRY THESE SPECIFIC QUERIES:\n` +
           `• "Tell me about his hackathon wins"\n` +
           `• "Show me his AI/ML projects"\n` +
           `• "What makes him perfect for Summer 2025?"\n` +
           `• "Display his technical skills"\n` +
           `• "Show his GitHub portfolio"\n\n` +
           
           `🚀 PRO TIP: I respond with detailed, comprehensive information backed by real data!\n` +
           `💪 Each response includes measurable achievements and specific project details.\n\n` +
           
           `Type 'exit' to leave (but seriously, you'll miss the entertainment! 😏)`;
  }

  async handleExit() {
    console.log();
    console.log(ASCII_ART.rocket);
    await AnimationEngine.typewriterLine("Wait, you're leaving already? 🥺", 40, 'yellow');
    await AnimationEngine.sleep(1000);
    await AnimationEngine.typewriterLine("Before you go... remember Atharva is available for Summer 2025 internships! 🌞", 30, 'cyan');
    await AnimationEngine.sleep(1000);
    await AnimationEngine.typewriterLine("Quick contact: satharva2004@gmail.com | github.com/Satharva2004 📧✨", 30, 'green');
    await AnimationEngine.fireworks();
    console.log();
    console.log(chalk.gray('Thanks for chatting with AI-ATHARVA! 🚀'));
    console.log(chalk.yellow('Remember: RAG Expert + Top 5/1000+ interns! 🏆'));
    this.isRunning = false;
  }
}

// Start the AI-ATHARVA experience
async function main() {
  const client = new AIAtharvaClient();
  await client.start();
}

process.on('SIGINT', async () => {
  console.log('\n');
  await AnimationEngine.typewriterLine("Emergency exit! But don't forget - Summer 2025 internships with RAG expertise! 🚀", 20, 'yellow');
  process.exit(0);
});

main().catch(console.error);