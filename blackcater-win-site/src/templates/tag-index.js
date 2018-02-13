import React, { Component } from 'react'
import { Icon, Button } from 'components'

import './tag-index.styl'

export default class TagIndexTemplate extends Component {
  componentDidMount() {
    this.props.setTitle('TAGS')
  }

  // 标签点击事件
  handleTagClick = tag => {
    const { history } = this.props

    history.push(tag.slug)
  }

  render() {
    const { tags = [] } = this.props.pathContext

    return (
      <div className="template-tag-index">
        <h2>TAGS</h2>
        <div className="tag-list">
          {tags.map((tag, index) => (
            <div
              key={`${index}`}
              className="tag"
              onClick={() => this.handleTagClick(tag)}
            >
              {tag.name} <span>{tag.num}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
