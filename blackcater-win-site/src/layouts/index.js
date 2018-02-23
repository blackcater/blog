import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Icon } from 'components'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import { translate } from 'react-i18next'
import { events, query as domQuery } from 'dom-helpers'
import { scrollTop, isMobile, isEmptyObject } from 'utils/common'
import i18n from 'utils/i18n'
import { throttle } from 'lodash'
import axios from 'axios'
import cx from 'classnames'

import 'styles/prism.css'
import './index.styl'

const NAMESPACE = 'UNSPLASH_IMG__BL0G_INDEX_PAGE'

translate.setI18n(i18n)

export default class IndexLayout extends Component {
  constructor(props) {
    super(props)

    const socialMap = {}

    this.props.data.socials.edges.forEach(({ node }) => {
      const { id, sizes } = node
      const idReg = /([^\/]*?)\.([^\/\s]*)/
      const [, name, ext] = idReg.exec(id)

      socialMap[name] = {
        name,
        ext,
        sizes,
      }
    })

    this.state = {
      menu: false,
      header: true,
      enableHideHeader: true,
      transparent: true,
      scale: 1,
      cover: '',
      title: '',
      socialMap,
      progress: 0,
      isUnsplash: false,
    }
    this.lastScrollTop = 0

    if (typeof window !== 'undefined') {
      this.smoothScroll = window.smoothScroll
    }

    this._handleScroll = throttle(this.handleScroll, 200)
  }

  componentDidMount() {
    events.on(window.document, 'scroll', this._handleScroll)

    this.handleScroll({ target: window.document.body })
  }

  componentWillUnmount() {
    events.off(window.document, 'scroll', this._handleScroll)

    this.smoothScroll.destroy()
  }

  // 滚动事件
  handleScroll = e => {
    const scrollTop = domQuery.scrollTop(e.target)
    const scrollHeight =
      window.document.documentElement.scrollHeight ||
      window.document.body.scrollHeight
    const height = window.innerHeight
    const { transparent, progress } = this.state
    const scrollDirection = scrollTop > this.lastScrollTop
    const scrollDistance = Math.abs(scrollTop - this.lastScrollTop)
    const state = {}

    this.lastScrollTop = scrollTop

    if (scrollTop <= height) {
      state.scale = 1 + scrollTop / (2 * height)
    }

    if (scrollTop >= height - 192) {
      if (scrollDirection && scrollDistance >= 20 && this.state.header) {
        // 向下滚动，影藏 header
        state.header = false
      }

      if (!scrollDirection && scrollDistance >= 20 && !this.state.header) {
        // 向上滚动，显示 header
        state.header = true
      }

      if (transparent) {
        state.transparent = false
      }

      state.progress = (
        (scrollTop - height + 192) /
        (scrollHeight - height + 192 - height) *
        100
      ).toFixed(0)
    }

    if (scrollTop <= height - 192) {
      if (!this.state.header) {
        state.header = true
      }

      if (!transparent) {
        state.transparent = true
      }

      if (progress) {
        state.progress = 0
      }
    }

    if (!isEmptyObject(state)) this.setState(state)
  }

  // 切换 菜单栏显隐
  toggleMenu = menu => {
    if (!menu) {
      window.document.documentElement.classList.add('disabled')
    } else {
      window.document.documentElement.classList.remove('disabled')
    }

    this.setState({
      menu: !menu,
    })
  }

  // 判断是否需要更新图片
  shouldFetchUnsplashPhoto = () => {
    const { date } = JSON.parse(window.localStorage.getItem(NAMESPACE) || '{}')
    const now = new Date()

    if (!date) return true

    const past = new Date(date)

    return !(
      past.getFullYear() === now.getFullYear() &&
      past.getMonth() === now.getMonth() &&
      past.getDay() === now.getDay()
    )
  }

  // 获取 unsplash 图片
  fetchUnsplashPhoto = (cb, errCb) => {
    const mobile = isMobile()
    const orientation = mobile ? 'portrait' : 'landscape'

    axios
      .get('https://api.unsplash.com/photos/random', {
        params: {
          query: 'landscape',
          orientation,
        },
        headers: {
          'Accept-Version': 'v1',
          Authorization:
            'Client-ID 2293f4e76a8b62a4e5c08a6d05f74d0f12c4cc9e84dc697736d50a422d9a541c',
        },
      })
      .then(({ data }) => {
        if (cb) cb(data.urls)
      })
      .catch(errCb)
  }

  setUnsplashCover = () => {
    const mobile = isMobile()
    const width = mobile ? '600' : '1200'

    if (this.shouldFetchUnsplashPhoto()) {
      // 需要更新
      this.fetchUnsplashPhoto(urls => {
        window.localStorage.setItem(
          NAMESPACE,
          JSON.stringify({
            date: Date.now(),
            urls,
          })
        )

        const coverSrc = `${urls.full}&w=${width}`
        const image = new Image()

        image.src = coverSrc

        image.onload = () => {
          this.setCover(coverSrc, true)
        }

        this.setCover(urls.thumb, true)
      })
    } else {
      const { urls } = JSON.parse(
        window.localStorage.getItem(NAMESPACE) || '{}'
      )

      const coverSrc = `${urls.full}&w=${width}`
      const image = new Image()

      image.src = coverSrc

      image.onload = () => {
        this.setCover(coverSrc, true)
      }

      this.setCover(urls.thumb, true)
    }

    this.setTitle(this.props.data.site.siteMetadata.title)
  }

  setCover = (cover, isUnsplash = false) => {
    this.setState({
      cover,
      isUnsplash,
    })
  }

  setTitle = title => {
    this.setState({
      title,
    })
  }

  enableHideHeader = enable => {
    this.setState({
      enableHideHeader: enable,
    })
  }

  // 滚动到顶部
  scrollTo = hash => {
    if (!hash) {
      this.smoothScroll.animateScroll(
        window.document.querySelector('title'),
        null,
        {
          offset: 0,
          easing: 'easeInOutCubic',
        }
      )

      return
    }

    const value = hash[0] === '#' ? hash.slice(1) : hash

    this.smoothScroll.animateScroll(
      window.document.querySelector(`[id='${value}']`),
      null,
      { offset: 50, easing: 'easeInOutCubic' }
    )
  }

  render() {
    const {
      menu,
      header,
      enableHideHeader,
      transparent,
      scale,
      progress,
      socialMap,
      isUnsplash,
    } = this.state
    const { children, data: { site: { siteMetadata: metaData } } } = this.props
    const { title, description, nickname, slogan, socials, links } = metaData
    const showHeader = !enableHideHeader || header

    return (
      <div className="layout" ref={ele => (this.layout = ele)}>
        <Helmet>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover"
          />
          <meta name="description" content={description} />
          <link href="/favicon.png" rel="shortcut icon" type="image/x-icon" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700"
            rel="stylesheet"
          />
          <link href="/favicon.png" rel="apple-touch-icon-precomposed" />
        </Helmet>
        <div
          className={cx({
            'layout-header': true,
            hide: !showHeader,
            transparent,
          })}
        >
          <div className="title-section">
            <Link className="avatar" to="/resume/" />
            <div id="title" className="title">
              {this.state.title || ''}
            </div>
            <div
              className="icon"
              onClick={() => this.toggleMenu(showHeader && menu)}
            >
              <Icon
                type={showHeader && menu ? 'x' : 'menu'}
                style={{
                  color: transparent ? '#ffffff' : '#758db0',
                  fontSize: '20px',
                }}
              />
            </div>
          </div>
        </div>
        <div
          className={cx({
            'layout-menu': true,
            active: showHeader && menu,
          })}
        >
          <div className="menu-list">
            <div className="menu-item" onClick={() => this.toggleMenu(true)}>
              <Link to="/">HOME</Link>
            </div>
            <div className="menu-item" onClick={() => this.toggleMenu(true)}>
              <Link to="/tag/">TAG</Link>
            </div>
            <div className="menu-item" onClick={() => this.toggleMenu(true)}>
              <Link to="/category/">COLUMN</Link>
            </div>
            <div className="menu-item" onClick={() => this.toggleMenu(true)}>
              <Link to="/archive/">ARCHIVE</Link>
            </div>
            <div className="menu-item" onClick={() => this.toggleMenu(true)}>
              <Link to="/resume/">RESUME</Link>
            </div>
            <div className="menu-item" onClick={() => this.toggleMenu(true)}>
              <Link to="/about/">ABOUT</Link>
            </div>
          </div>
        </div>
        <div className="layout-cover">
          <div
            style={{
              transform: `scale(${scale})`,
            }}
            className="fullscreen"
          >
            {typeof this.state.cover === 'string' && this.state.cover ? (
              <img src={this.state.cover} alt="header" />
            ) : this.state.cover ? (
              <Img
                style={{ width: '100vw', height: 'calc(100vh - 142px)' }}
                sizes={this.state.cover.sizes}
                alt="header"
              />
            ) : null}
          </div>
          {isUnsplash ? (
            <div className="fullscreen-by">
              PROVIDED BY{' '}
              <a href="https://unsplash.com" target="_blank">
                Unsplash
              </a>
            </div>
          ) : null}
          <div className="more-btn" onClick={this.handleMoveDown}>
            <div className="down">
              <Icon
                type="arrow-down"
                style={{ color: '#fff', fontSize: '20px' }}
              />
            </div>
          </div>
        </div>
        <div className="layout-content">
          {children({
            ...this.props,
            setCover: this.setCover,
            setTitle: this.setTitle,
            scrollTo: this.scrollTo,
            setUnsplashCover: this.setUnsplashCover,
            enableHideHeader: this.enableHideHeader,
          })}
        </div>
        <div className="layout-footer">
          <div className="section">
            <div className="left">
              <div className="slogan">
                <div className="title">SLOGAN</div>
                <p>{slogan}</p>
              </div>
              <div className="social-list">
                {socials.map(social => (
                  <div key={social.type} className="social-item">
                    <a href={social.url} target="_blank">
                      <Img
                        style={{ width: '14px', height: '14px' }}
                        sizes={socialMap[social.type].sizes}
                        alt={social.type}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="right">
              {links.length > 0 ? (
                <div className="section-list">
                  <div className="title">LINKS</div>
                  <div className="link-list">
                    {links.map(link => (
                      <div key={link.name} className="link-item">
                        <a href={link.link} target="_blank">
                          {link.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="info">
            <div className="left">
              {nickname.toUpperCase()} &copy; ALL RIGHT RESERVED.
            </div>
            <div className="right">POWERED BY GATSBY</div>
          </div>
        </div>
        <div
          className={cx({ totop: true, show: !transparent })}
          onClick={() => this.scrollTo()}
        >
          <Icon type="arrow-up" style={{ color: '#fff', fontSize: '24px' }} />
          <span className="progress">{progress}%</span>
          <div className="bg" style={{ height: `${progress}%` }} />
        </div>
      </div>
    )
  }
}

export const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
        nickname
        slogan
        email
        socials {
          type
          url
        }
        links {
          name
          link
        }
      }
    }
    socials: allImageSharp(filter: { id: { regex: "/images/socials//" } }) {
      edges {
        node {
          id
          sizes(maxWidth: 28) {
            ...GatsbyImageSharpSizes
          }
        }
      }
    }
  }
`
