import React from 'react'
import { Layout, Icon } from 'antd'
import Link from 'gatsby-link'

import styles from './index.module.less'

const { Header, Content, Footer } = Layout

export default ({ children, data: { site: { siteMetadata: metaData } } }) => (
  <Layout className={styles.main}>
    <Header className={styles.header}>
      <div className={styles.title}>
        <h1>{metaData.nickname}.</h1>
      </div>
      <div className={styles.menu}>
        <ul className={styles.links}>
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

export const query = graphql`
  query LayoutData {
    site {
      siteMetadata {
        title
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
