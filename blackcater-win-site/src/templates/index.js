import React, { Component } from 'react'
import { Icon, Button, PostList } from 'components'
import Link from 'gatsby-link'

import './index.styl'

export default class IndexPage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.data.site.siteMetadata.title)
  }

  render() {
    const { posts = [] } = this.props.pathContext

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
  query IndexPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`
