(function (doc, win){
  doc.onreadystatechange = function () {
    if (doc.readyState === 'complete') {
      var init = initScrollFixed()
      win.addEventListener('resize', function () {
        init.resetSrcollFixed()
        init.reinitSrcollFixed()
      })
      init.scrollDo()
    }
  }
  
  function initScrollFixed() {
    var oFix = doc.querySelector('.scroll-fix')
    if (oFix) {
      var fixTop = oFix.offsetTop,
          fixLeft = oFix.offsetLeft,
          fixWidth = oFix.clientWidth,
          fixHeight = oFix.clientHeight,
          oFooter = doc.querySelector('.footer'),
          footerHeight = oFooter.clientHeight + 20,
          docHeight = doc.body.clientHeight
  
      var tocFn = tocLocate()
      tocFn.active(doc.documentElement.scrollTop)
      var scrollDo = function () {
        var top = doc.documentElement.scrollTop
        watchTop(top)
        tocFn.active(top)
      }
      doc.addEventListener('scroll', scrollDo)
      doc.body.style.position = 'relative'
    }

    // watch scrolltop to fixed or not
    function watchTop(top) {
      if (top >= fixTop) {
        var bottom = docHeight - doc.documentElement.scrollTop - fixHeight
        if (bottom <= footerHeight) {
          oFix.style.position = 'absolute'
          oFix.style.top = 'auto'
          oFix.style.bottom = footerHeight + 'px'
        } else {
          oFix.style.position = 'fixed'
          oFix.style.top = 0
          oFix.style.left = fixLeft
          oFix.style.width = fixWidth + 'px'
          oFix.style.height = fixHeight + 'px'
        }
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

    function resetSrcollFixed() {
      doc.removeEventListener('scroll', scrollDo)
      if (oFix) {
        oFix.style.position = 'static'
        oFix.style.width = 'auto'
        oFix.style.height = 'auto'
      }
    }

    function reinitSrcollFixed() {
      if (doc.body.clientWidth > 960) {
        doc.addEventListener('scroll', scrollDo)
        scrollDo()
      }
    }

    return {
      scrollDo: scrollDo || function () {},
      resetSrcollFixed: resetSrcollFixed,
      reinitSrcollFixed: reinitSrcollFixed
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
})(document, window)
