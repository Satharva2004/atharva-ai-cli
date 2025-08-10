# 🚀 Setup Guide - Collaborative Notes CLI

Complete setup instructions for the enhanced collaborative note-taking tool with Gemini AI integration.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 14.0.0 or higher
- **npm**: Usually comes with Node.js
- **Internet Connection**: Required for Gemini AI API access

### Node.js Installation
If you don't have Node.js installed:

**Windows:**
```bash
# Download from https://nodejs.org/
# Or use Chocolatey:
choco install nodejs
```

**macOS:**
```bash
# Using Homebrew:
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version
npm --version
```

## 🔑 Gemini API Key Setup

### 1. Get Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (starts with `AIza...`)

### 2. Create Environment File
In your project root directory, create a `.env` file:

**Windows (PowerShell):**
```powershell
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

**Windows (Command Prompt):**
```cmd
echo GEMINI_API_KEY=your_actual_api_key_here > .env
```

**macOS/Linux:**
```bash
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

**Manual Creation:**
Create a file named `.env` in the project root and add:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Verify API Key
Replace `your_actual_api_key_here` with your real Gemini API key (no quotes needed).

## 📦 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Installation
```bash
# Check if all dependencies are installed
npm list --depth=0

# You should see:
# ├── @google/generative-ai@^0.24.1
# ├── ws@^8.16.0
# ├── chalk@^4.1.2
# └── dotenv@^16.4.5
```

## 🧪 Testing Your Setup

### 1. Test Server Startup
```bash
node index.js server
```

**Expected Output:**
```
╔══════════════════════════════════════════════════════════════╗
║                    🤝 COLLABORATIVE NOTES                    ║
║                 Powered by Gemini AI & WebSockets           ║
╚══════════════════════════════════════════════════════════════╝

🚀 Starting Collaborative Notes Server...
📝 Server will run on port 8080
💡 Clients can connect to: ws://localhost:8080
────────────────────────────────────────────────────────────
🚀 Collaborative Notes Server started on port 8080
📝 WebSocket URL: ws://localhost:8080
🤖 Gemini AI integration: ✓ Active
────────────────────────────────────────────────────────────
✅ Server is running!
💡 Press Ctrl+C to stop the server
📊 Server will show real-time connection and activity logs
```

### 2. Test Client Connection
In a **new terminal window**:
```bash
node index.js client test-room
```

**Expected Output:**
```
🔌 Starting Collaborative Notes Client...
📝 Room: "test-room"
💡 Connecting to: ws://localhost:8080
────────────────────────────────────────────────────────────
✅ Client started successfully!
💡 Press Ctrl+C to disconnect
🔌 Connecting to ws://localhost:8080...
✅ Connected successfully!
🏠 Joining room: "test-room"

🎉 Welcome to Collaborative Notes!
📝 Room: "test-room"
👤 Your ID: user-abc123
💡 Type your notes or use commands: /summarize, /help, /clear, /exit
────────────────────────────────────────────────────────────
📝 Welcome to "test-room"! You're connected with 1 users.
📊 Room: "test-room" | Users: 1 | Created: [timestamp]
📄 Document is empty - start typing to add notes!
user-abc123> 
```

### 3. Test Basic Functionality
1. **Type some text** in the client terminal
2. **Press Enter** - you should see the document update
3. **Use `/help`** to see available commands
4. **Use `/status`** to see connection information

## 🔧 Advanced Configuration

### Custom Port Configuration
To change the server port, modify `server.js`:
```javascript
constructor(port = 8080) // Change default port here
```

Or set environment variable:
```bash
# Add to .env file
PORT=9000
```

### Custom Client ID
When starting a client, you can specify a custom ID:
```bash
node index.js client meeting-notes john-doe
```

### Multiple Clients
Test collaboration by opening multiple terminal windows:
```bash
# Terminal 1
node index.js client meeting-notes alice

# Terminal 2  
node index.js client meeting-notes bob

# Terminal 3
node index.js client meeting-notes charlie
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "GEMINI_API_KEY not found in .env file"
**Problem**: Missing or incorrectly named environment file
**Solution**:
```bash
# Check if .env file exists
ls -la .env

# Create if missing
echo "GEMINI_API_KEY=your_key_here" > .env

# Verify content
cat .env
```

#### 2. "Failed to start server: EADDRINUSE"
**Problem**: Port 8080 is already in use
**Solution**:
```bash
# Find what's using the port
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# Kill the process or change port in server.js
```

#### 3. "Connection refused"
**Problem**: Server not running or wrong port
**Solution**:
```bash
# Ensure server is running first
node index.js server

# Check server output for correct port
# Verify client connects to same port
```

#### 4. "AI summary failed: Invalid or missing Gemini API key"
**Problem**: Invalid API key or network issues
**Solution**:
```bash
# Verify API key format (should start with AIza...)
cat .env

# Test API key manually
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

#### 5. "WebSocket connection failed"
**Problem**: Network or firewall blocking connection
**Solution**:
```bash
# Check if port is accessible
telnet localhost 8080

# Verify firewall settings
# Try different port if needed
```

### Debug Mode
Enable verbose logging:
```bash
# Set debug environment variable
DEBUG=* node index.js server

# Or modify server.js to add more console.log statements
```

### Performance Issues
If you experience lag or disconnections:
1. **Check network stability**
2. **Reduce document size** (very long documents may cause delays)
3. **Limit concurrent users** per room
4. **Monitor system resources** (CPU, memory)

## 📱 Usage Examples

### Meeting Notes
```bash
# Start server
node index.js server

# Join meeting room
node index.js client daily-standup

# Type meeting agenda, take notes
# Use /summarize for meeting summary
```

### Project Collaboration
```bash
# Multiple team members join same room
node index.js client project-alpha

# Real-time brainstorming and documentation
# Instant synchronization across all team members
```

### Study Groups
```bash
# Create study session room
node index.js client math-study

# Collaborative problem solving
# Share solutions and explanations
```

## 🔒 Security Best Practices

### API Key Security
- **Never commit** `.env` file to version control
- **Use strong, unique** API keys
- **Rotate keys** periodically
- **Monitor usage** in Google AI Studio

### Network Security
- **Default localhost** - only accessible from your machine
- **Firewall configuration** if exposing to network
- **HTTPS/WSS** for production deployments

### Input Validation
- **Room names** are validated (alphanumeric, hyphens, underscores)
- **Message content** is processed as-is
- **Consider additional validation** for production use

## 🚀 Next Steps

After successful setup:

1. **Explore Commands**: Try all available slash commands
2. **Test Collaboration**: Invite team members to join rooms
3. **Customize**: Modify colors, messages, or add features
4. **Deploy**: Consider hosting for team-wide access
5. **Contribute**: Submit issues or pull requests

## 📞 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review error messages** carefully
3. **Verify prerequisites** are met
4. **Check network connectivity**
5. **Submit detailed issue reports** with:
   - Operating system and Node.js version
   - Exact error messages
   - Steps to reproduce
   - Environment details

---

**Happy Collaborating! 🎉**
