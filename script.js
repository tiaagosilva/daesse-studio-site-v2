// script.js - Daesse Studio V2

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Three.js Background for Hero (Light Mode)
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        // Light fog to blend with the white background
        scene.fog = new THREE.FogExp2(0xffffff, 0.0015); 

        let width = container.clientWidth;
        let height = container.clientHeight;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 25;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0xffffff, 1);
        container.appendChild(renderer.domElement);

        // --- Nova Animação Exclusiva: Globo Abstrato de Precisão (Astrolábio) ---
        const group = new THREE.Group();
        
        // Criar 40 anéis finos girando em eixos diferentes
        for(let i=0; i<40; i++) {
            const radius = 12 + Math.random() * 4;
            const tube = 0.01 + Math.random() * 0.02;
            const geometry = new THREE.TorusGeometry(radius, tube, 8, 100);
            
            // Material sutil e premium usando a cor da marca (Azul Profundo)
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x1B6CA8, 
                transparent: true, 
                opacity: 0.05 + Math.random() * 0.08 
            });
            
            const ring = new THREE.Mesh(geometry, material);
            
            // Rotação inicial aleatória
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            ring.rotation.z = Math.random() * Math.PI;
            
            // Velocidade de rotação independente
            ring.userData = {
                rx: (Math.random() - 0.5) * 0.0015,
                ry: (Math.random() - 0.5) * 0.0015,
                rz: (Math.random() - 0.5) * 0.0015
            };
            
            group.add(ring);
        }
        
        scene.add(group);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        
        let targetX = 0, targetY = 0;
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;
            
            // Rotacionar cada anel independentemente
            group.children.forEach(ring => {
                ring.rotation.x += ring.userData.rx;
                ring.rotation.y += ring.userData.ry;
                ring.rotation.z += ring.userData.rz;
            });
            
            // Mover o grupo inteiro suavemente com o mouse
            group.rotation.y += (targetX - group.rotation.y) * 0.05;
            group.rotation.x += (targetY - group.rotation.x) * 0.05;
            
            // Rotação base bem lenta
            group.rotation.y += 0.0005;

            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            width = container.clientWidth;
            height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    };
    
    initThreeJS();

    // 3. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items (optional: if you want only one open at a time)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-content').style.height = '0px';
                const otherIcon = otherItem.querySelector('.faq-icon');
                otherIcon.style.transform = 'rotate(0deg)';
                otherIcon.classList.remove('text-black');
                otherIcon.classList.add('text-neutral-400');
            });
            
            // If it was not open, open it
            if (!isOpen) {
                item.classList.add('active');
                content.style.height = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
                icon.classList.remove('text-neutral-400');
                icon.classList.add('text-black');
            }
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Dispara quando o elemento entra 10% na tela
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        scrollObserver.observe(el);
    });

    // 5. Portfolio "Em Breve" Intercept
    const portfolioLinks = document.querySelectorAll('a[aria-label^="Ver detalhes do projeto"]');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Estudo de Caso completo em breve! Estamos finalizando a documentação deste projeto.');
        });
    });

});
