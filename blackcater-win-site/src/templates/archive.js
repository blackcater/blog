import React, { Component } from 'react'
import { Icon, Button, PostList, Pagination } from 'components'

import './archive.styl'

export default class ArchiveTemplate extends Component {
  componentDidMount() {
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

    return (
      <div className="template-archive">
        <h2>ARCHIVE</h2>
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
