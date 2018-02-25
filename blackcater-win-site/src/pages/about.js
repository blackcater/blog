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
        <div className="section section-me" />
        <div className="section">
          <div className="title">座右铭</div>
        </div>
        <div className="section">
          <div className="title">兴趣爱好</div>
        </div>
        <div className="section">
          <div className="title">开源项目</div>
        </div>
      </div>
    )
  }
}

export default translate('translation')(AboutPage)
