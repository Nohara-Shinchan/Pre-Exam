// Main Application Logic
class QuestionPaperApp {
    constructor() {
        this.papers = [];
        this.currentPaper = null;
        this.searchTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadPapers();
        this.setupNavigation();
        this.setupUpload();
        this.setupSearch();
        this.setupModal();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNavLink(link);
            });
        });
        
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    setupNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    updateActiveNavLink() {
        const sections = ['home', 'browse', 'upload', 'about'];
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (navLink) {
                        this.setActiveNavLink(navLink);
                    }
                }
            }
        });
    }
    
    setupUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadForm = document.getElementById('upload-form');
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
            if (window.animationController) {
                window.animationController.animateUploadArea(uploadArea, true);
            }
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (window.animationController) {
                window.animationController.animateUploadArea(uploadArea, false);
            }
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (window.animationController) {
                window.animationController.animateUploadArea(uploadArea, false);
            }
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleFileSelect(files[0]);
            }
        });
        
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
        
        // Form submission
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpload();
        });
    }
    
    handleFileSelect(file) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        
        if (!allowedTypes.includes(file.type)) {
            this.showError('Please select a PDF or image file.');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showError('File size must be less than 10MB.');
            return;
        }
        
        // Update upload area to show selected file
        const uploadContent = uploadArea.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <i class="fas fa-file-check"></i>
            <h3>File Selected: ${file.name}</h3>
            <p>Ready to upload</p>
        `;
        
        // Pre-fill form with file info
        const titleInput = document.getElementById('paper-title');
        if (!titleInput.value) {
            titleInput.value = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        }
    }
    
    async handleUpload() {
        const formData = new FormData();
        const fileInput = document.getElementById('file-input');
        const form = document.getElementById('upload-form');
        
        if (!fileInput.files[0]) {
            this.showError('Please select a file to upload.');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        submitBtn.disabled = true;
        
        try {
            formData.append('questionPaper', fileInput.files[0]);
            formData.append('title', document.getElementById('paper-title').value);
            formData.append('subject', document.getElementById('paper-subject').value);
            formData.append('year', document.getElementById('paper-year').value);
            formData.append('semester', document.getElementById('paper-semester').value);
            formData.append('university', document.getElementById('paper-university').value);
            
            const baseUrl = window.location.port === '5500' ? 'http://localhost:3001' : '';
            const response = await fetch(`${baseUrl}/api/upload`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Question paper uploaded successfully!');
                form.reset();
                this.resetUploadArea();
                this.loadPapers(); // Reload papers
                this.scrollToSection('browse');
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            this.showError('Upload failed: ' + error.message);
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    resetUploadArea() {
        const uploadArea = document.getElementById('upload-area');
        const uploadContent = uploadArea.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h3>Drag & Drop Your Question Paper</h3>
            <p>or <span class="upload-link">browse files</span></p>
            <div class="upload-formats">
                <span class="format-tag">PDF</span>
                <span class="format-tag">JPG</span>
                <span class="format-tag">PNG</span>
            </div>
        `;
    }
    
    setupSearch() {
        // AI Chat handles search functionality now
        // This method is kept for compatibility but functionality moved to AI chat
        console.log('Search functionality now handled by AI Chat');
    }
    
    async performSearch() {
        // AI Chat now handles search functionality
        // This method is kept for compatibility
        console.log('Search functionality now handled by AI Chat');
    }
    
    async loadPapers() {
        const loadingElement = document.getElementById('loading-papers');
        const papersGrid = document.getElementById('papers-grid');
        
        loadingElement.style.display = 'block';
        papersGrid.innerHTML = '';
        
        try {
            // Check if we're running on the Node.js server or Live Server
            const baseUrl = window.location.port === '5500' ? 'http://localhost:3001' : '';
            const response = await fetch(`${baseUrl}/api/papers`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }
            
            this.papers = await response.json();
            this.displayPapers(this.papers);
            this.updateStats();
        } catch (error) {
            console.error('Error loading papers:', error);
            this.showError('Failed to load question papers. Make sure the server is running on port 3001.');
        } finally {
            loadingElement.style.display = 'none';
        }
    }
    
    displayPapers(papers) {
        const papersGrid = document.getElementById('papers-grid');
        const noPapersElement = document.getElementById('no-papers');
        
        if (papers.length === 0) {
            papersGrid.innerHTML = '';
            noPapersElement.style.display = 'block';
            return;
        }
        
        noPapersElement.style.display = 'none';
        papersGrid.innerHTML = '';
        
        papers.forEach((paper, index) => {
            const paperCard = this.createPaperCard(paper);
            papersGrid.appendChild(paperCard);
            
            // Animate in with delay
            if (window.animationController) {
                setTimeout(() => {
                    window.animationController.animateIn(paperCard, index * 0.1);
                }, 100);
            }
        });
    }
    
    createPaperCard(paper) {
        const card = document.createElement('div');
        card.className = 'paper-card hover-lift';
        
        const fileType = paper.fileType.includes('pdf') ? 'PDF' : 'Image';
        const fileSize = this.formatFileSize(paper.fileSize);
        const uploadDate = new Date(paper.uploadDate).toLocaleDateString();
        
        card.innerHTML = `
            <div class="paper-header">
                <span class="paper-type ${fileType.toLowerCase()}">${fileType}</span>
            </div>
            <h3 class="paper-title">${paper.title}</h3>
            <div class="paper-meta">
                <div class="meta-item">
                    <i class="fas fa-book"></i>
                    <span>${paper.subject}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${paper.year}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-university"></i>
                    <span>${paper.university || 'N/A'}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-download"></i>
                    <span>${paper.downloadCount}</span>
                </div>
            </div>
            <div class="paper-actions">
                <button class="btn btn-small btn-view" onclick="app.viewPaper('${paper.id}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="btn btn-small btn-download" onclick="app.downloadPaper('${paper.id}')">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            </div>
        `;
        
        return card;
    }
    
    setupModal() {
        const modal = document.getElementById('viewer-modal');
        const closeBtn = modal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    async viewPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        this.currentPaper = paper;
        const modal = document.getElementById('viewer-modal');
        const modalTitle = document.getElementById('modal-title');
        const pdfViewer = document.getElementById('pdf-viewer');
        const imageViewer = document.getElementById('image-viewer');
        const viewerImage = document.getElementById('viewer-image');
        
        modalTitle.textContent = paper.title;
        
        if (paper.fileType.includes('pdf')) {
            pdfViewer.style.display = 'flex';
            imageViewer.style.display = 'none';
            this.loadPDFViewer(paper);
        } else {
            pdfViewer.style.display = 'none';
            imageViewer.style.display = 'flex';
            viewerImage.src = `/uploads/${paper.filename}`;
            viewerImage.alt = paper.title;
        }
        
        if (window.animationController) {
            window.animationController.showModal(modal);
        } else {
            modal.style.display = 'block';
        }
    }
    
    loadPDFViewer(paper) {
        const pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Note: For production, you'd want to use PDF.js properly
        // This is a simplified version
        const iframe = document.createElement('iframe');
        iframe.src = `/uploads/${paper.filename}`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        pdfViewer.innerHTML = '';
        pdfViewer.appendChild(iframe);
    }
    
    async downloadPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        try {
            // Increment download count
            const baseUrl = window.location.port === '5500' ? 'http://localhost:3001' : '';
            await fetch(`${baseUrl}/api/download/${paperId}`, { method: 'POST' });
            
            // Create download link
            const link = document.createElement('a');
            link.href = `/uploads/${paper.filename}`;
            link.download = paper.originalName;
            link.click();
            
            // Update local count
            paper.downloadCount++;
            this.loadPapers(); // Refresh display
            
            this.showSuccess('Download started!');
        } catch (error) {
            this.showError('Download failed: ' + error.message);
        }
    }
    
    closeModal() {
        const modal = document.getElementById('viewer-modal');
        
        if (window.animationController) {
            window.animationController.hideModal(modal);
        } else {
            modal.style.display = 'none';
        }
        
        this.currentPaper = null;
    }
    
    updateStats() {
        const totalPapers = this.papers.length;
        const totalDownloads = this.papers.reduce((sum, paper) => sum + paper.downloadCount, 0);
        const uniqueUniversities = new Set(this.papers.map(paper => paper.university)).size;
        
        // Animate counters
        this.animateCounter('.stat-number[data-target="0"]', totalPapers);
        this.animateCounter('.stat-number[data-target="0"]', totalDownloads);
        this.animateCounter('.stat-number[data-target="0"]', uniqueUniversities);
    }
    
    animateCounter(selector, targetValue) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const targets = [totalPapers, totalDownloads, uniqueUniversities];
            if (targets[index] !== undefined) {
                gsap.to(element, {
                    innerHTML: targets[index],
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        element.innerHTML = Math.ceil(element.innerHTML);
                    }
                });
            }
        });
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    showSuccess(message) {
        if (window.Swal) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: message,
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: message,
                timer: 5000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } else {
            alert(message);
        }
    }
}

// Global functions for HTML onclick handlers
function scrollToSection(sectionId) {
    if (window.app) {
        window.app.scrollToSection(sectionId);
    }
}

function downloadPaper(paperId) {
    if (window.app) {
        window.app.downloadPaper(paperId);
    }
}

function closeModal() {
    if (window.app) {
        window.app.closeModal();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuestionPaperApp();
});
