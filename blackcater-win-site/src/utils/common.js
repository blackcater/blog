// 通用获取 scrollTop 值
export function scrollTop() {
  let t = window.document.documentElement || window.document.body.parentNode

  return (typeof t.scrollTop === 'number' ? t : window.document.body).scrollTop
}

export function isEmptyObject(obj = {}) {
  for (const key in obj) {
    return false
  }

  return true
}

// 设备宽度小于 600 默认为 移动设备
export function isMobile() {
  const regexp = /(iphone|ipod|android|adr)/i

  return regexp.test(window.navigator.appVersion)
}

export function isDesktop() {}

export function isIphonex() {}
