type colorScheme = 'light' | 'dark' | 'auto';

class StackColorScheme {
    private localStorageKey = 'StackColorScheme';
    private currentScheme: colorScheme;
    private systemPreferScheme: colorScheme;

    constructor(toggleEl: HTMLElement) {
        this.bindMatchMedia();
        this.currentScheme = this.getSavedScheme();
        if (window.matchMedia('(prefers-color-scheme: dark)').matches === true)
            this.systemPreferScheme = 'dark'
        else
            this.systemPreferScheme = 'light';

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);

        if (toggleEl)
            this.bindClick(toggleEl);

        if (document.body.style.transition == '')
            document.body.style.setProperty('transition', 'background-color .3s ease');
    }

    private saveScheme() {
        localStorage.setItem(this.localStorageKey, this.currentScheme);
    }

    private bindClick(toggleEl: HTMLElement) {
        toggleEl.addEventListener('click', (e) => {
            // 获取点击坐标
            const x = (e as MouseEvent).clientX;
            const y = (e as MouseEvent).clientY;

            // 计算最大扩散半径（从点击点到最远角落的距离）
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            // 确定新主题
            const willBeDark = !this.isDark();

            // 主题切换函数
            const applyThemeChange = () => {
                if (this.isDark()) {
                    this.currentScheme = 'light';
                } else {
                    this.currentScheme = 'dark';
                }
                this.setBodyClass();

                if (this.currentScheme == this.systemPreferScheme) {
                    this.currentScheme = 'auto';
                }
                this.saveScheme();
            };

            // 检测 View Transitions API 支持
            if (!('startViewTransition' in document)) {
                // 不支持时直接切换，无动画
                applyThemeChange();
                return;
            }

            // 启动视图过渡
            const transition = (document as any).startViewTransition(() => {
                applyThemeChange();
            });

            // 在过渡准备好后执行圆形裁剪动画
            transition.ready.then(() => {
                // 根据切换方向决定动画是扩张还是收缩
                const clipPath = willBeDark
                    ? [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]
                    : [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

                // 在伪元素上执行动画
                document.documentElement.animate(
                    { clipPath },
                    {
                        duration: 500,
                        easing: 'ease-in-out',
                        fill: 'forwards',
                        pseudoElement: willBeDark
                            ? '::view-transition-old(root)'   // 深色模式：收缩旧视图
                            : '::view-transition-new(root)'   // 浅色模式：扩张新视图
                    }
                );
            });
        })
    }

    private isDark() {
        return (this.currentScheme == 'dark' || this.currentScheme == 'auto' && this.systemPreferScheme == 'dark');
    }

    private dispatchEvent(colorScheme: colorScheme) {
        const event = new CustomEvent('onColorSchemeChange', {
            detail: colorScheme
        });
        window.dispatchEvent(event);
    }

    private setBodyClass() {
        if (this.isDark()) {
            document.documentElement.dataset.scheme = 'dark';
        }
        else {
            document.documentElement.dataset.scheme = 'light';
        }

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);
    }

    private getSavedScheme(): colorScheme {
        const savedScheme = localStorage.getItem(this.localStorageKey);

        if (savedScheme == 'light' || savedScheme == 'dark' || savedScheme == 'auto') return savedScheme;
        else return 'auto';
    }

    private bindMatchMedia() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                this.systemPreferScheme = 'dark';
            }
            else {
                this.systemPreferScheme = 'light';
            }
            this.setBodyClass();
        });
    }
}

export default StackColorScheme;
