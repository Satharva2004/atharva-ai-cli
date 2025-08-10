# 🚀 Collaborative Notes CLI

A powerful collaborative notes application with AI integration, real-time collaboration, and rich document features. Your terminal-based Notion alternative!

## ✨ Features

- **🤝 Real-time Collaboration** - Multiple users can edit notes simultaneously
- **🤖 AI-Powered Summaries** - Generate intelligent summaries using Gemini AI
- **🎭 Cool User Names** - Get awesome names like Neo, Gandalf, Iron Man, etc.
- **📋 Todo Lists** - Add and manage checkbox todo items
- **📋 Document Management** - Copy, share, and track document dates
- **🔗 Shareable Rooms** - Easy room sharing with unique links
- **📱 Simple Commands** - Use `notes` command for quick access

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/collaborative-notes-cli.git
cd collaborative-notes-cli

# Install dependencies
npm install

# Ready to use immediately!
# No API key setup required

# Install globally (optional)
npm install -g .
```

### Usage

```bash
# Interactive mode
notes

# Start server
notes server

# Join/create room
notes meeting-notes
notes client brainstorm

# Quick room join
notes weekly-review
```

## 🔧 Commands

### Client Commands
- `/summarize` - Generate AI summary of notes
- `/copy` - Copy document to clipboard
- `/share` - Show shareable room link
- `/date` - Show room creation/update dates
- `/todo` - Add checkbox todo item
- `/help` - Show available commands
- `/exit` - Leave room and disconnect

### Server Commands
- `notes server` - Start WebSocket server
- `notes client <room>` - Join/create a room
- `notes <room>` - Quick room join

## 🌐 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Or use npm script
npm run deploy
```

### Environment Variables
No environment variables needed for deployment!
The platform uses a public API key for AI features.

## 🏗️ Architecture

- **WebSocket Server** - Real-time communication
- **Room Management** - Dynamic room creation and management
- **AI Integration** - Gemini AI for smart summaries
- **Todo System** - Collaborative task management
- **User Management** - Cool auto-generated usernames

## 📁 Project Structure

```
collaborative-notes-cli/
├── bin/
│   └── cli.js          # CLI command handler
├── lib/
│   ├── commands/        # Command implementations
│   ├── data/           # Data models
│   ├── responses/      # AI response handling
│   └── utils/          # Utility functions
├── server.js           # WebSocket server
├── client.js           # Client implementation
├── index.js            # Main entry point
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Node.js and WebSockets
- AI powered by Google Gemini
- Inspired by collaborative tools like Notion and Google Docs

## 📞 Support

- Create an issue for bugs or feature requests
- Check the [documentation](docs/) for detailed guides
- Join our community discussions

---

Made with ❤️ for productive collaboration!
