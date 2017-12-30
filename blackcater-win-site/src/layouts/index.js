import React from "react"
import { Helmet } from "react-helmet"

import "./index.styl"

export default ({ children, data: { site: { siteMetadata: metaData } } }) => (
  <div>
    <Helmet>
      <title>{metaData.title}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="description" content={metaData.description} />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700"
        rel="stylesheet"
      />
    </Helmet>
    <div>{children()}</div>
  </div>
)

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
