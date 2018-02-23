import React, { Component } from 'react'
import Modal from 'react-modal'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import { Icon } from 'components'
import cx from 'classnames'
import { events, query as domQuery } from 'dom-helpers'
import Gitment from 'gitment'
import { throttle } from 'lodash'
import { isMobile } from 'utils/common'
import { formatGraphqlPost } from 'utils/format'

import 'styles/gitment.css'
import './post.styl'

export default class PostTemplate extends Component {
  constructor(props) {
    super(props)

    const rewardMap = {}

    this.props.data.rewards.edges.forEach(({ node }) => {
      const { id, sizes } = node
      const idReg = /([^\/]*?)\.([^\/\s]*)/
      const [, name, ext] = idReg.exec(id)

      rewardMap[name] = {
        name,
        ext,
        sizes,
      }
    })

    this.state = {
      rewardMap,
      rewardModalOpen: false,
      rewardImageSrc: {},
      collapse: false,
      collapseFirst: true,
      transparent: true,
      anchors: [],
    }

    this._handleScroll = throttle(this.handleScroll, 200)
  }

  componentDidMount() {
    const { setCover, setTitle } = this.props
    const post = formatGraphqlPost(this.props.data.post)
    const gitment = new Gitment({
      id: post.frontmatter.title,
      owner: 'blackcater',
      repo: 'blackcater.github.io',
      oauth: {
        client_id: 'f402dedf9798585394d9',
        client_secret: '0ae847d4b789be4450e503948a8155a413349f7b',
      },
    })
    const hash = decodeURIComponent(window.location.hash)

    setCover(post.frontmatter.header || post.frontmatter.cover)
    setTitle('')

    gitment.render('comments')

    // 监听滚动事件
    events.on(window.document, 'scroll', this._handleScroll)
    events.on(window, 'hashchange', this.handleHashChange)

    if (hash) this.props.scrollTo(hash)
  }

  componentWillUnmount() {
    events.off(window.document, 'scroll', this._handleScroll)
    events.off(window, 'hashchange', this.handleHashChange)

    this.props.enableHideHeader(true)
  }

  handleHashChange = () => {
    const hash = decodeURIComponent(window.location.hash)

    if (hash) this.props.scrollTo(hash)
  }

  // 处理目录，获取一些数据信息
  dealWithCategory(cb) {
    const scrollTop = domQuery.scrollTop(window)
    const anchorList = this.$category.querySelectorAll('a')
    const anchors = []

    for (let i = 0, len = anchorList.length; i < len; i++) {
      const anchor = anchorList[i]
      const { hash } = anchor
      const hashValue = hash[0] === '#' ? hash : `#${hash}`
      const id = decodeURIComponent(hashValue.slice(1))
      const rect = document.getElementById(id).getBoundingClientRect()

      events.on(anchor, 'click', e => {
        e.preventDefault()

        if (history.pushState) {
          history.pushState(null, null, hashValue)

          this.props.scrollTo(id)
        } else {
          window.location.hash = hashValue
        }

        return false
      })

      anchors.push({
        id,
        hash: hashValue,
        top: rect.top + scrollTop,
        anchor,
      })
    }

    this.setState({ anchors }, cb)
  }

  // 滚动事件
  handleScroll = e => {
    const scrollTop = domQuery.scrollTop(e ? e.target : window)
    const height = window.innerHeight
    const { transparent, anchors } = this.state

    if (scrollTop > height - 192 && transparent) {
      this.setState({ transparent: false })
    }

    if (scrollTop <= height - 192 && !transparent) {
      this.setState({ transparent: true })
    }

    // 滚动位置检测
    let index = 0

    anchors.forEach((anchor, idx) => {
      const { top, anchor: a } = anchor

      if (idx === index) {
        if (scrollTop > top - 60) {
          index++
        } else {
          index--
        }
      }

      a.classList.remove('active')
    })

    if (anchors.length > 0) {
      if (index <= 0) {
        // 取第一个
        anchors[0].anchor.classList.add('active')
      } else if (index >= anchors.length) {
        // 取最后一个
        anchors[anchors.length - 1].anchor.classList.add('active')
      } else {
        anchors[index].anchor.classList.add('active')
      }
    }
  }

  // 切换侧边栏
  handleToggleCollapse = () => {
    if (!this.state.collapse) {
      this.props.enableHideHeader(false)
    } else {
      this.props.enableHideHeader(true)
    }

    if (this.state.collapseFirst) {
      if (!isMobile()) this.dealWithCategory(this._handleScroll)
    }

    this.setState({
      collapse: !this.state.collapse,
      collapseFirst: false,
    })
  }

  // 打赏点击
  handleRewardClick = way => {
    const { rewardMap } = this.state

    if (way === 'zhifubao') {
      this.setState({
        rewardModalOpen: true,
        rewardImageSrc: rewardMap['zhifubao_qrcode'].sizes,
      })

      return
    }

    if (way === 'weixin') {
      this.setState({
        rewardModalOpen: true,
        rewardImageSrc: rewardMap['weixin_qrcode'].sizes,
      })
    }
  }

  render() {
    const {
      rewardModalOpen,
      rewardImageSrc,
      rewardMap,
      collapse,
      transparent,
    } = this.state
    const { category, tags = [] } = this.props.pathContext
    const post = formatGraphqlPost(this.props.data.post)
    const prevPost = formatGraphqlPost(this.props.data.prevPost)
    const nextPost = formatGraphqlPost(this.props.data.nextPost)
    const prev = prevPost || post
    const next = nextPost || post

    return (
      <div className={cx({ 'template-post': true, collapse })}>
        <div className="post">
          <div className="title">
            {post.frontmatter.title}{' '}
            <span className="category">
              <Link to={category.slug}>{category.name}</Link>
            </span>
          </div>
          <div className="time">{post.frontmatter.edate}</div>
          <div className="info">
            <div className="time-to-read">{post.timeToRead}</div>
            <div className="words-count">{post.wordCounts.words}</div>
          </div>
          <div className="content">
            <div
              className="typograph"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
          <div className="tags">
            {tags.map((tag, index) => (
              <div key={`${index}`} className="tag">
                <Link to={tag.slug}>{tag.name}</Link>
              </div>
            ))}
          </div>
          <div className="reward">
            <Img
              className="reward-image"
              sizes={rewardMap['img'].sizes}
              alt="创作不易，如果你觉得文章不错，来点打赏吧！"
            />
            <div className="pay-list">
              <div
                className="pay pay-zhifubao"
                onClick={() => this.handleRewardClick('zhifubao')}
              >
                <Img sizes={rewardMap['zhifubao'].sizes} alt="支付宝" />
                支付宝
              </div>
              <div
                className="pay pay-weixin"
                onClick={() => this.handleRewardClick('weixin')}
              >
                <Img sizes={rewardMap['weixin'].sizes} alt="微信" />
                微信
              </div>
            </div>
          </div>
          <div className="navigator-list">
            <div className="navigator-item navigator-item--prev">
              <Link to={prev.fields.slug}>
                <div
                  className="cover"
                  style={{
                    backgroundImage: `url("${prev.frontmatter.cover}")`,
                  }}
                />
                <div className="content">
                  {prevPost ? (
                    <Icon type="arrow-left" />
                  ) : (
                    <Icon type="arrow-up" />
                  )}
                  <div className="tip">PREV POST</div>
                  <div className="head">{prev.frontmatter.title}</div>
                </div>
              </Link>
            </div>
            <div className="navigator-item navigator-item--next">
              <Link to={next.fields.slug}>
                <div
                  className="cover"
                  style={{
                    backgroundImage: `url("${next.frontmatter.cover}")`,
                  }}
                />
                <div className="content">
                  {nextPost ? (
                    <Icon type="arrow-right" />
                  ) : (
                    <Icon type="arrow-up" />
                  )}
                  <div className="tip">NEXT POST</div>
                  <div className="head">{next.frontmatter.title}</div>
                </div>
              </Link>
            </div>
          </div>
          <div id="comments" />
          <Modal
            isOpen={rewardModalOpen}
            style={{
              content: {
                padding: 0,
                marginLeft: '-200px',
                top: '100px',
                left: '50%',
                right: 'auto',
                bottom: '100px',
                maxWidth: '400px',
                background: 'none',
              },
            }}
            onRequestClose={() => this.setState({ rewardModalOpen: false })}
          >
            <div
              className="modal--reward"
              onClick={() => this.setState({ rewardModalOpen: false })}
            >
              <Img
                style={{ width: '400px' }}
                sizes={rewardImageSrc}
                alt="扫一扫打赏"
              />
            </div>
          </Modal>
        </div>
        {!isMobile() ? (
          <div className={cx({ headings: true, fixed: !transparent })}>
            <div className="index-title">INDEX</div>
            <div
              ref={el => (this.$category = el)}
              className="index-list"
              dangerouslySetInnerHTML={{ __html: post.tableOfContents }}
            />
          </div>
        ) : null}
        {!isMobile() ? (
          <div
            className={cx({ 'collapse-icon': true, show: !transparent })}
            onClick={this.handleToggleCollapse}
          >
            <Icon
              type={collapse ? 'arrow-left' : 'arrow-right'}
              style={{ color: '#fff', fontSize: '24px' }}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export const query = graphql`
  query PostQuery($curr: String, $prev: String, $next: String) {
    post: markdownRemark(fields: { slug: { eq: $curr } }) {
      fields {
        slug
      }
      frontmatter {
        title
        header {
          ... on File {
            childImageSharp {
              sizes(maxWidth: 1200) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
        }
        date
        edate: date(formatString: "MMMM DD, YYYY")
        tags
        category
      }
      tableOfContents
      timeToRead
      wordCounts: wordCount {
        words
      }
      headings {
        value
        depth
      }
      excerpt
      html
    }
    prevPost: markdownRemark(fields: { slug: { eq: $prev } }) {
      fields {
        slug
      }
      frontmatter {
        title
        header {
          ... on File {
            childImageSharp {
              sizes(maxWidth: 1200) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
        }
      }
    }
    nextPost: markdownRemark(fields: { slug: { eq: $next } }) {
      fields {
        slug
      }
      frontmatter {
        title
        header {
          ... on File {
            childImageSharp {
              sizes(maxWidth: 1200) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
        }
      }
    }
    rewards: allImageSharp(filter: { id: { regex: "/images/rewards//" } }) {
      edges {
        node {
          id
          sizes(maxWidth: 600) {
            ...GatsbyImageSharpSizes
          }
        }
      }
    }
  }
`
