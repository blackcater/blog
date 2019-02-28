import React, { Component } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import Layout from 'components/Layout';
import Pagination from 'components/Pagination';
import Link from 'components/Link';
import { Icon } from 'components/common';
import { PostBig } from 'components/Post';

import './style.less';

class OrganizationPage extends Component {
  render() {
    const { data, pageContext } = this.props;
    const { author } = data;
    const backgroundColor = author.backgroundColor || 'none';
    const posts = pick(data, 'posts.edges').map(x => x.node) || [];

    return (
      <Layout
        className="organization-page"
        autoHidden
        shadow={false}
        headerClassName="organization-page__ceil"
        headerStyle={{
          backgroundColor,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <div className="organization-page__header" style={{ backgroundColor }}>
          <div className="organization-page__header-content">
            <div className="logo">
              <Img fluid={pick(author, 'avatar.childImageSharp.fluid')} />
            </div>
            <div className="slogan">{author.slogan}</div>
          </div>
          <ul className="organization-page__header-links">
            {(author.links || []).map(x => {
              return (
                <li key={x.icon}>
                  <Link to={x.url}>
                    <Icon icon={x.icon} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="organization-page__content">
          {posts.map(node => (
            <PostBig key={node.id} post={node} />
          ))}
          <Pagination {...pageContext} />
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
  query OrganizationPageQuery($posts: [String], $author: String) {
    posts: allMarkdownRemark(
      filter: { id: { in: $posts } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          ...PostBig
        }
      }
    }
    author: authorJson(id: { eq: $author }) {
      id
      nickname
      slogan
      avatar {
        ... on File {
          childImageSharp {
            fluid(cropFocus: CENTER) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      links {
        icon
        url
      }
      backgroundColor
    }
  }
`;

export default OrganizationPage;
