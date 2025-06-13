// JavaScript pour tutorial MCP GitHub - Version améliorée

document.addEventListener('DOMContentLoaded', function () {
    // Ajouter des boutons de copie aux blocs de code
    addCopyButtons();

    // Navigation fluide
    setupSmoothScrolling();

    // Animations au scroll
    setupScrollAnimations();

    // Navigation latérale
    createSideNavigation();

    // Highlighting du code
    highlightActiveSection();

    // Améliorations mobiles
    setupMobileEnhancements();

    // Animation des statistiques
    animateStats();

    // Ajout des styles dynamiques
    addDynamicStyles();

    // Indicateur de progression de lecture
    setupReadingProgress();

    // Bouton retour en haut
    setupBackToTop();
});

function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-block, .terminal');

    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copier';
        button.onclick = () => copyToClipboard(block, button);

        block.style.position = 'relative';
        block.appendChild(button);
    });
}

function copyToClipboard(block, button) {
    const text = block.textContent.replace(button.textContent, '').trim();
    const textWithoutPrompt = text.replace(/^\$\s/, ''); // Enlever le prompt terminal

    navigator.clipboard.writeText(textWithoutPrompt).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copié !';
        button.classList.add('copied');

        // Haptic feedback sur mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        button.textContent = 'Erreur';
        setTimeout(() => {
            button.textContent = 'Copier';
        }, 2000);
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Ajustement pour mobile
                const offset = window.innerWidth <= 768 ? 20 : 80;
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.section, .feature-card, .stat-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

function createSideNavigation() {
    if (window.innerWidth <= 1024) return; // Pas de nav latérale sur mobile/tablette

    const nav = document.createElement('div');
    nav.className = 'section-nav';
    nav.innerHTML = /*html*/`
        <h4 style="margin-bottom: 15px; color: #2c3e50; font-size: 1.1em;">📍 Navigation</h4>
        <ul>
            <li><a href="#introduction">🤖 Introduction</a></li>
            <li><a href="#prerequisites">📋 Prérequis</a></li>
            <li><a href="#setup">⚙️ Configuration</a></li>
            <li><a href="#github-token">🔑 Token GitHub</a></li>
            <li><a href="#implementation">🛠️ Implémentation</a></li>
            <li><a href="#scripts">📜 Scripts VS Code</a></li>
            <li><a href="#usage">🎯 Utilisation</a></li>
            <li><a href="#troubleshooting">🔧 Dépannage</a></li>
        </ul>
    `;

    document.body.appendChild(nav);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.section-nav a, .toc a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Enlever la classe active de tous les liens
                navLinks.forEach(link => link.classList.remove('active'));

                // Ajouter la classe active au lien correspondant
                const activeLinks = document.querySelectorAll(`a[href="#${entry.target.id}"]`);
                activeLinks.forEach(link => link.classList.add('active'));
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function setupMobileEnhancements() {
    // Améliorer les interactions tactiles
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');

        // Améliorer le scroll sur mobile
        document.addEventListener('touchstart', function () { }, { passive: true });

        // Réduire les animations sur mobile pour les performances
        if (window.innerWidth <= 768) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.3s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Gérer le changement d'orientation
    window.addEventListener('orientationchange', function () {
        setTimeout(() => {
            // Recalculer les positions après changement d'orientation
            window.scrollTo(window.scrollX, window.scrollY);
        }, 100);
    });
}

function animateStats() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateNumber(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });
}

function animateNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/\d/g, '');

    if (isNaN(number)) return;

    let current = 0;
    const increment = number / 30; // Animation sur 30 frames
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 50);
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toc a.active,
        .section-nav a.active {
            background: #3498db !important;
            color: white !important;
            font-weight: bold;
            transform: translateX(5px);
            box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
        }
        
        .copy-button {
            position: absolute;
            top: 10px;
            right: 50px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.8;
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }
        
        .copy-button:hover {
            opacity: 1;
            background: #45a049;
            transform: scale(1.05) translateY(-1px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }
        
        .copied {
            background: #2196F3 !important;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4) !important;
        }
        
        /* Améliorations pour les appareils tactiles */
        .touch-device .copy-button {
            padding: 10px 15px;
            font-size: 14px;
        }
        
        .touch-device .feature-card:active {
            transform: scale(0.98);
        }
        
        .touch-device .button:active {
            transform: scale(0.95);
        }
        
        /* Animation de pulsation pour les éléments importants */
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
            100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
        }
        
        .button:focus {
            animation: pulse 2s infinite;
        }
        
        /* Amélioration du contraste pour l'accessibilité */
        @media (prefers-contrast: high) {
            .feature-card, .stat-card {
                border: 2px solid #333;
            }
            
            .button {
                border: 2px solid #fff;
            }
        }
        
        /* Mode sombre automatique */
        @media (prefers-color-scheme: dark) {
            .section-nav {
                background: #2c3e50;
                color: white;
                border: 1px solid #34495e;
            }
            
            .section-nav a {
                color: #3498db;
            }
            
            .section-nav a:hover {
                background: #34495e;
            }
        }
        
        /* Optimisations pour les écrans haute résolution */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .copy-button, .button {
                border: 0.5px solid rgba(255, 255, 255, 0.1);
            }
        }
    `;
    document.head.appendChild(style);
}

function setupReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

function setupBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
