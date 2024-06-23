// catalog js
let catalog = document.getElementById("catalog");
let catalogTopHeight = catalog.offsetTop;
let tocElement = document.getElementsByClassName("catalog-content")[0]

// 是否固定目录
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) {
        cancelAnimationFrame(lastFunc);
      }
      lastFunc = requestAnimationFrame(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      });
    }
  }
}


// 在全局范围内缓存 DOM 查询
const headerHigh = document.querySelector('.header');
const postContent = document.querySelector('.post-content');

function changePos() {
  const headerHeight = headerHigh.offsetHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const postContentTop = postContent.offsetTop;

  if (scrollTop > postContentTop - 20) {
    catalog.style.cssText = "position: fixed; top: 50px; bottom: 20px;";
  } else {
    catalog.style.cssText = `position: absolute; top: calc(${headerHeight}px + 35px + 48px);`;
  }
}

// 使用节流函数监听滚动事件
window.addEventListener('scroll', throttle(changePos, 100));
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
// function handleResize() {
//   let windowHeight = document.documentElement.clientHeight
//   tocElement.setAttribute('style', `height: ${windowHeight - 90}px`);
// }

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
