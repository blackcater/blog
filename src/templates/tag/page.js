import React from 'react';
import Media from 'react-media';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import { Icon } from 'components/common';
import Link from 'components/Link';
import Layout from 'components/Layout';
import Pagination from 'components/Pagination';
import { PostBig, PostSmall } from 'components/Post';

import './style.less';

export default ({ data, pageContext }) => {
  const { tag } = data;
  const posts = pick(data, 'posts.edges').map(x => x.node) || [];
  const header = posts[0];
  const list = posts.slice(1);

  return (
    <Layout title={tag.name} className="tag-page">
      <div className="tag-page__content">
        <div className="tag-page__posts">
          <Media query="(max-width: 768px)">
            {matches =>
              matches && (
                <div className="tag-page__section">
                  <Img
                    className="tag-page__logo"
                    fluid={pick(tag, 'cover.childImageSharp.fluid')}
                  />
                  <div className="tag-page__title">{tag.name}</div>
                  <div className="tag-page__desc">{tag.description}</div>
                  <div className="tag-page__links">
                    {(tag.links || []).map(link => (
                      <Link
                        className="tag-page__link"
                        key={link.url}
                        to={link.url}
                      >
                        <Icon icon={link.icon} />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Media>
          <div className="tag-page__header-post">
            {posts[0] && <PostBig post={header} />}
          </div>
          <div className="tag-page__post-list">
            {list.map(post => (
              <PostSmall key={post.id} post={post} />
            ))}
          </div>
          <Pagination {...pageContext} />
        </div>
        <Media query="(max-width: 768px)">
          {matches =>
            !matches && (
              <div className="tag-page__section">
                <Img
                  className="tag-page__logo"
                  fluid={pick(tag, 'cover.childImageSharp.fluid')}
                />
                <div className="tag-page__title">{tag.name}</div>
                <div className="tag-page__desc">{tag.description}</div>
                <div className="tag-page__links">
                  {(tag.links || []).map(link => (
                    <Link
                      className="tag-page__link"
                      key={link.url}
                      to={link.url}
                    >
                      <Icon icon={link.icon} />
                    </Link>
                  ))}
                </div>
              </div>
            )
          }
        </Media>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query TagPageQuery($posts: [String], $tag: String) {
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
    tag: tagJson(id: { eq: $tag }) {
      id
      name
      description
      cover {
        ... on File {
          childImageSharp {
            fluid(maxWidth: 120, maxHeight: 120) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      links {
        icon
        url
      }
    }
  }
`;
