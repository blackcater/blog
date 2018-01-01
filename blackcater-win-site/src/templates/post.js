import React, { Component } from 'react'
import Modal from 'react-modal'

import './post.styl'

export default class PostTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rewardModalOpen: false,
      rewardImageSrc: '',
    }
  }

  componentDidMount() {
    const { setCover, setTitle } = this.props
    const { markdownRemark: post } = this.props.data

    setCover(post.frontmatter.cover)
    setTitle(post.frontmatter.title)
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

  render() {
    const { rewardModalOpen, rewardImageSrc } = this.state
    const { markdownRemark: post } = this.props.data
    const { prePost, nextPost, category, tags = [] } = this.props.pathContext

    return (
      <div className="template-post">
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
              <img src={require('images/rewards/zhifubao.png')} alt="支付宝" />
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
            <img src={rewardImageSrc} alt="扫一扫打赏" />
          </div>
        </Modal>
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
