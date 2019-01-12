import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import { Icon } from 'components/common';
import Link from 'components/Link';
import Layout from 'components/Layout';
import Pagination from 'components/Pagination';
import { PostCard } from 'components/Post';

import './style.less';

export default ({ data, pageContext }) => {
  const { author } = data;
  const posts = pick(data, 'posts.edges').map(x => x.node) || [];

  return (
    <Layout className="author-page">
      <div className="author-page__content">
        <div className="author-page__header">
          <Img
            className="author-page__avatar"
            fluid={pick(author, 'avatar.childImageSharp.fluid')}
          />
          <div className="author-page__info">
            <div className="author-page__info-top">
              <div className="author-page__nickname">
                {pick(author, 'nickname')}
              </div>
              <div className="author-page__slogan">
                {pick(author, 'slogan')}
              </div>
            </div>
            <div className="author-page__info-bottom">
              {(author.links || []).map(link => (
                <Link
                  className="author-page__link"
                  key={link.url}
                  to={link.url}
                >
                  <Icon icon={link.icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="author-page__posts">
          <div className="author-page__posts-title">Latest</div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination {...pageContext} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query AuthorPageQuery($posts: [String], $author: String) {
    posts: allMarkdownRemark(
      filter: { id: { in: $posts } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          ...PostCard
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
    }
  }
`;
