document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    initScrollFix()
  }
}

function initScrollFix() {
  var oFix = document.querySelector('.scroll-fix')
  if (oFix) {
    var top = oFix.offsetTop,
        left = oFix.offsetLeft
    document.addEventListener('scroll', watch)
  }
  
  function watch() {
    if (document.documentElement.scrollTop >= top) {
      oFix.style.position = 'fixed'
      oFix.style.top = 0
      oFix.style.left = left
    } else {
      oFix.style.position = 'static'
    }
  }
}
