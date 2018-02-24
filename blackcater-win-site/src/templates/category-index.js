import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { ArchiveList, Pagination } from 'components'
import { isMobile } from 'utils/common'
import { formatGraphqlGroupPostList } from 'utils/format'

import './category-index.styl'

class CategoryIndexTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.t('category'))
  }

  // 分页处理
  handlePagination = index => {
    const { history } = this.props

    history.push(`/category/${index}`)
  }

  render() {
    const { t } = this.props
    const { pageIndex, pageSize, totalPage } = this.props.pathContext
    const groups = formatGraphqlGroupPostList(this.props.data.groupPosts)

    return (
      <div className="template-category-index">
        <h2>{t('category')}</h2>
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
  query CategoryIndexTemplateQuery($skip: Int, $limit: Int) {
    groupPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      groups: group(field: frontmatter___category) {
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
export default translate('translation')(CategoryIndexTemplate)
