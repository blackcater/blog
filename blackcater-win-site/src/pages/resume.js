import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Icon } from 'components'
import { isMobile } from 'utils/common'

import './resume.styl'

class ResumePage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.t('resume'))
  }

  render() {
    const { t } = this.props
    const resumeInfos = t('resumeInfos', { returnObjects: true })

    console.dir(resumeInfos)

    return (
      <div className="page-resume">
        <h2>{t('resume')}</h2>
        <div className="resume">
          <div className="left">
            <div className="avatar-section">
              <img src="/favicon.png" alt="blackcater" />
            </div>
            <div className="contact-section">
              <h3 className="title">
                {resumeInfos.contact.title.toUpperCase()}
              </h3>
              <div className="contact-item mail">
                <Icon
                  type="mail"
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    marginRight: '0.6em',
                  }}
                />
                {resumeInfos.contact.data.mail}
              </div>
              <div className="contact-item phone">
                <Icon
                  type="phone"
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    marginRight: '0.6em',
                  }}
                />
                {resumeInfos.contact.data.phone}
              </div>
            </div>
            <div className="application-section">
              <h3 className="title">
                {resumeInfos.application.title.toUpperCase()}
              </h3>
              <div className="application">{resumeInfos.application.data}</div>
            </div>
          </div>
          <div className="right" />
        </div>
      </div>
    )
  }
}

export default translate('translation')(ResumePage)
