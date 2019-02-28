import React, { PureComponent } from 'react';
import { StaticQuery, graphql } from 'gatsby';

import Layout from 'components/Layout';

import './404.less';

class NotFoundPage extends PureComponent {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query NotFoundPageQuery {
            svg: file(relativePath: { eq: "404.svg" }) {
              publicURL
            }
          }
        `}
        render={({ svg }) => (
          <Layout title="Not Fond" class="notfound-page">
            <div className="notfound-page__wrap">
              <img src={svg.publicURL} alt="404" />

              <div className="notfound-page__content">
                <h1>NOT FOUND</h1>
                <p>Oops, please see other pages.</p>
              </div>
            </div>
          </Layout>
        )}
      />
    );
  }
}

export default NotFoundPage;
