let isTriggered = false;
let isHeartAssemblyStarted = false;

// 1. Scroll Trigger
window.onscroll = () => {
    // Триггер на скролл (1000 пикселей вниз)
    if (window.pageYOffset > 1000 && !isTriggered) {
        isTriggered = true;
        startShow();
    }
};

function startShow() {
    document.body.classList.add('system-glitch');
    
    setTimeout(() => {
        document.body.classList.remove('system-glitch');
        document.getElementById('document').style.display = 'none';
        document.getElementById('hack-interface').style.display = 'block';

        runLogs([
            "DETECTING_HOST: User_PC",
            "EXECUTING_OVERRIDE: .eliot_v7.sh",
            "BYPASSING_FIREWALL... OK",
            "ACCESSING_SECURE_STORAGE...",
            "WARNING: Identity verification required."
        ], () => {
            document.getElementById('auth-box').style.display = 'block';
            document.getElementById('pass-input').focus();
        });
    }, 1500);
}

function runLogs(lines, callback) {
    const logs = document.getElementById('logs');
    let i = 0;
    function print() {
        if (i < lines.length) {
            logs.innerHTML += `> ${lines[i]}<br>`;
            i++;
            setTimeout(print, 600);
        } else if (callback) callback();
    }
    print();
}

// 2. Password Check
document.getElementById('pass-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const val = this.value.toLowerCase().trim();
        // ВАЖНО: ЗАМЕНИ ИМЯ ТУТ
        const validNames = ["01012011"]; 
        if (validNames.includes(val)) { 
            this.style.display = 'none';
            gsap.to("#hack-interface", { opacity: 0, duration: 1, onComplete: unlockFinalScene });
        } else {
            this.value = "";
            this.placeholder = "INVALID KEY. ACCESS DENIED.";
        }
    }
});

// 3. ФИНАЛЬНАЯ НЕОНОВАЯ СЦЕНА
const canvas = document.getElementById('neon-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let flowers = [];
const PARTICLE_COUNT = 300; // Сотни шариков
const FLOWER_COUNT = 20; // Количество падающих неоновых цветов

function unlockFinalScene() {
    document.getElementById('hack-interface').style.display = 'none';
    document.getElementById('final-scene').style.display = 'block';
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Сразу создаем шарики и колышем их в центре (неоновый туман)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Начальная позиция — неоновое облако в центре
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 150; // Радиус колыхания
        particles.push({
            x: canvas.width / 2 + Math.cos(angle) * radius,
            y: canvas.height / 2 + Math.sin(angle) * radius,
            vx: Math.random() * 1 - 0.5, // Медленное колыхание
            vy: Math.random() * 1 - 0.5,
            heartX: 0, heartY: 0, // Целевые координаты для сердца
            r: Math.random() * 2.5 + 1, // Размер шарика
            // Розовый неон
            color: `rgba(255, 20, 147, ${Math.random() * 0.4 + 0.6})`, 
            glow: Math.random() * 20 + 10,
            isFormed: false
        });
    }

    // Обработчик клика по тексту
    document.getElementById('neon-text-container').addEventListener('click', onTextClick);
    
    requestAnimationFrame(drawNeonScene);
}

function onTextClick() {
    if (isHeartAssemblyStarted) return;
    isHeartAssemblyStarted = true;

    // 1. Текст вспыхивает и плавно УХОДИТ ВВЕРХ (как вы просили)
    gsap.to("#neon-title", { textShadow: "0 0 60px #fff, 0 0 100px #b3ff00", duration: 0.2, yoyo: true, repeat: 1 });
    gsap.to("#click-prompt", { opacity: 0, duration: 0.3 });
    gsap.to("#neon-text-container", { y: -canvas.height / 2 - 200, duration: 2.5, ease: "power2.in", onComplete: startHeartAssembly });

    // 2. Начинаем плавную сборку СЕРДЦА
    function startHeartAssembly() {
        // Расчет точек для формы сердца
        particles.forEach((p, i) => {
            let t = (i / particles.length) * Math.PI * 2;
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            p.heartX = x * 15 + canvas.width / 2;
            p.heartY = y * 15 + canvas.height / 2;

            // ПЛАВНАЯ сборка через GSAP (как вы просили)
            gsap.to(p, {
                x: p.heartX, y: p.heartY,
                duration: 4, // 4 секунды — это очень плавно и неспешно
                delay: i * 0.003, // Маленький delay, чтобы они вылетали по очереди
                ease: "power2.inOut",
                onComplete: () => {
                    p.isFormed = true;
                    if(i === particles.length - 1) showFinalMessage();
                }
            });
        });
        
        // Запускаем неоновые ЦВЕТЫ с неба
        startFlowers();
    }
}

// 4. Падающие Неоновые Цветы (как вы просили)
function startFlowers() {
    for (let i = 0; i < FLOWER_COUNT; i++) {
        flowers.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height, // С неба
            speed: Math.random() * 1.5 + 0.5, // Медленно
            size: Math.random() * 6 + 3,
            petalCount: 5,
            angle: Math.random() * Math.PI * 2,
            rotateSpeed: Math.random() * 0.02 - 0.01,
            // Неоновый розовый/белый цвет
            color: `rgba(255, 20, 147, ${Math.random() * 0.3 + 0.7})`,
            glow: Math.random() * 10 + 5
        });
    }
}

function drawNeonScene() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Эффект шлейфа
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем Падающие Цветы (только когда они есть)
    if (flowers.length > 0) {
        flowers.forEach(f => {
            f.y += f.speed; // Падение
            f.angle += f.rotateSpeed; // Вращение
            if(f.y > canvas.height) f.y = -10; // Вернуть наверх

            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(f.angle);
            ctx.shadowBlur = f.glow;
            ctx.shadowColor = f.color;
            ctx.fillStyle = f.color;
            
            // Рисуем цветок (частицы в форме лепестков)
            ctx.beginPath();
            for(let j=0; j < f.petalCount; j++) {
                let r = f.size + 4 * Math.cos(5 * (j/f.petalCount * Math.PI*2 - Math.PI/2));
                let px = r * Math.cos(j/f.petalCount * Math.PI*2);
                let py = r * Math.sin(j/f.petalCount * Math.PI*2);
                if(j==0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    }

    // Рисуем Шарики (туман/сердце)
    particles.forEach(p => {
        if(!p.isFormed && !isHeartAssemblyStarted) {
            // Колыхание тумана до сборки
            p.x += p.vx; p.y += p.vy;
            const centerDx = p.x - canvas.width / 2;
            const centerDy = p.y - canvas.height / 2;
            if (centerDx * centerDx + centerDy * centerDy > 160 * 160) {
                p.vx *= -1; p.vy *= -1; // Возвращаем в облако
            }
        }

        ctx.save();
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    requestAnimationFrame(drawNeonScene);
}

function showFinalMessage() {
    // Плавное появление финального текста поверх сердца
    const div = document.createElement('div');
    div.style.cssText = "position:absolute; top:50%; width:100%; text-align:center; color:white; font-family:'Courier New', monospace; font-size:25px; transform:translateY(-50%); text-shadow:0 0 15px #ff1493; opacity:0; z-index:2100; white-space:pre-wrap;";
    
    // ТВОЙ ТЕКСТ ТУТ
    const message = [
        " ",
        "Привет",
        "Короче, просто хотел сделать что-то ради тебя, что-то красивое и необычное, что могло бы вызвать улыбку и теплые чувства.",
        "Вместо тысячи слов это создал фантазии на слова уже не хватило.",
        " ",
        "Надеюсь, тебе понравилось😉",
        "[ ❤️ ]"
    ];
    div.innerText = message.join("\n");
    document.getElementById('final-scene').appendChild(div);
    
    // Плавный фейд-ин текста
    gsap.to(div, { opacity: 1, duration: 2, delay: 1 });
    
    // Эффект пульсации сердца
    particles.forEach(p => {
        gsap.to(p, {
            r: p.r * 1.5,
            glow: 40,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}