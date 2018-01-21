import React, { Component } from 'react'
import Modal from 'react-modal'
import { Icon } from 'components'
import cx from 'classnames'
import { events, query as domQuery } from 'dom-helpers'
import Gitment from 'gitment'

import 'styles/gitment.css'
import './post.styl'

export default class PostTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rewardModalOpen: false,
      rewardImageSrc: '',
      collapse: false,
      showCollapse: false,
    }
  }

  componentDidMount() {
    const { setCover, setTitle } = this.props
    const { markdownRemark: post } = this.props.data
    const gitment = new Gitment({
      id: post.frontmatter.title,
      owner: 'blackcater',
      repo: 'blackcater.github.io',
      oauth: {
        client_id: 'f402dedf9798585394d9',
        client_secret: '0ae847d4b789be4450e503948a8155a413349f7b',
      },
    })

    setCover(post.frontmatter.cover)
    setTitle(post.frontmatter.title)

    gitment.render('comments')

    // 监听滚动事件
    events.on(window.document, 'scroll', this.handleScroll)
  }

  componentWillUnmount() {
    events.off(window.document, 'scroll', this.handleScroll)
  }

  // 滚动事件
  handleScroll = e => {
    const scrollTop = domQuery.scrollTop(e.target)
    const height = window.innerHeight
    const { showCollapse } = this.state

    if (scrollTop > height && !showCollapse) {
      this.setState({ showCollapse: true })
    }

    if (scrollTop <= height && showCollapse) {
      this.setState({ showCollapse: false })
    }
  }

  // 切换侧边栏
  handleToggleCollapse = () => {
    this.setState({
      collapse: !this.state.collapse,
    })
  }

  // 标签点击
  handleTagClick = slug => {
    const { history } = this.props

    history.push(slug)
  }

  // 类目点击
  handleCategoryClick = slug => {
    const { history } = this.props

    history.push(slug)
  }

  // 打赏点击
  handleRewardClick = way => {
    if (way === 'zhifubao') {
      this.setState({
        rewardModalOpen: true,
        rewardImageSrc: require('images/rewards/zhifubao_qrcode.jpg'),
      })

      return
    }

    if (way === 'weixin') {
      this.setState({
        rewardModalOpen: true,
        rewardImageSrc: require('images/rewards/weixin_qrcode.jpg'),
      })
    }
  }

  // 帖子点击
  handlePostClick = navPost => {
    const { markdownRemark: post } = this.props.data
    const { history } = this.props

    if (navPost === post) return

    history.push(navPost.fields.slug)
  }

  render() {
    const {
      rewardModalOpen,
      rewardImageSrc,
      collapse,
      showCollapse,
    } = this.state
    const { markdownRemark: post } = this.props.data
    const { prevPost, nextPost, category, tags = [] } = this.props.pathContext
    const prev = prevPost || post
    const next = nextPost || post

    console.dir(post)

    return (
      <div className={cx({ 'template-post': true, collapse })}>
        <div className="post">
          <div className="title">
            {post.frontmatter.title}{' '}
            <span
              className="category"
              onClick={() => this.handleCategoryClick(category.slug)}
            >
              {category.name}
            </span>
          </div>
          <div className="time">{post.frontmatter.edate}</div>
          <div className="info">
            <div className="time-to-read">{post.timeToRead}</div>
            <div className="words-count">{post.wordCount.words}</div>
          </div>
          <div className="content">
            <div
              className="typograph"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
          <div className="tags">
            {tags.map((tag, index) => (
              <div
                key={`${index}`}
                className="tag"
                onClick={() => this.handleTagClick(tag.slug)}
              >
                {tag.name}
              </div>
            ))}
          </div>
          <div className="reward">
            <img
              className="reward-image"
              src={require('images/rewards/img.png')}
              alt="创作不易，如果你觉得文章不错，来点打赏吧！"
            />
            <div className="pay-list">
              <div
                className="pay pay-zhifubao"
                onClick={() => this.handleRewardClick('zhifubao')}
              >
                <img
                  src={require('images/rewards/zhifubao.png')}
                  alt="支付宝"
                />
                支付宝
              </div>
              <div
                className="pay pay-weixin"
                onClick={() => this.handleRewardClick('weixin')}
              >
                <img src={require('images/rewards/weixin.png')} alt="支付宝" />
                微信
              </div>
            </div>
          </div>
          <div className="navigator-list">
            <div
              className="navigator-item navigator-item--prev"
              onClick={() => this.handlePostClick(prev)}
            >
              <div
                className="cover"
                style={{ backgroundImage: `url("${prev.frontmatter.cover}")` }}
              />
              <div className="content">
                {prevPost ? (
                  <Icon type="arrow-left" />
                ) : (
                  <Icon type="arrow-up" />
                )}
                <div className="tip">PREV POST</div>
                <div className="title">{prev.frontmatter.title}</div>
              </div>
            </div>
            <div
              className="navigator-item navigator-item--next"
              onClick={() => this.handlePostClick(next)}
            >
              <div
                className="cover"
                style={{ backgroundImage: `url("${next.frontmatter.cover}")` }}
              />
              <div className="content">
                {nextPost ? (
                  <Icon type="arrow-right" />
                ) : (
                  <Icon type="arrow-up" />
                )}
                <div className="tip">NEXT POST</div>
                <div className="title">{next.frontmatter.title}</div>
              </div>
            </div>
          </div>
          <div id="comments" />
          <Modal
            isOpen={rewardModalOpen}
            style={{
              content: {
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
            <div className="modal--reward">
              <img
                src={rewardImageSrc}
                alt="扫一扫打赏"
                onClick={() => this.setState({ rewardModalOpen: false })}
              />
            </div>
          </Modal>
        </div>
        <div className="headings" />
        <div
          className={cx({ 'collapse-icon': true, show: showCollapse })}
          onClick={this.handleToggleCollapse}
        >
          <Icon
            type={collapse ? 'arrow-left' : 'arrow-right'}
            style={{ color: '#fff', fontSize: '24px' }}
          />
        </div>
      </div>
    )
  }
}

export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        cover
        date
        edate: date(formatString: "MMMM DD, YYYY")
        tags
        category
      }
      tableOfContents
      timeToRead
      wordCount {
        words
      }
      headings {
        value
        depth
      }
      html
    }
  }
`
