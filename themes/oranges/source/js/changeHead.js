document.addEventListener("scroll", function() {
    var flexContainer = document.querySelector('.flex-container');
    var header = document.querySelector('.header');
    var distanceFromTop = flexContainer.getBoundingClientRect().top;

    if (distanceFromTop <= 20) { // 当距离顶部小于等于20px时
        header.classList.add('small'); // 添加新样式
        header.style.top = flexContainer.offsetTop + 'px'; // 设置header的顶部与flex-container对齐
    } else {
        header.classList.remove('small'); // 移除样式，恢复原状
        header.style.top = '0px'; // 保持在顶部
    }
});
