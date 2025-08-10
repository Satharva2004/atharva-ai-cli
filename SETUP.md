# 🚀 Setup Guide

## Prerequisites

- Node.js 14.0.0 or higher
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gemini API Key

Create a `.env` file in the project root directory:

```bash
# Windows (PowerShell)
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# Windows (Command Prompt)
echo GEMINI_API_KEY=your_actual_api_key_here > .env

# macOS/Linux
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

**Important**: Replace `your_actual_api_key_here` with your real Gemini API key!

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in your `.env` file

### 4. Test the Setup

#### Start the Server
```bash
node index.js server
```

You should see:
```
🚀 Collaborative Notes Server started on port 8080
📝 Clients can connect to: ws://localhost:8080
💡 Use 'node index.js client <room>' to join a room
```

#### Join as a Client (in a new terminal)
```bash
node index.js client test-room
```

You should see:
```
🔌 Starting Collaborative Notes Client...
📝 Room: test-room
💡 Connecting to: ws://localhost:8080
✅ Connected to server!
🏠 Joining room: test-room
```

## 🚨 Troubleshooting

### "GEMINI_API_KEY not set"
- Make sure you created the `.env` file
- Check that the file is in the project root directory
- Verify the API key is correct (no extra spaces)

### "Connection refused"
- Ensure the server is running first
- Check if port 8080 is available
- Try a different port if needed

### "WebSocket connection failed"
- Verify the server is running
- Check firewall settings
- Ensure you're using the correct WebSocket URL

## 🔧 Advanced Configuration

### Custom Server Port

You can modify the server port by editing `index.js`:

```javascript
// Change this line in startServer() function
const server = new CollaborativeNoteServer(8080); // Change 8080 to your preferred port
```

### Environment Variables

The `.env` file supports these variables:

```bash
GEMINI_API_KEY=your_api_key_here
# SERVER_PORT=8080  # Optional, defaults to 8080
```

## ✅ Verification

To verify everything is working:

1. **Server**: Should start without errors and show connection info
2. **Client**: Should connect successfully and show room info
3. **AI Summary**: Type `/summarize` in client mode (requires document content)

## 🎯 Next Steps

Once setup is complete:

1. Start the server: `node index.js server`
2. Join rooms: `node index.js client <room-name>`
3. Collaborate with others in real-time!
4. Use `/summarize` to generate AI summaries

---

**Need help?** Check the main README.md for detailed usage instructions.
