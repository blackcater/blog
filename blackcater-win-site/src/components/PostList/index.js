import React, { Component, PropTypes } from 'react'
import { Button } from 'components'
import Link from 'gatsby-link'

import './index.styl'

export default class PostList extends Component {
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
            <div
              style={{
                backgroundImage: `url('${post.frontmatter.cover}')`,
              }}
              className="cover"
            />
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
