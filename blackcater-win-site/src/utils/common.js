import { query as q } from 'dom-helpers'

// 通用获取 scrollTop 值
export function scrollTop() {
  let t = document.documentElement || document.body.parentNode

  return (typeof t.scrollTop === 'number' ? t : document.body).scrollTop
}

// 设备宽度小于 600 默认为 移动设备
export function isMobile() {
  const regexp = /(iphone|ipod|android|adr)/i

  return regexp.test(window.navigator.appVersion)
}

export function isDesktop() {}

export function isIphonex() {}
