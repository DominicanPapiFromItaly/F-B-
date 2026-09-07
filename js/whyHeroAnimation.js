/*******************************
 * PARTICELLE BLU
 *******************************/
const canvas = document.getElementById('why-hero-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = 380;

let coreX = width * 0.82;
let coreY = height * 0.50;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = 380;
    coreX = width * 0.82;
    coreY = height * 0.50;
});

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
        this.speed = 0.002 + Math.random() * 0.0035;
        this.size = 1 + Math.random() * 2.5;
        this.alpha = Math.random() * 0.5 + 0.3;

        const blueHue = Math.floor(200 + Math.random() * 40);
        this.color = `hsla(${blueHue}, 90%, 60%, `;
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
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
    }
}

class WhiteParticle extends Particle {
    reset() {
        super.reset();
        this.size = 1 + Math.random() * 2;
        this.alpha = Math.random() * 0.6 + 0.4;
        this.color = `rgba(255,255,255,`;
    }
}

const particles = Array.from({ length: 220 }, () => new Particle());
const whiteParticles = Array.from({ length: 80 }, () => new WhiteParticle());

function animate() {
    ctx.fillStyle = 'rgba(0, 10, 30, 0.10)';
    ctx.fillRect(0, 0, width, height);

    const pulse = Math.sin(Date.now() * 0.003) * 15;
    const gradient = ctx.createRadialGradient(coreX, coreY, 10, coreX, coreY, 200 + pulse);
    gradient.addColorStop(0, 'rgba(0, 120, 255, 0.35)');
    gradient.addColorStop(0.4, 'rgba(0, 80, 200, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 200 + pulse, 0, Math.PI * 2);
    ctx.fill();

    particles.forEach(p => { p.update(); p.draw(); });
    whiteParticles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(animate);
}

animate();


/*******************************
 * TURBINA 3D
 *******************************/
const container = document.getElementById('rotor-3d');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// LUCI
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.4));
scene.add(new THREE.DirectionalLight(0xffffff, 1.2));

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

// ANIMAZIONE 3D
function animate3D() {
    requestAnimationFrame(animate3D);
    if (rotor) rotor.rotation.y += 0.01;
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
