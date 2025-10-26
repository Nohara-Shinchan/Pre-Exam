# How to Run the Question Paper Repository

## 🚀 Quick Start (Recommended)

### Method 1: Double-click to run
1. **Double-click `start.bat`** (Windows)
2. Wait for the server to start
3. Open your browser and go to: `http://localhost:3001`

### Method 2: Command Line
1. Open Command Prompt or PowerShell in the project folder
2. Run these commands:
   ```bash
   npm install
   node server.js
   ```
3. Open your browser and go to: `http://localhost:3001`

## 🔧 Troubleshooting

### Error: "Port already in use"
- The server will automatically try port 3002, 3003, etc.
- Or manually kill the process:
  ```bash
  netstat -ano | findstr :3001
  taskkill /PID <PID_NUMBER> /F
  ```

### Error: "Failed to load question papers"
- Make sure you're accessing `http://localhost:3001` (not 5500)
- Check that the server is running
- Look at the terminal for any error messages

### Mobile Testing
1. Start the server on your computer
2. Find your computer's IP address:
   - Windows: `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)
3. On your phone, connect to the same WiFi
4. Open browser and go to: `http://192.168.1.100:3001`

## 📱 Mobile Features

✅ **Responsive Design** - Works on all screen sizes  
✅ **Touch Optimized** - Large buttons and touch-friendly interface  
✅ **Mobile Navigation** - Hamburger menu for mobile devices  
✅ **Swipe Gestures** - Smooth scrolling and interactions  
✅ **Fast Loading** - Optimized for mobile networks  

## 🌐 Features Working

- **3D Background** - Interactive particles (reduced on mobile for performance)
- **File Upload** - Drag & drop works on mobile
- **Search & Filter** - Touch-friendly interface
- **PDF/Image Viewer** - Mobile-optimized modal
- **Responsive Grid** - Adapts to screen size
- **Smooth Animations** - Optimized for mobile performance

## 📊 Performance Tips

- **Mobile**: 3D effects are reduced for better performance
- **Tablet**: Full 3D effects with smooth animations
- **Desktop**: Full features with all animations

## 🚀 Ready to Deploy?

The website is ready for Vercel deployment:
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`

---

**Your mobile-friendly Question Paper Repository is ready! 📱✨**
