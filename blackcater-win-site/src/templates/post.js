import React, { Component } from 'react'

import './post.styl'

export default class PostTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { setCover, setTitle } = this.props
    const { markdownRemark: post } = this.props.data

    setCover(post.frontmatter.cover)
    setTitle(post.frontmatter.title)
  }

  handleTagClick = slug => {
    const { history } = this.props

    history.push(slug)
  }

  render() {
    const { markdownRemark: post } = this.props.data
    const { prePost, nextPost, category, tags = [] } = this.props.pathContext

    return (
      <div className="template-post">
        <div className="title">{post.frontmatter.title}</div>
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
