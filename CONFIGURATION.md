# Configuration Guide

## 🔧 Environment Setup

### 1. Create Environment File

Create a `.env` file in the root directory with the following content:

```env
# Server Configuration
PORT=3001

# Gemini AI API Configuration
GEMINI_API_KEY=AIzaSyCc3BQ8OTd4nRKw_YgEO9V983FgAJDarKY

# Database Configuration (for Vercel integration)
# VERCEL_DATABASE_URL=your_vercel_database_url_here

# Security Configuration
NODE_ENV=development
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Replace `your_gemini_api_key_here` in the `.env` file

### 3. Update Configuration

The application will automatically:
- Load the API key from the `.env` file
- Use it for AI responses
- Fall back to test mode if the API key is not available

## 🚀 How It Works

### Configuration Loading
1. **Server**: Loads configuration from `config.js` and `.env`
2. **Client**: Fetches API key from `/api/config` endpoint
3. **AI Chat**: Uses the API key for Gemini API calls

### Fallback System
- If API key is not available → Test mode (predefined responses)
- If API key is invalid → Error handling with fallback responses
- If server is down → Test mode responses

## 🔒 Security Features

### API Key Protection
- API key is stored server-side only
- Client receives key through secure endpoint
- No hardcoded keys in client-side code

### Environment Variables
- Sensitive data in `.env` file
- `.env` is in `.gitignore` (not committed to Git)
- Production keys can be set in deployment environment

## 📁 File Structure

```
question-paper-repository/
├── .env                    # Environment variables (create this)
├── config.js              # Configuration file
├── server.js              # Server with config integration
├── public/js/ai-chat.js   # AI chat with dynamic API key loading
└── CONFIGURATION.md       # This guide
```

## 🛠️ Troubleshooting

### API Key Issues
1. **Check `.env` file exists** in root directory
2. **Verify API key format** (should start with `AIza`)
3. **Check server logs** for configuration errors
4. **Test API key** at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Test Mode
- If you see test responses instead of AI responses
- Check browser console for API key loading errors
- Verify server is running and accessible

### Debug Information
- Click the bug icon (🐛) in the chat interface
- Check "API Key" status in debug panel
- Look for error messages in browser console

## 🚀 Deployment

### Local Development
1. Create `.env` file with your API key
2. Run `node server.js`
3. Open `http://localhost:3001`

### Production (Vercel)
1. Set environment variables in Vercel dashboard
2. Deploy with `vercel`
3. API key will be loaded from environment

---

**Your AI assistant is now properly configured with environment variables! 🎉**
