import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Icon } from 'components'
import Link from 'gatsby-link'
import { events, query as domQuery } from 'dom-helpers'
import { scrollTop, isMobile } from 'utils/common'
import { throttle } from 'lodash'
import cx from 'classnames'

import 'styles/prism.css'
import './index.styl'

export default class IndexLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menu: false,
      header: true,
      enableHideHeader: true,
      transparent: true,
      transformY: 0,
      scale: 1,
      cover: '',
      title: '',
    }
    this.lastScrollTop = 0

    if (typeof window !== 'undefined') {
      this.smoothScroll = window.smoothScroll
    }

    this._handleScroll = throttle(this.handleScroll, 300)
  }

  componentDidMount() {
    events.on(window.document, 'scroll', this.handleScroll)

    this.handleScroll({ target: window.document.body })
  }

  componentWillUnmount() {
    events.off(window.document, 'scroll', this.handleScroll)

    this.smoothScroll.destroy()
  }

  // 滚动事件
  handleScroll = e => {
    const scrollTop = domQuery.scrollTop(e.target)
    const height = window.innerHeight
    const { transparent } = this.state
    const scrollDirection = scrollTop > this.lastScrollTop
    const state = {}

    this.lastScrollTop = scrollTop

    if (scrollTop <= height) {
      state.transformY = -scrollTop / 4
      state.scale = 1 + scrollTop / (8 * height)
    }

    if (scrollTop >= height - 192) {
      if (scrollDirection && this.state.header) {
        // 向下滚动，影藏 header
        state.header = false
      }

      if (!scrollDirection && !this.state.header) {
        // 向上滚动，显示 header
        state.header = true
      }

      if (transparent) {
        state.transparent = false
      }
    }

    if (scrollTop <= height - 192) {
      if (!this.state.header) {
        state.header = true
      }

      if (!transparent) {
        state.transparent = true
      }
    }

    this.setState(state)
  }

  // 切换 菜单栏显隐
  toggleMenu = menu => {
    this.setState({
      menu: !menu,
    })
  }

  // 滚动
  handleMoveDown = () => {
    // this.setState({
    //   transparent: false,
    // })
  }

  setCover = cover => {
    this.setState({
      cover,
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
      transformY,
      scale,
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
            <div className="avatar" />
            <div id="title" className="title">
              {this.state.title || title}
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
          <div
            className={cx({
              'menu-list': true,
              active: showHeader && menu,
            })}
          >
            <div
              className="menu-item"
              onClick={() => this.setState({ menu: false })}
            >
              <Link to="/">HOME</Link>
            </div>
            <div
              className="menu-item"
              onClick={() => this.setState({ menu: false })}
            >
              <Link to="/tag/">TAG</Link>
            </div>
            <div
              className="menu-item"
              onClick={() => this.setState({ menu: false })}
            >
              <Link to="/archive/">ARCHIVE</Link>
            </div>
            <div
              className="menu-item"
              onClick={() => this.setState({ menu: false })}
            >
              <Link to="/resume/">RESUME</Link>
            </div>
            <div
              className="menu-item"
              onClick={() => this.setState({ menu: false })}
            >
              <Link to="/about/">ABOUT</Link>
            </div>
          </div>
        </div>
        <div className="layout-cover">
          <div
            style={{
              transform: `scale(${scale}) translateY(${transformY}px)`,
              background: `url("${this.state.cover}") 50% 50% / cover`,
            }}
            className="fullscreen"
          />
          <div className="fullscreen-by">
            PROVIDED BY{' '}
            <a href="https://unsplash.com" target="_blank">
              Unsplash
            </a>
          </div>
          <div className="more-btn" onClick={this.handleMoveDown}>
            <Icon
              type="arrow-down"
              style={{ color: '#fff', fontSize: '20px' }}
            />
          </div>
        </div>
        <div className="layout-content">
          {children({
            ...this.props,
            setCover: this.setCover,
            setTitle: this.setTitle,
            scrollTo: this.scrollTo,
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
                      <img
                        style={{ width: '14px', height: '14px' }}
                        src={require(`images/links/${social.type}.png`)}
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
            <div className="right">
              {nickname.toUpperCase()} &copy; ALL RIGHT RESERVED.
            </div>
            <div className="tool">POWERED BY GATSBY</div>
          </div>
        </div>
        <div className={cx({ rocket: true, show: !transparent })}>
          <img
            src={require('images/rocket.png')}
            alt="rocket"
            onClick={() => this.scrollTo()}
          />
        </div>
      </div>
    )
  }
}

export const query = graphql`
  query LayoutData {
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
  }
`
