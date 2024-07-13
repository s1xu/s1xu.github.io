// 获取页面元素
let catalog = document.getElementById("catalog");
let tocElement = document.getElementsByClassName("catalog-content")[0];
const headerHigh = document.querySelector('.header');

// 动态获取catalog的初始顶部位置
let catalogTopHeight = catalog.offsetTop;

// 更新catalog位置的函数
function changePos() {
  // 动态获取当前滚动位置和header的高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let headerHeight = headerHigh.offsetHeight;

  // 判断是否需要固定catalog
  if (scrollTop > catalogTopHeight - 20) {
    catalog.style = "position: fixed; top: 20px; bottom: 20px;";
  } else {
    catalog.style = `position: absolute; top: ${headerHeight + 88 + 30}px`; // 290px, 88px, 和 30px为额外的距离
  }
}

// 添加滚动事件监听
window.addEventListener('scroll', changePos);


// 是否激活目录
function isActiveCat() {
  // 可宽限高度值
  let offsetHeight = 20

  // 当前页面滚动位置距页面顶部的高度值
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

  // 页面所有标题列表
  let headerLinkList = document.getElementsByClassName("headerlink")

  if (!headerLinkList.length) return

  // 页面所有目录列表
  let catLinkList = document.getElementsByClassName("toc-link")

  for(let i = 0; i < catLinkList.length; i++) {
    let currentTopCat = headerLinkList[i].offsetTop - offsetHeight
    let nextTopCat = i + 1 === headerLinkList.length ?
        Infinity : headerLinkList[i+1].offsetTop - offsetHeight

    if (scrollTop >= currentTopCat && scrollTop < nextTopCat) {
      // 目录跟随滚动
      catLinkList[i].className = "toc-link active"
      tocElement.scrollTop = catLinkList[i].offsetTop - 32
    } else {
      catLinkList[i].className = "toc-link"
    }
  }
}

// 窗体高度变化时
function handleResize() {
  // 获取视窗高度
  let windowHeight = document.documentElement.clientHeight;

  // 计算目录应有的最大高度
  let newHeight = windowHeight - 90;

  // 获取当前目录的高度
  let currentHeight = tocElement.style.height.replace('px', '');

  // 只有当新高度与当前高度不同时才更新
  if (currentHeight !== newHeight.toString()) {
    tocElement.style.height = `${newHeight}px`;
  }
}


// 小屏下（屏宽小于888px）是否展开目录
function openOrHiddenCatalog() {
  let isHidden = catalog.classList.contains('hidden')
  if (isHidden) {
    catalog.classList.remove('hidden')
  } else {
    catalog.classList.add('hidden')
  }
}

changePos();
isActiveCat();
handleResize();
document.addEventListener("scroll", changePos, false);
document.addEventListener("scroll", isActiveCat, false);
window.addEventListener("resize", handleResize, false);
document.querySelector("#btn-catalog").addEventListener("click", openOrHiddenCatalog, false);