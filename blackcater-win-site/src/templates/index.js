import React, { Component } from 'react'
import { Icon, Button, PostList } from 'components'
import Link from 'gatsby-link'
import { formatGraphqlPostList } from 'utils/format'

import './index.styl'

export default class IndexPage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.data.site.siteMetadata.title)
  }

  render() {
    const posts = formatGraphqlPostList(this.props.data.posts)

    return (
      <div className="page-index">
        <h2>RECENT</h2>
        <PostList posts={posts || []} history={this.props.history} />
        <div className="more-section">
          <Link to="/archive/">
            <Button type="circle" color="pink">
              MORE
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}

export const query = graphql`
  query IndexTemplate {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: 0
      limit: 5
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
