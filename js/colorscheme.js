// colorscheme.js
let switchHandle = document.querySelector('#switch-color-scheme');
let themeIcon = document.querySelector('#theme-icon');
var html = document.documentElement;

const switchMode = () => {
    let attr = html.getAttribute('color-mode');
    let colorMode = 'light';
    if (attr === 'light') {
        html.setAttribute('color-mode', 'dark');
        themeIcon.classList = 'iconfont icon-sun';
        colorMode = 'dark';
    } else {
        html.setAttribute('color-mode', 'light');
        themeIcon.classList = 'iconfont icon-moon';
        colorMode = 'light';
    }
    localStorage.setItem('color-mode', colorMode);
}

switchHandle.addEventListener('click', switchMode, false);

// 检测系统颜色模式
const detectSystemColorMode = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('color-mode', 'dark');
        themeIcon.classList = 'iconfont icon-sun';
        localStorage.setItem('color-mode', 'dark');
    } else {
        html.setAttribute('color-mode', 'light');
        themeIcon.classList = 'iconfont icon-moon';
        localStorage.setItem('color-mode', 'light');
    }
}

// 初始化颜色模式
const initColorMode = () => {
    const currColorMode = localStorage.getItem('color-mode');
    if (currColorMode) {
        if (currColorMode === 'light') {
            html.setAttribute('color-mode', 'light');
            themeIcon.classList = 'iconfont icon-moon';
        } else {
            html.setAttribute('color-mode', 'dark');
            themeIcon.classList = 'iconfont icon-sun';
        }
    } else {
        detectSystemColorMode();
    }
}

// 监听系统颜色模式变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        html.setAttribute('color-mode', 'dark');
        themeIcon.classList = 'iconfont icon-sun';
        localStorage.setItem('color-mode', 'dark');
    } else {
        html.setAttribute('color-mode', 'light');
        themeIcon.classList = 'iconfont icon-moon';
        localStorage.setItem('color-mode', 'light');
    }
});

initColorMode();
