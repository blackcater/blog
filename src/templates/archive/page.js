import React from 'react';
import { Link, graphql } from 'gatsby';
import pick from 'utils/pick';

import Layout from 'components/Layout';
import Pagination from 'components/Pagination';

import './style.less';

export default ({ data, pageContext }) => {
  const posts = pick(data, 'posts.edges').map(x => x.node) || [];
  const yearsMap = {};
  let years = [];

  posts.forEach(post => {
    const year = pick(post, 'frontmatter.year');

    if (!yearsMap[year]) {
      yearsMap[year] = [];
      years.push(year);
    }

    yearsMap[year].push(post);
  });

  years = years.map(year => ({ year, posts: yearsMap[year] }));

  return (
    <Layout className="archive-page">
      <div className="archive-page__content">
        {years.map(({ year, posts }) => (
          <div key={year} className="archive-page__year">
            <div className="archive-page__year__title">{year}</div>
            {posts.map(post => (
              <div key={post.id} className="archive-page__post">
                <div className="archive-page__post__date">
                  {pick(post, 'frontmatter.date')}
                </div>
                <div className="archive-page__post__title">
                  <Link to={pick(post, 'fields.slug')}>
                    {pick(post, 'frontmatter.title')}
                  </Link>
                </div>
                <div className="archive-page__post__author">
                  <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
                    {pick(post, 'frontmatter.author.nickname')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ))}
        <Pagination {...pageContext} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ArchivePageQuery($posts: [String]) {
    posts: allMarkdownRemark(
      filter: { id: { in: $posts } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          excerpt
          frontmatter {
            title
            year: date(formatString: "YYYY")
            date: date(formatString: "MMM D")
            author {
              id
              nickname
            }
          }
        }
      }
    }
  }
`;
