import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Icon, Button, PostList, Pagination } from 'components'
import { formatGraphqlPostList } from 'utils/format'

import './category.styl'

class CategoryTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(
      `${this.props.t(
        'category'
      )}: ${this.props.pathContext.category.toUpperCase()}`
    )
  }

  // 分页处理
  handlePagination = index => {
    const { history } = this.props

    history.push(`/category/${this.props.pathContext.category}/${index}`)
  }

  render() {
    const { category, pageIndex, pageSize, totalPage } = this.props.pathContext
    const posts = formatGraphqlPostList(this.props.data.posts)

    return (
      <div className="template-category">
        <h2>{category.toUpperCase()}</h2>
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
  query CategoryTemplateQuery($category: String, $skip: Int, $limit: Int) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { eq: $category } } }
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
export default translate('translation')(CategoryTemplate)
