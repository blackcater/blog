import React from 'react';
import { Helmet } from 'react-helmet';

export default ({ children, data: { site: { siteMetadata: metaData } } }) => (
  <div>
    <Helmet>
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
    </Helmet>
    <div>{children()}</div>
  </div>
);

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
`;
