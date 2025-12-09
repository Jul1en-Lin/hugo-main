/* static/js/particles.js */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 创建粒子容器
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-container';
    document.body.appendChild(particleContainer);

    // 2. 配置粒子数量
    const particleCount = 18; // 屏幕上同时存在的粒子数量，建议 15-25 之间

    // 3. 生成粒子函数
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // 随机位置 (0% - 100% 宽/高)
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // 随机大小 (2px - 5px)
        const size = Math.random() * 3 + 7;
        
        // 随机动画时长 (10s - 25s) 越慢越优雅
        const duration = Math.random() * 15 + 10;
        
        // 随机延迟
        const delay = Math.random() * 5;

        // 应用样式
        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`; // 负延迟让动画直接开始中途

        particleContainer.appendChild(particle);
    }

    // 4. 初始化
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
});