import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import pick from 'utils/pick';

import Layout from 'components/Layout';
import Slider from 'components/Slider';

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query IndexPageQuery {
        slider: allMarkdownRemark(
          limit: 3
          skip: 0
          sort: { fields: frontmatter___date, order: DESC }
        ) {
          edges {
            node {
              id
              frontmatter {
                title
                header {
                  ... on File {
                    childImageSharp {
                      fluid(maxWidth: 1200, maxHeight: 500) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <Layout maxWidth={1032}>
        <Slider list={pick(data, 'slider.edges')} />
        <div>Layout</div>
      </Layout>
    )}
  />
);

export default IndexPage;
