import React, { Component } from 'react'
import { Icon, Button, PostList, Pagination } from 'components'
import { formatGraphqlPostList } from 'utils/format'

import './tag.styl'

export default class TagTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(`TAG: ${this.props.pathContext.tag.toUpperCase()}`)
  }

  // 分页处理
  handlePagination = index => {
    const { history } = this.props

    history.push(`/tag/${this.props.pathContext.tag}/${index}`)
  }

  render() {
    const posts = formatGraphqlPostList(this.props.data.posts || [])
    const { tag, pageIndex, pageSize, totalPage } = this.props.pathContext

    return (
      <div className="template-tag">
        <h2>{tag.toUpperCase()}</h2>
        <PostList posts={posts} history={this.props.history} />
        <Pagination
          current={pageIndex}
          size={pageSize}
          count={totalPage}
          onPagination={this.handlePagination}
        />
      </div>
    )
  }
}

export const query = graphql`
  query TagTemplate($tag: String, $skip: Int, $limit: Int) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
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
      }
    }
  }
`
