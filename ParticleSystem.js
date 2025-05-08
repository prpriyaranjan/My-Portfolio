import * as THREE from 'three';

export class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.particleCount = options.particleCount || 500;
    this.gravityStrength = options.gravityStrength || 0.05;
    this.interactionRadius = options.interactionRadius || 50;
    this.animationFrameId = null;
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.resizeHandler = this.handleResize.bind(this);
    this.init();
  }

  init() {
    try {
      if (!this.canvas) {
        console.error('ParticleSystem: Canvas not provided');
        return;
      }
      if (!THREE.WebGLRenderer || !this.canvas.getContext('webgl')) {
        console.error('ParticleSystem: WebGL not supported in this browser');
        return;
      }

      const checkCanvasSize = () => {
        if (this.canvas.clientWidth === 0 || this.canvas.clientHeight === 0) {
          console.warn('ParticleSystem: Waiting for valid canvas dimensions');
          setTimeout(checkCanvasSize, 100);
          return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.particles = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.02, 8, 8);
        const colors = [0x4deeea, 0xff00cc, 0xffd700];
        for (let i = 0; i < this.particleCount; i++) {
          const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.7,
          });
          const particle = new THREE.Mesh(geometry, material);
          particle.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          );
          particle.userData = {
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1
            ),
          };
          this.particles.add(particle);
        }
        this.scene.add(this.particles);

        this.camera.position.z = 10;

        this.mouse = new THREE.Vector2();
        document.addEventListener('mousemove', this.mouseMoveHandler);

        window.addEventListener('resize', this.resizeHandler);

        this.animate();

        console.log('ParticleSystem initialized with premium cosmic enhancements');
      };

      checkCanvasSize();
    } catch (e) {
      console.error('ParticleSystem Initialization Error:', e.message, e.stack);
    }
  }

  handleMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    try {
      this.particles.children.forEach((particle, index) => {
        if (index % 2 === 0) {
          const toCenter = new THREE.Vector3().sub(particle.position).normalize();
          particle.userData.velocity.add(toCenter.multiplyScalar(-this.gravityStrength * 0.01));

          const mouseWorld = new THREE.Vector3(this.mouse.x * 10, this.mouse.y * 10, 0);
          const distance = particle.position.distanceTo(mouseWorld);
          if (distance < this.interactionRadius / 10) {
            const repel = particle.position.clone().sub(mouseWorld).normalize();
            particle.userData.velocity.add(repel.multiplyScalar(0.08));
          }

          particle.position.add(particle.userData.velocity);
          particle.userData.velocity.multiplyScalar(0.98);

          if (particle.position.length() > 20) {
            particle.position.normalize().multiplyScalar(20);
            particle.userData.velocity.multiplyScalar(-0.5);
          }

          particle.material.opacity = Math.sin(Date.now() * 0.001 + particle.position.x * 0.5) * 0.3 + 0.7;
        }
      });

      this.particles.rotation.y += 0.001;

      this.renderer.render(this.scene, this.camera);
    } catch (e) {
      console.error('ParticleSystem Animation Error:', e.message, e.stack);
    }
  }

  handleResize() {
    try {
      if (!this.canvas || !this.renderer) return;
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    } catch (e) {
      console.error('ParticleSystem Resize Error:', e.message, e.stack);
    }
  }

  destroy() {
    try {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('resize', this.resizeHandler);

      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (this.renderer) {
        this.renderer.dispose();
      }

      console.log('ParticleSystem destroyed');
    } catch (e) {
      console.error('ParticleSystem Destroy Error:', e.message, e.stack);
    }
  }
}