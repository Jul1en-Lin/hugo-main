/* Fireworks Animation - Standalone Script */
(function () {
    const colors = ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#40c4ff', '#18ffff', '#64ffda', '#69f0ae', '#b2ff59', '#eeff41', '#ffff00', '#ffd740', '#ffab40', '#ff6e40'];

    function createParticle(x, y) {
        const particle = document.createElement('div');
        document.body.appendChild(particle);

        // Random size
        const size = Math.random() * 5 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.position = 'fixed'; // Use fixed to be independent of scroll
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none'; // Don't block clicks
        particle.style.zIndex = '9999';

        // Random destination
        // Spread more horizontally (-150 to 150) and vertically (-150 to 150)
        const destinationX = (Math.random() - 0.5) * 300;
        const destinationY = (Math.random() - 0.5) * 300;
        const rotation = Math.random() * 520;

        // Random duration for more natural feel
        const duration = 1000 + Math.random() * 500;
        const delay = Math.random() * 100;

        // Web Animations API
        // We try/catch in case browser support issues, though modern browsers support it
        if (particle.animate) {
            const animation = particle.animate([
                {
                    transform: `translate(-50%, -50%) translate(0, 0) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0, .9, .57, 1)', // Decelerate curve
                delay: delay
            });

            animation.onfinish = () => {
                particle.remove();
            };
        } else {
            // Fallback for very old browsers (cleanup immediately)
            particle.remove();
        }
    }

    function popFireworks(rect) {
        // Start from center of the rect
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Create 40-50 particles
        for (let i = 0; i < 40; i++) {
            createParticle(x, y);
        }
    }

    function initFireworks() {
        const welcomeCard = document.querySelector('.welcome');
        if (welcomeCard) {
            welcomeCard.addEventListener('mouseenter', () => {
                const rect = welcomeCard.getBoundingClientRect();

                // 延迟 500ms 触发，等待 emoji 摇晃蓄力完毕
                setTimeout(() => {
                    popFireworks(rect);
                }, 500);
            });
        }
    }

    // Init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFireworks);
    } else {
        initFireworks();
    }

    // 处理开场动画状态：加载后添加 class 触发动画，播放完后移除 class
    // 这样可以防止鼠标移出时（unhover）回退到“开场动画状态”导致再次播放
    window.addEventListener('load', () => {
        const welcome = document.querySelector('.welcome');
        if (welcome) {
            welcome.classList.add('animate-init');

            // 2.5秒后移除（动画时长0.5s + 最大延迟1.4s = ~2s，留点余量）
            setTimeout(() => {
                welcome.classList.remove('animate-init');
            }, 2500);
        }
    });

})();
