import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Icon, Button } from 'components'

import './tag-index.styl'

class TagIndexTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle('TAGS')
  }

  // 标签点击事件
  handleTagClick = tag => {
    const { history } = this.props

    history.push(tag.slug)
  }

  render() {
    const { t } = this.props
    const { tags = [] } = this.props.pathContext

    return (
      <div className="template-tag-index">
        <h2>{t('tag')}</h2>
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

export default translate('translation')(TagIndexTemplate)
