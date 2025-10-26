// Three.js Background Animation
class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.animationId = null;
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 500;
        
        // Renderer
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create particles
        this.createParticles();
        
        // Create floating shapes
        this.createFloatingShapes();
        
        // Create light
        this.createLighting();
    }
    
    createParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
            
            // Color
            color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.3);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    gl_FragColor = vec4(vColor, 0.8 - distance);
                }
            `,
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createFloatingShapes() {
        // Create floating geometric shapes
        const shapes = [];
        const shapeCount = 15;
        
        for (let i = 0; i < shapeCount; i++) {
            let geometry;
            const shapeType = Math.random();
            
            if (shapeType < 0.3) {
                geometry = new THREE.BoxGeometry(20, 20, 20);
            } else if (shapeType < 0.6) {
                geometry = new THREE.SphereGeometry(15, 8, 6);
            } else {
                geometry = new THREE.ConeGeometry(15, 30, 8);
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.3 + Math.random() * 0.3),
                transparent: true,
                opacity: 0.1 + Math.random() * 0.2
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 2000;
            mesh.position.y = (Math.random() - 0.5) * 2000;
            mesh.position.z = (Math.random() - 0.5) * 2000;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            // Store rotation speed
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.scene.add(mesh);
            shapes.push(mesh);
        }
        
        this.shapes = shapes;
    }
    
    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Point lights
        const pointLight1 = new THREE.PointLight(0x667eea, 0.5, 1000);
        pointLight1.position.set(200, 200, 200);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xf093fb, 0.5, 1000);
        pointLight2.position.set(-200, -200, 200);
        this.scene.add(pointLight2);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.material.uniforms.time.value = time;
        }
        
        // Animate floating shapes
        if (this.shapes) {
            this.shapes.forEach((shape, index) => {
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;
                
                // Floating motion
                shape.position.y += Math.sin(time * shape.userData.floatSpeed + index) * 0.5;
                shape.position.x += Math.cos(time * shape.userData.floatSpeed + index) * 0.3;
            });
        }
        
        // Mouse interaction
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    bindEvents() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) * 0.5;
            this.mouse.y = (event.clientY - this.windowHalf.y) * 0.5;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;
            
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Scroll interaction
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            if (this.particles) {
                this.particles.position.y = parallax;
            }
            
            if (this.shapes) {
                this.shapes.forEach((shape, index) => {
                    shape.position.z = (Math.random() - 0.5) * 2000 + parallax * 0.1;
                });
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.clear();
        }
    }
}

// Initialize Three.js background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure smooth loading
    setTimeout(() => {
        window.threeBackground = new ThreeBackground();
    }, 100);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.threeBackground) {
        window.threeBackground.destroy();
    }
});
