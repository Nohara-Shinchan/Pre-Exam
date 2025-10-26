# Deployment Guide

## Quick Start (Windows)

1. **Double-click `start.bat`** - This will automatically:
   - Install dependencies
   - Start the server
   - Show you the URL to open

2. **Open your browser** and go to: `http://localhost:3001`

## Manual Start

1. **Open Command Prompt or PowerShell** in the project folder
2. **Run these commands:**
   ```bash
   npm install
   node server.js
   ```
3. **Open your browser** and go to: `http://localhost:3001`

## Troubleshooting

### Port Already in Use Error
If you get "address already in use" error:
1. The server will automatically try port 3002, 3003, etc.
2. Or manually kill the process:
   ```bash
   netstat -ano | findstr :3001
   taskkill /PID <PID_NUMBER> /F
   ```

### File Upload Issues
- Make sure the `public/uploads` folder exists
- Check file permissions
- Ensure file size is under 10MB
- Only PDF, JPG, PNG files are allowed

### Browser Issues
- Clear browser cache
- Try incognito/private mode
- Check browser console for errors

## Production Deployment on Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set up Database:**
   - Go to Vercel Dashboard
   - Create Postgres database
   - Add `VERCEL_DATABASE_URL` to environment variables

## Features Working

✅ **3D Background** - Interactive Three.js particles  
✅ **File Upload** - Drag & drop PDF/images  
✅ **Search & Filter** - Real-time search  
✅ **PDF Viewer** - Modal-based viewer  
✅ **Responsive Design** - Mobile-friendly  
✅ **Animations** - GSAP smooth transitions  
✅ **Notifications** - SweetAlert2 alerts  

## Next Steps

1. **Test the website** - Upload some sample files
2. **Customize** - Modify colors, animations, or content
3. **Deploy** - Push to Vercel for public access
4. **Add Database** - Connect to Vercel Postgres for persistence

---

**Your Question Paper Repository is ready! 🎉**
