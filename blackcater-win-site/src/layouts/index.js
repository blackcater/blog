import React, { Component } from 'react'
import { Layout, Icon } from 'antd'
import Link from 'gatsby-link'
import { ContainerQuery } from 'react-container-query'
import { Helmet } from 'react-helmet'

import styles from './index.module.less'

const { Header, Content, Footer } = Layout
const mediaQuery = {
  mobile: {
    maxWidth: 600,
  },
}

export default class MainLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuVisible: false,
    }
  }

  handleToggleMenuVisible = () => {
    const { menuVisible } = this.state

    this.setState({
      menuVisible: !menuVisible,
    })
  }

  render() {
    const { children, data: { site: { siteMetadata: metaData } } } = this.props
    const { menuVisible } = this.state

    return (
      <ContainerQuery query={mediaQuery}>
        {
          (params) => {
            const { mobile } = params
            const menuDisplay = (mobile && !menuVisible) ? 'none' : 'block'
            const iconDisplay = !mobile ? 'none' : ''

            return (
              <Layout className={styles.main}>
                <Helmet>
                  <title>{metaData.title}</title>
                  <meta name="description" content={metaData.description} />
                </Helmet>
                <Header className={styles.header}>
                  <div className={styles['header-title']}>
                    <h1>{metaData.nickname}.</h1>
                  </div>
                  <div className={styles['header-menu']}>
                    <Icon
                      type={menuVisible ? "up" : "down"}
                      style={{ fontSize: '20px', color: '#fff', display: iconDisplay }}
                      onClick={this.handleToggleMenuVisible}
                    />
                    <ul className={styles.links} style={{ display: menuDisplay }}>
                      <li className={styles.link}><Link to="/">Home</Link></li>
                      <li className={styles.link}><Link to="/">Resume</Link></li>
                      <li className={styles.link}><Link to="/">About</Link></li>
                      <li className={styles.link}><Link to="/">Tags</Link></li>
                      <li className={styles.link}><Link to="/">Archive</Link></li>
                      <li className={styles.link}><Link to="/">Projects</Link></li>
                    </ul>
                  </div>
                </Header>
                <Content className={styles.content}>
                  {children()}
                </Content>
                <Footer className={styles.footer}>
                  <div className={styles['bg-text']}>contact</div>
                  <div className={styles['footer-content']}>
                    <div className={styles['footer-slogan']}>{metaData.slogan}</div>
                    <div className={styles['footer-email']}>{metaData.email}</div>
                    <div className={styles['footer-social']}>
                      {
                        (metaData.socials || []).map((link, index) =>
                          <a key={index} href={link.url} target="__blank">
                            <Icon className={styles['footer-social--icon']} type={link.type} />
                          </a>
                        )
                      }
                    </div>
                  </div>
                </Footer>
              </Layout>
            )
          }
        }
      </ContainerQuery>
    )
  }
}

export const query = graphql`
  query LayoutData {
    site {
      siteMetadata {
        title
        description
        nickname
        slogan
        email
        socials {
          type
          url
        }
      }
    }
  }
`
