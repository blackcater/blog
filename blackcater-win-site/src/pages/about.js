import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { isMobile } from 'utils/common'

import './about.styl'

class AboutPage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.t('about'))
  }

  render() {
    const { t } = this.props

    return (
      <div className="page-about">
        <h2>{t('about')}</h2>
      </div>
    )
  }
}

export default translate('translation')(AboutPage)
