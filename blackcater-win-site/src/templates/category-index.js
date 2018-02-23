import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { isMobile } from 'utils/common'

import './category-index.styl'

class CategoryIndexTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle('CATEGORY')
  }

  render() {
    const { t } = this.props

    return (
      <div className="template-category-index">
        <h2>{t('category')}</h2>
      </div>
    )
  }
}

export default translate('translation')(CategoryIndexTemplate)
