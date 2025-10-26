# Git Guide for Question Paper Repository

## 🚀 Quick Git Setup

### 1. Initialize Git Repository
```bash
git init
```

### 2. Add All Files (respecting .gitignore)
```bash
git add .
```

### 3. First Commit
```bash
git commit -m "Initial commit: Question Paper Repository with 3D animations and mobile responsiveness"
```

### 4. Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/question-paper-repository.git
```

### 5. Push to GitHub
```bash
git push -u origin main
```

## 📁 What's Included in Git

### ✅ **Files That WILL Be Pushed:**
- `public/index.html` - Main website
- `public/css/` - All stylesheets
- `public/js/` - All JavaScript files
- `server.js` - Backend server
- `package.json` - Dependencies
- `vercel.json` - Deployment config
- `README.md` - Documentation
- `start.bat` / `start.sh` - Startup scripts
- `public/uploads/.gitkeep` - Empty uploads directory

### ❌ **Files That WON'T Be Pushed:**
- `node_modules/` - Dependencies (too large)
- `.env` - Environment variables (sensitive)
- `public/uploads/*` - Uploaded files (user data)
- `*.log` - Log files
- `.DS_Store` - Mac system files
- `Thumbs.db` - Windows system files
- `.vscode/` - Editor settings
- `coverage/` - Test coverage reports

## 🔄 Daily Git Workflow

### Make Changes
1. Edit your files
2. Test locally: `node server.js`
3. Check what changed: `git status`

### Commit Changes
```bash
# Add specific files
git add public/css/style.css

# Or add all changes
git add .

# Commit with message
git commit -m "Add mobile responsiveness improvements"
```

### Push to GitHub
```bash
git push origin main
```

## 🛠️ Useful Git Commands

### Check Status
```bash
git status
```

### See What Changed
```bash
git diff
```

### Undo Changes (before commit)
```bash
git checkout -- filename
```

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### See Commit History
```bash
git log --oneline
```

### Pull Latest Changes
```bash
git pull origin main
```

## 🔒 Security Notes

### Never Commit:
- `.env` files (contains API keys)
- Database files
- User uploaded content
- Personal information
- API keys or passwords

### Always Check:
```bash
git status
```
Before committing to see what files are being added.

## 📱 Mobile Testing Before Push

1. **Test on Desktop:**
   ```bash
   node server.js
   # Open http://localhost:3001
   ```

2. **Test on Mobile:**
   - Find your IP: `ipconfig`
   - On phone: `http://YOUR_IP:3001`

3. **Test All Features:**
   - Upload files
   - Search functionality
   - Mobile navigation
   - PDF/image viewer

## 🚀 Deployment Ready

Your repository is ready for:
- ✅ **GitHub** - Source code hosting
- ✅ **Vercel** - Automatic deployment
- ✅ **Netlify** - Alternative hosting
- ✅ **Heroku** - Cloud platform

## 📋 Pre-Push Checklist

- [ ] Code works locally
- [ ] Mobile responsive
- [ ] No sensitive data in files
- [ ] All features tested
- [ ] README updated
- [ ] Commit message is descriptive

---

**Your Question Paper Repository is Git-ready! 🎉**
