(function (doc){
  doc.onreadystatechange = function () {
    if (doc.readyState === 'complete') {
      initScrollFixed()
    }
  }
  
  function initScrollFixed() {
    var oFix = doc.querySelector('.scroll-fix')
    if (oFix) {
      var fixTop = oFix.offsetTop,
          fixLeft = oFix.offsetLeft,
          fixWidth = oFix.clientWidth

      var tocFn = tocLocate()
      tocFn.active(doc.documentElement.scrollTop)
      doc.addEventListener('scroll', function () {
        var top = doc.documentElement.scrollTop
        watchTop(top)
        tocFn.active(top)
      })
    }
    // watch scrolltop to fixed or not
    function watchTop(top) {
      if (top >= fixTop) {
        oFix.style.position = 'fixed'
        oFix.style.top = 0
        oFix.style.left = fixLeft
        oFix.style.width = fixWidth + 'px'
      } else {
        oFix.style.position = 'static'
      }
    }
    // locate toc item
    function tocLocate() {
      var toc = doc.querySelector('.toc'),
          voidFn = function () {}
      if (!toc || !toc.childNodes.length) {
        return {
          locate: voidFn,
          active: voidFn
        }
      }
      var titles = doc.querySelector('.post-content').querySelectorAll('h1, h2, h3, h4, h5, h6')
      toc.querySelector('a[href="#' + titles[0].id + '"]').parentNode.classList.add('active')

      var switchActive = function (prev, curr) {
        prev.classList.remove('active')
        curr.classList.add('active')
      }
      return {
        active: function (top) {
          for (let i = 0; i < titles.length; i++) {
            if (top > offset(titles[i]).y - 10) {
              switchActive(
                toc.querySelector('.active'),
                toc.querySelector('a[href="#' + titles[i].id + '"]').parentNode
              )
            }
          }
          if (top < offset(titles[0]).y) {
            switchActive(
              toc.querySelector('.active'),
              toc.querySelector('a[href="#' + titles[0].id + '"]').parentNode
            )
          }
        }
      }
    }
    // get top and left to document
    function offset(el) {
      var x = el.offsetLeft,
          y = el.offsetTop
      if (el.offsetParent) {
        var parentOffset = offset(el.offsetParent)
        x += parentOffset.x
        y += parentOffset.y
      }
      return {
        x: x,
        y: y
      }
    }
  }
})(document)
