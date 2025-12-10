/**
 * 头像颜色提取器
 * 自动从头像图片提取主色调并应用到光晕效果
 */

(function () {
    'use strict';

    // 从图片提取主要颜色
    function extractColorsFromImage(imgElement, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置canvas尺寸（缩小以提升性能）
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        // 绘制图片
        ctx.drawImage(imgElement, 0, 0, size, size);

        try {
            const imageData = ctx.getImageData(0, 0, size, size);
            const pixels = imageData.data;

            // 收集所有颜色
            const colorMap = {};

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3];

                // 跳过透明像素和过于接近白色/黑色的像素
                if (a < 50) continue;
                if (r > 240 && g > 240 && b > 240) continue;
                if (r < 15 && g < 15 && b < 15) continue;

                // 将颜色量化（减少相似颜色）
                const key = `${Math.floor(r / 10) * 10},${Math.floor(g / 10) * 10},${Math.floor(b / 10) * 10}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }

            // 找出出现最多的颜色
            const sortedColors = Object.entries(colorMap)
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            if (sortedColors.length >= 3) {
                // 提取前3种主色
                const colors = sortedColors.slice(0, 3).map(color => {
                    const rgb = color.split(',').map(Number);
                    return { r: rgb[0], g: rgb[1], b: rgb[2] };
                });

                callback(colors);
            } else {
                console.warn('无法提取足够的颜色，使用默认配色');
                callback(null);
            }

        } catch (e) {
            console.error('颜色提取失败:', e);
            callback(null);
        }
    }

    // 应用颜色到CSS变量
    function applyColors(colors) {
        if (!colors || colors.length < 3) {
            console.log('使用默认光晕颜色');
            return;
        }

        const root = document.documentElement;

        // 设置CSS变量
        root.style.setProperty('--avatar-halo-color1', `${colors[0].r}, ${colors[0].g}, ${colors[0].b}`);
        root.style.setProperty('--avatar-halo-color2', `${colors[1].r}, ${colors[1].g}, ${colors[1].b}`);
        root.style.setProperty('--avatar-halo-color3', `${colors[2].r}, ${colors[2].g}, ${colors[2].b}`);

        console.log('✨ 头像光晕颜色已自动配置:');
        console.log(`  主色: rgb(${colors[0].r}, ${colors[0].g}, ${colors[0].b})`);
        console.log(`  过渡色: rgb(${colors[1].r}, ${colors[1].g}, ${colors[1].b})`);
        console.log(`  辅助色: rgb(${colors[2].r}, ${colors[2].g}, ${colors[2].b})`);
    }

    // 初始化
    function init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', extractAndApply);
        } else {
            extractAndApply();
        }
    }

    function extractAndApply() {
        // 查找头像元素
        const avatar = document.querySelector('.sidebar .site-avatar img, .sidebar .site-avatar .site-logo');

        if (!avatar) {
            console.warn('未找到头像元素');
            return;
        }

        // 确保图片已加载
        if (avatar.complete) {
            extractColorsFromImage(avatar, applyColors);
        } else {
            avatar.addEventListener('load', function () {
                extractColorsFromImage(avatar, applyColors);
            });

            avatar.addEventListener('error', function () {
                console.error('头像加载失败');
            });
        }
    }

    // 启动
    init();

})();
