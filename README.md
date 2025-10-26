# Question Paper Repository Website

A beautiful, interactive website for storing and sharing question papers with advanced 3D animations and modern UI/UX.

## Features

- 🎨 **Beautiful 3D Background** - Interactive Three.js particles and floating shapes
- ✨ **Smooth Animations** - GSAP-powered animations and transitions
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔍 **Advanced Search** - Filter by subject, year, semester, and university
- 📄 **Multiple File Types** - Support for PDF and image files
- 🎯 **Modern UI** - Clean, intuitive interface with SweetAlert2 notifications
- ⚡ **Fast Performance** - Optimized for speed and smooth interactions

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **3D Graphics**: Three.js
- **Animations**: GSAP (GreenSock)
- **Notifications**: SweetAlert2
- **PDF Viewer**: PDF.js
- **Database**: Vercel Postgres (ready for deployment)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd question-paper-repository
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Set up Vercel Postgres Database**
   - Go to your Vercel dashboard
   - Create a new Postgres database
   - Copy the connection string
   - Add it to your environment variables as `VERCEL_DATABASE_URL`

## Project Structure

```
question-paper-repository/
├── public/
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   └── animations.css     # Animation styles
│   ├── js/
│   │   ├── main.js           # Main application logic
│   │   ├── animations.js     # GSAP animations
│   │   └── three-background.js # Three.js 3D background
│   ├── uploads/              # File upload directory
│   └── index.html            # Main HTML file
├── server.js                 # Express server
├── package.json              # Dependencies
├── vercel.json              # Vercel configuration
└── README.md                # This file
```

## API Endpoints

### GET /api/papers
Returns all question papers

### POST /api/upload
Upload a new question paper
- **Body**: FormData with file and metadata
- **Response**: Success status and paper data

### GET /api/search
Search question papers
- **Query Parameters**:
  - `query`: Search term
  - `subject`: Filter by subject
  - `year`: Filter by year
  - `semester`: Filter by semester

### POST /api/download/:id
Increment download count for a paper

## Features in Detail

### 3D Background
- Interactive particle system
- Floating geometric shapes
- Mouse and scroll interactions
- Smooth parallax effects

### File Upload
- Drag and drop interface
- File type validation (PDF, JPG, PNG)
- File size limits (10MB)
- Real-time progress feedback

### Search & Filter
- Real-time search with debouncing
- Multiple filter options
- Smooth animations
- Responsive design

### PDF/Image Viewer
- Modal-based viewer
- PDF.js integration
- Image zoom and pan
- Download functionality

## Customization

### Colors
Edit the CSS variables in `public/css/style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #f59e0b;
    --accent-color: #10b981;
    /* ... more variables */
}
```

### Animations
Modify GSAP animations in `public/js/animations.js`:
```javascript
// Example: Change animation duration
gsap.from(element, {
    y: 50,
    opacity: 0,
    duration: 0.8, // Change this value
    ease: "power2.out"
});
```

### 3D Effects
Customize Three.js background in `public/js/three-background.js`:
```javascript
// Example: Change particle count
const particleCount = 200; // Increase for more particles
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Optimization

- Lazy loading of images
- Debounced search
- Optimized animations
- Efficient file handling
- Responsive images

## Security Features

- File type validation
- File size limits
- CORS protection
- Input sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Ensure all dependencies are installed
3. Verify file permissions for uploads directory
4. Check Vercel deployment logs

## Future Enhancements

- [ ] User authentication system
- [ ] Advanced PDF annotation tools
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Advanced analytics
- [ ] AI-powered search
- [ ] Collaborative features

---

**Happy Learning! 🎓**
