import React, { Component } from 'react'
import { Icon, Button, PostList, Pagination } from 'components'

import './category.styl'

export default class CategoryTemplate extends Component {
  componentDidMount() {
    this.props.setTitle(
      `CATEGORY: ${this.props.pathContext.category.toUpperCase()}`
    )
  }

  // 分页处理
  handlePagination = index => {
    const { history } = this.props

    history.push(`/category/${this.props.pathContext.category}/${index}`)
  }

  render() {
    const {
      pageData: posts = [],
      category,
      pageIndex,
      pageSize,
      totalPage,
    } = this.props.pathContext

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
