import React, { Component } from 'react'
import { Icon, Button, PostList, Pagination } from 'components'

import './tag.styl'

export default class TagTemplate extends Component {
  componentDidMount() {
    this.props.setTitle(`TAG: ${this.props.pathContext.tag.name.toUpperCase()}`)
  }

  // 分页处理
  handlePagination = index => {
    const { history } = this.props

    history.push(`/tag/${this.props.pathContext.tag.name}/${index}`)
  }

  render() {
    const {
      pageData: posts = [],
      tag,
      pageIndex,
      pageSize,
      totalPage,
    } = this.props.pathContext

    return (
      <div className="template-tag">
        <h2>{tag.name.toUpperCase()}</h2>
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
