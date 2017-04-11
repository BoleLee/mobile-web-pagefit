/**
  * 此代码设置data-dpr, viewport, font-size以适配移动设备，应在head即加载
  * 主要参考自手淘移动端Web适配方案，根据需要有所改动
  * 详细说明可查看README
  * 
  * @BoleLee(964624188@qq.com) 
  * 2017-04-01
  * 
  */
(function (doc, win) {
  var doc = win.document;
  var docEl = doc.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var metaCtt = metaEl ? metaEl.content : '';
  var dpr = 0;
  var scale = 0;
  var matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/);
  var matchWidth = metaCtt.match(/width=([^,\s]+)/);

  /**
    * ================================================
    *   设置data-dpr和viewport
    × ================================================
    */
  if (matchScale) {
    console.warn('将根据已有的meta标签来设置缩放比例');
    scale = parseFloat(matchScale[1]);
    dpr = parseInt(1 / scale);
  }

  // 对iOS设备进行dpr的判断，对于Android系列，始终认为其dpr为1
  if (!dpr && !scale) {
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/[iphone|ipad]/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        dpr = 1;
    }
    scale = 1 / dpr;
  }

  docEl.setAttribute('data-dpr', dpr);
  // 动态改写meta:viewport标签
  if (!matchScale) { 
    var metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    if (docEl.firstElementChild) {
      document.documentElement.firstElementChild.appendChild(metaEl);
    } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      documen.write(wrap.innerHTML);
    }
  }


  /**
    * ================================================
    *   设置根元素font-size
    * 当设备宽度为375(iPhone6)时，根元素font-size=16px; 依次增大；
    * 当为设备宽度大于768(iPad)之后，font-size不再继续增大
    × ================================================
    */
  var refreshRem = function () {
    var clientWidth = docEl.clientWidth; // var clientWidth = docEl.getBoundingClientRect().width;
    if (!clientWidth) return;
    var fz;
    var maxWidth = 768;
    var width = clientWidth;
    if(clientWidth/dpr > maxWidth) {
      width = maxWidth*dpr;
    }
    fz = 16 * (width / 375);
    docEl.style.fontSize = fz + 'px';
  };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, refreshRem, false);
  doc.addEventListener('DOMContentLoaded', refreshRem, false);
  refreshRem();

})(document, window);

