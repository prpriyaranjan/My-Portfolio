import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap } from 'gsap';

export class HoloScene {
  // Static counter to track active WebGL contexts
  static activeContexts = 0;
  static maxContexts = 8; // Conservative limit for most browsers

  constructor(isNavbar) {
    this.isNavbar = isNavbar;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = null;
    this.canvas = null;
    this.mount = null;
    this.textMesh = null;
    this.hudMesh = null;
    this.particles = null;
    this.textMaterial = null;
    this.hudMaterial = null;
    this.animationFrameId = null;
    this.lastScrollY = window.scrollY;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMounted = true;
    this.isInitialized = false;
    this.handleResize = null;
    this.handleMouseMove = null;
    this.handleMouseEnter = null;
    this.handleMouseLeave = null;
  }

  async init(mount, text) {
    try {
      console.log('HoloScene: Starting initialization...');
      if (!(mount instanceof HTMLDivElement)) {
        throw new Error('HoloScene mount must be a div element, not a canvas or other element');
      }
      this.mount = mount;

      if (!this.mount || !this.mount.isConnected) {
        throw new Error('Mount element is not attached to the DOM');
      }

      // Create a new canvas for WebGL rendering
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.canvas.width; // Reset canvas state
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.transformOrigin = 'center';
      this.canvas.style.zIndex = '10';
      this.mount.appendChild(this.canvas);

      // Check WebGL context availability
      console.log(`HoloScene: Current active WebGL contexts: ${HoloScene.activeContexts}`);
      if (HoloScene.activeContexts >= HoloScene.maxContexts) {
        console.warn('HoloScene: WebGL context limit reached, falling back to simpler rendering');
        this.isInitialized = false;
        return; // Component will handle fallback
      }

      const gl = this.canvas.getContext('webgl') || this.canvas.getContext('webgl2');
      if (!gl) {
        console.warn('HoloScene: WebGL not supported or failed to initialize, falling back');
        this.isInitialized = false;
        return; // Component will handle fallback
      }

      HoloScene.activeContexts++;
      console.log(`HoloScene: WebGL context created, total active contexts: ${HoloScene.activeContexts}`);

      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
      this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = this.isNavbar ? 3.5 : 5.5;

      // Add resize handler
      this.handleResize = () => {
        if (!this.isMounted || !this.mount || !this.renderer) return;
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
        this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
        this.camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', this.handleResize);
      this.handleResize(); // Initial resize

      // Load font with timeout (using a more reliable CDN)
      const fontLoader = new FontLoader();
      let font = null;
      try {
        font = await Promise.race([
          new Promise((resolve, reject) => {
            fontLoader.load(
              'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json',
              resolve,
              undefined,
              (error) => {
                console.error('Font Load Error:', error.message);
                reject(error);
              }
            );
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Font loading timeout')), 5000)),
        ]);
      } catch (error) {
        console.warn('HoloScene: Font loading failed, using fallback rendering:', error.message);
        // Fallback to a simple plane if font loading fails
        const fallbackGeometry = new THREE.PlaneGeometry(this.isNavbar ? 4 : 8, this.isNavbar ? 1 : 2);
        const fallbackMaterial = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
              float pulse = sin(time * 2.0) * 0.2 + 0.8;
              vec3 color = vec3(0.3, 0.933, 0.918) * pulse;
              gl_FragColor = vec4(color, 0.5);
            }
          `,
          transparent: true,
          uniforms: { time: { value: 0 } },
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
        this.scene.add(fallbackMesh);
        this.textMaterial = fallbackMaterial; // For animation
        this.isInitialized = true; // Still consider it initialized with fallback
      }

      if (font && this.isMounted) {
        const textGeometry = new TextGeometry(text, {
          font,
          size: this.isNavbar ? 0.5 : 1.0,
          depth: 0.2,
          curveSegments: 16,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelSegments: 5,
        });

        this.textMaterial = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vUv = uv;
              vNormal = normal;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            uniform vec3 glowColor;
            void main() {
              vec3 coreColor = vec3(0.3, 0.933, 0.918);
              vec3 haloColor = vec3(1.0, 0.0, 0.8);
              float interference = sin(vUv.y * 10.0 + time * 2.0) * 0.1 + 0.9;
              float glow = sin(time * 3.0 + vUv.x * 5.0) * 0.2 + 0.8;
              float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              vec3 color = mix(coreColor, haloColor, fresnel * 0.5);
              float glitch = fract(sin(dot(vUv.xy + time, vec2(12.9898, 78.233))) * 43758.5453) > 0.99 ? 0.8 : 1.0;
              gl_FragColor = vec4(color * interference * glow * glitch, 0.9);
            }
          `,
          transparent: true,
          uniforms: {
            time: { value: 0 },
            glowColor: { value: new THREE.Color(0x4deeea) },
          },
        });

        this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial);
        this.textMesh.position.set(this.isNavbar ? -2.0 : -5.0, 0, 0);
        this.scene.add(this.textMesh);
        this.isInitialized = true;
      }

      // Create HUD mesh
      const hudGeometry = new THREE.PlaneGeometry(this.isNavbar ? 6 : 12, this.isNavbar ? 2 : 4);
      this.hudMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float time;
          void main() {
            float grid = step(0.95, fract(vUv.x * 20.0)) + step(0.95, fract(vUv.y * 20.0));
            float scan = sin(vUv.y * 10.0 + time * 5.0) * 0.2 + 0.8;
            vec3 color = vec3(0.3, 0.933, 0.918);
            gl_FragColor = vec4(color * grid * scan, grid * 0.3);
          }
        `,
        transparent: true,
        uniforms: { time: { value: 0 } },
      });

      this.hudMesh = new THREE.Mesh(hudGeometry, this.hudMaterial);
      this.hudMesh.position.set(0, 0, -0.5);
      this.scene.add(this.hudMesh);

      // Add particles for navbar and sections
      const particleCount = this.isNavbar ? 15 : 5; // Fewer particles in sections
      this.particles = new THREE.Group();
      const fireColors = [0xff4500, 0xff8c00, 0xff6347, 0xffa500, 0xff4500, 0xff4040, 0xff6a00];
      const iceColors = [0x4deeea, 0x00b7eb, 0x00ced1, 0x40e0d0, 0x4deeea, 0x00b2ee, 0x48d1cc, 0x20b2aa];
      for (let i = 0; i < particleCount; i++) {
        const isFire = i < (this.isNavbar ? 7 : 3);
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshBasicMaterial({
          color: isFire ? fireColors[i % 7] : iceColors[i % 8],
          transparent: true,
          opacity: 0.8,
        });
        const particle = new THREE.Mesh(geometry, material);
        particle.userData = {
          isFire,
          baseRadius: Math.random() * (this.isNavbar ? 2 : 4) + 1,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.3 + 0.2,
          trail: [],
        };
        this.particles.add(particle);
      }
      this.scene.add(this.particles);

      // Event listeners
      this.handleMouseMove = (e) => {
        if (!this.isMounted) return;
        this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        if (this.textMesh) {
          this.textMesh.rotation.y = this.mouseX * 0.2;
          this.textMesh.rotation.x = this.mouseY * 0.1;
        }
      };
      document.addEventListener('mousemove', this.handleMouseMove);

      this.handleMouseEnter = () => {
        if (!this.isMounted) return;
        try {
          gsap.to(this.canvas, {
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 0.4,
            ease: 'power2.out',
          });
          if (this.textMaterial) {
            gsap.to(this.textMaterial.uniforms.glowColor, {
              value: new THREE.Color(0xff00cc),
              duration: 0.4,
            });
          }
        } catch (e) {
          console.error('Hover Enter Error:', e.message);
        }
      };

      this.handleMouseLeave = () => {
        if (!this.isMounted) return;
        try {
          gsap.to(this.canvas, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.4,
            ease: 'power2.out',
          });
          if (this.textMaterial) {
            gsap.to(this.textMaterial.uniforms.glowColor, {
              value: new THREE.Color(0x4deeea),
              duration: 0.4,
            });
          }
        } catch (e) {
          console.error('Hover Leave Error:', e.message);
        }
      };
      this.canvas.addEventListener('mouseenter', this.handleMouseEnter);
      this.canvas.addEventListener('mouseleave', this.handleMouseLeave);

      if (this.isInitialized) {
        console.log(`Premium HoloScene initialized for ${this.isNavbar ? 'navbar' : 'section'} with text: "${text}"`);
      } else {
        console.log(`HoloScene initialized with fallback for ${this.isNavbar ? 'navbar' : 'section'} with text: "${text}"`);
      }
    } catch (error) {
      console.error('HoloScene Initialization Error:', error.message);
      this.isInitialized = false;
    }
  }

  getIsInitialized() {
    return this.isInitialized;
  }

  getCanvas() {
    return this.canvas;
  }

  animate() {
    if (!this.isMounted) return;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    const time = Date.now() * 0.001;

    if (this.textMesh) {
      this.textMesh.rotation.y += 0.005;
      this.textMesh.rotation.x = Math.sin(time * 0.5) * 0.05;
    }
    if (this.textMaterial) {
      this.textMaterial.uniforms.time.value = time;
    }
    if (this.hudMaterial) {
      this.hudMaterial.uniforms.time.value = time;
    }

    if (this.particles) {
      this.particles.children.forEach((particle) => {
        const t = time * particle.userData.speed + particle.userData.phase;
        const radius = particle.userData.baseRadius + Math.sin(t * 0.5) * 0.2;
        particle.position.set(
          Math.cos(t) * radius,
          Math.sin(t) * radius * 0.5,
          Math.sin(t * 0.3) * 0.5
        );
        particle.scale.setScalar(Math.sin(t * 2) * 0.2 + 0.8);
        particle.material.opacity = Math.cos(t) * 0.3 + 0.7;

        const trailPos = particle.position.clone();
        particle.userData.trail.push(trailPos);
        if (particle.userData.trail.length > 5) particle.userData.trail.shift();
      });

      const scrollDelta = window.scrollY - this.lastScrollY;
      this.particles.children.forEach((particle) => {
        particle.position.y += scrollDelta * 0.001;
      });
      this.lastScrollY = window.scrollY;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize(width, height) {
    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  dispose() {
    this.isMounted = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Decrement WebGL context counter
    if (this.renderer) {
      HoloScene.activeContexts = Math.max(0, HoloScene.activeContexts - 1);
      console.log(`HoloScene: WebGL context disposed, total active contexts: ${HoloScene.activeContexts}`);
    }

    // Remove event listeners
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.handleMouseMove) {
      document.removeEventListener('mousemove', this.handleMouseMove);
    }
    if (this.canvas && this.handleMouseEnter) {
      this.canvas.removeEventListener('mouseenter', this.handleMouseEnter);
    }
    if (this.canvas && this.handleMouseLeave) {
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    // Dispose of Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }

    const disposeObject = (object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
      if (object.children) {
        object.children.forEach(disposeObject);
      }
    };

    if (this.scene) {
      this.scene.children.forEach((child) => {
        disposeObject(child);
        this.scene.remove(child);
      });
      this.scene = null;
    }

    // Remove canvas from DOM
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // Nullify references
    this.canvas = null;
    this.mount = null;
    this.camera = null;
    this.textMesh = null;
    this.hudMesh = null;
    this.particles = null;
    this.textMaterial = null;
    this.hudMaterial = null;
    this.handleResize = null;
    this.handleMouseMove = null;
    this.handleMouseEnter = null;
    this.handleMouseLeave = null;
    this.isInitialized = false;
  }
}

export async function initHoloScene(mount, text, isNavbar) {
  const holoScene = new HoloScene(isNavbar);
  try {
    await holoScene.init(mount, text);
    if (holoScene.getIsInitialized()) {
      holoScene.animate();
    }
    return { instance: holoScene, isInitialized: holoScene.getIsInitialized() };
  } catch (error) {
    console.error('HoloScene Initialization Error:', error.message);
    holoScene.dispose();
    throw error;
  }
}