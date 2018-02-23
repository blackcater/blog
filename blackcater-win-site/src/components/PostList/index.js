import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button } from 'components'
import Link from 'gatsby-link'
import Img from 'gatsby-image'

import './index.styl'

class PostList extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { posts } = this.props

    return (
      <div className="wbi--post-list">
        {posts.map((post, index) => (
          <div key={`${index}`} className="post">
            <div className="cover">
              {post.frontmatter.header ? (
                <Img
                  style={{ width: '100%', height: '100%' }}
                  sizes={post.frontmatter.header.sizes}
                  alt={post.frontmatter.title}
                />
              ) : (
                <img
                  src={post.frontmatter.cover}
                  alt={post.frontmatter.title}
                />
              )}
            </div>
            <div className="content">
              <div className="title">{post.frontmatter.title}</div>
              <div className="time">{post.frontmatter.edate}</div>
              <div className="tags">
                {(post.frontmatter.tags || []).map((tag, idx) => (
                  <div key={`${idx}`} className="tag">
                    <Link to={`/tag/${tag}`}>{tag}</Link>
                  </div>
                ))}
              </div>
              <div className="excerpt">{post.excerpt}</div>
              <div className="category">
                <Link to={`/category/${post.frontmatter.category}/`}>
                  {post.frontmatter.category.toUpperCase()}
                </Link>
              </div>
              <div className="read-more">
                <Link to={post.fields.slug}>
                  <Button type="circle" color="pink">
                    READ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.any.isRequired,
}

PostList.defaultProps = {
  posts: [],
}

export default translate('translation')(PostList)
