
const canvas = document.getElementById('why-hero-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = 380; // altezza fissa hero

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = 380;
});

// Punto di convergenza (a destra)
const coreX = width * 0.82;
const coreY = height * 0.50;

class Particle {
    constructor() { this.reset(); }

    reset() {
        this.startX = 0;
        this.startY = Math.random() * height;
        this.x = this.startX;
        this.y = this.startY;

        this.ctrlX = width * 0.35;
        this.ctrlY = this.startY + (coreY - this.startY) * 0.25;

        this.progress = Math.random();
        this.speed = 0.002 + Math.random() * 0.003;
        this.size = 1 + Math.random() * 2;
        this.alpha = Math.random() * 0.4 + 0.3;
    }

    update() {
        this.progress += this.speed;
        if (this.progress > 1) this.reset();

        const t = this.progress;
        this.x = (1 - t) ** 2 * this.startX + 2 * (1 - t) * t * this.ctrlX + t ** 2 * coreX;
        this.y = (1 - t) ** 2 * this.startY + 2 * (1 - t) * t * this.ctrlY + t ** 2 * coreY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 140, 255, ${this.alpha})`;
        ctx.fill();
    }
}

const particles = Array.from({ length: 220 }, () => new Particle());

function animate() {
    ctx.fillStyle = 'rgba(3, 9, 20, 0.08)';
    ctx.fillRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(coreX, coreY, 10, coreX, coreY, 200);
    gradient.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
    gradient.addColorStop(0.5, 'rgba(0, 98, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 200, 0, Math.PI * 2);
    ctx.fill();

    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(animate);
}

animate();

const container = document.getElementById('rotor-3d');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// LUCI PREMIUM
const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
light1.position.set(3, 3, 5);
scene.add(light1);

const light2 = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light2);

// CARICA MODELLO
const loader = new THREE.GLTFLoader();
let rotor;

loader.load("assets/plus/turbine.glb", (gltf) => {
    rotor = gltf.scene;
    rotor.scale.set(1.2, 1.2, 1.2);
    rotor.position.set(0, 0, 0);
    rotor.rotation.x = 0.3;
    rotor.rotation.y = 0.3;
    scene.add(rotor);
});

// ANIMAZIONE
function animate3D() {
    requestAnimationFrame(animate3D);

    if (rotor) {
        rotor.rotation.y += 0.01; // rotazione premium
    }

    renderer.render(scene, camera);
}

animate3D();

// RESPONSIVE
window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
});

