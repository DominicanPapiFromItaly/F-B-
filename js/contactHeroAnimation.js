const canvas2 = document.getElementById('contact-hero-canvas');
const ctx2 = canvas2.getContext('2d');

let w = canvas2.width = window.innerWidth;
let h = canvas2.height = 260;

window.addEventListener('resize', () => {
    w = canvas2.width = window.innerWidth;
    h = canvas2.height = 260;
});

class Dot {
    constructor() { this.reset(); }

    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = 1 + Math.random() * 2;
        this.alpha = 0.15 + Math.random() * 0.25;
        this.speed = 0.2 + Math.random() * 0.4;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -10) this.reset();
    }

    draw() {
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(0,150,255,${this.alpha})`;
        ctx2.fill();
    }
}

const dots = Array.from({ length: 120 }, () => new Dot());

function animateContact() {
    ctx2.fillStyle = 'rgba(2,16,31,0.25)';
    ctx2.fillRect(0, 0, w, h);

    dots.forEach(d => { d.update(); d.draw(); });

    requestAnimationFrame(animateContact);
}

animateContact();