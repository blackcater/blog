import React, { Component } from 'react'
import { Icon, Button, ArchiveList, Pagination } from 'components'
import { formatGraphqlGroupPostList } from 'utils/format'

import './archive.styl'

export default class ArchiveTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle('ARCHIVE')
  }

  // 分页处理
  handlePagination = index => {
    const { history } = this.props

    history.push(`/archive/${index}`)
  }

  render() {
    const {
      pageData: posts = [],
      pageIndex,
      pageSize,
      totalPage,
    } = this.props.pathContext
    const groups = formatGraphqlGroupPostList(this.props.data.groupPosts)

    return (
      <div className="template-archive">
        <h2>ARCHIVE</h2>
        <ArchiveList groups={groups} />
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
  query ArchiveTemplateQuery($skip: Int, $limit: Int) {
    groupPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      groups: group(field: fields___year) {
        title: fieldValue
        posts: edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              date: date(formatString: "MM-DD")
            }
          }
        }
      }
    }
  }
`
