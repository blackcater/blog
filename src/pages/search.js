import React, { PureComponent } from 'react';
import { push } from 'gatsby';
import ContentLoader from 'react-content-loader';
import algoliasearch from 'algoliasearch';
import cls from 'classnames';
import debounce from 'utils/debounce';
import qs from 'utils/queryparse';

import Layout from 'components/Layout';
import Search from 'components/Search';
import Pagination from 'components/Pagination';
import Link from 'components/Link';
import ThemeContext from 'components/ThemeContext';

import './search.less';

const client = algoliasearch(
  process.env.GATSBY_ALGOLIA_APPID,
  process.env.GATSBY_ALGOLIA_SEARCHKEY
);
const postsDB = client.initIndex('posts');
const authorDB = client.initIndex('author');
const tagsDB = client.initIndex('tag');
const seriesDB = client.initIndex('series');

const TABS = {
  POSTS: 'posts',
  AUTHORS: 'authors',
  TAGS: 'tags',
  SERIES: 'series',
};
const PAGE_SIZE = 2;

class SearchPage extends PureComponent {
  constructor(props) {
    super(props);

    const { q, tab, ...params } = qs.parse(this.props.location.search);

    this.state = {
      params,
      persist: !q,
      loading: !!q,
      searchVal: q || '',
      activeTab: tab || TABS.POSTS,
      tabs: [
        { label: 'Posts', value: TABS.POSTS },
        { label: 'Series', value: TABS.SERIES },
        { label: 'Authors', value: TABS.AUTHORS },
        { label: 'Tags', value: TABS.TAGS },
      ],
      posts: [],
      authors: [],
      tags: [],
      series: [],
      pagination: {},
    };

    this._searchByAlgolia = debounce(this._searchByAlgolia, 1000);
  }

  componentDidMount() {
    const { persist } = this.state;

    if (!persist) {
      this._searchByAlgolia();
    }
  }

  _handleTabChange = tab => {
    const { searchVal, params } = this.state;

    push(`/search?q=${searchVal}&ab=${tab.value}&page=0`);

    this.setState(
      {
        activeTab: tab.value,
        loading: true,
        [tab.value]: [],
        params: {
          ...params,
          page: 0,
        },
      },
      () => this._searchByAlgolia()
    );
  };

  _handlePrevPage = () => {
    const { activeTab, params } = this.state;

    this.setState(
      {
        loading: true,
        [activeTab]: [],
        params: {
          ...params,
          page: parseInt(params.page) - 1,
        },
      },
      () => this._searchByAlgolia()
    );
  };

  _handleNextPage = () => {
    const { activeTab, params } = this.state;

    this.setState(
      {
        loading: true,
        [activeTab]: [],
        params: {
          ...params,
          page: parseInt(params.page) + 1,
        },
      },
      () => this._searchByAlgolia()
    );
  };

  _handleSearchChange = e => {
    this.setState({ searchVal: e.target.value, loading: true }, () =>
      this._searchByAlgolia()
    );
  };

  _searchByAlgolia() {
    const { activeTab, searchVal, params } = this.state;
    const query = {
      ...params,
      query: searchVal,
      hitsPerPage: PAGE_SIZE,
    };
    let db = null;

    if (!searchVal) {
      this.setState({ loading: false });
      return;
    }

    if (activeTab === TABS.POSTS) {
      db = postsDB;
    } else if (activeTab === TABS.SERIES) {
      db = seriesDB;
    } else if (activeTab === TABS.AUTHORS) {
      db = authorDB;
    } else if (activeTab === TABS.TAGS) {
      db = tagsDB;
    } else {
      return;
    }

    this.setState({
      loading: true,
      [activeTab]: [],
    });

    db.search(query, (err, content) => {
      if (err) {
        this.setState({ loading: false });

        window.alert('Occur an error, please try again!');

        return;
      }

      const { nbPages, page } = content;
      const nextPage = nbPages > page + 1 && page + 1;
      const prevPage = 0 <= page - 1 && page - 1;

      this.setState({
        persist: false,
        loading: false,
        [activeTab]: content.hits || [],
        pagination: {
          curr: page,
          prev:
            typeof prevPage === 'number' &&
            `/search?q=${searchVal}&tab=${activeTab}&page=${prevPage}`,
          next:
            typeof nextPage === 'number' &&
            `/search?q=${searchVal}&tab=${activeTab}&page=${nextPage}`,
        },
      });
    });
  }

  _renderPosts = () => {
    const { loading, posts } = this.state;

    return (
      <div className="search-page__posts">
        {loading &&
          this._renderLoading({
            width: 800,
            height: 383,
            children: (
              <>
                <rect x="0" y="0" rx="0" ry="0" width="800" height="220" />
                <rect x="0" y="241" rx="3" ry="3" width="700" height="32" />
                <rect x="0" y="289" rx="3" ry="3" width="800" height="16" />
                <rect x="0" y="313" rx="3" ry="3" width="450" height="16" />
                <rect x="0" y="345" rx="3" ry="3" width="40" height="18" />
                <rect x="720" y="345" rx="3" ry="3" width="80" height="18" />
              </>
            ),
          })}
        {posts.length === 0 && this._renderEmpty()}
        {posts.map(post => (
          <div className="search-page__post" key={post.objectID}>
            <Link to={post.slug}>
              <div className="search-page__post__cover">
                <div style={{ backgroundImage: `url(${post.cover})` }} />
              </div>
              <div className="search-page__post__title">{post.title}</div>
              <div className="search-page__post__excerpt">{post.excerpt}</div>
            </Link>
            <div className="search-page__post__footer">
              <div className="date">{post.date}</div>
              <div className="ttr">{post.timeToRead} min read</div>
            </div>
          </div>
        ))}
        {this._renderPagination()}
      </div>
    );
  };

  _renderSeries = () => {
    const { loading, series } = this.state;

    return (
      <div className="search-page__series">
        {loading &&
          this._renderLoading({
            width: 800,
            height: 160,
            children: (
              <>
                <rect x="0" y="0" rx="5" ry="5" width="120" height="160" />
                <rect x="140" y="21" rx="3" ry="3" width="300" height="32" />
                <rect x="140" y="102" rx="3" ry="3" width="660" height="20" />
                <rect x="140" y="126" rx="3" ry="3" width="400" height="20" />
              </>
            ),
          })}
        {series.length === 0 && this._renderEmpty()}
        {series.map(series => (
          <div className="search-page__series-item" key={series.objectID}>
            <Link to={series.slug}>
              <div className="search-page__series-item__cover">
                <div style={{ backgroundImage: `url(${series.cover})` }} />
              </div>
              <div className="search-page__series-item__content">
                <div className="search-page__series-item__title">
                  {series.name}
                </div>
                <div className="search-page__series-item__desc">
                  {series.description}
                </div>
              </div>
            </Link>
          </div>
        ))}
        {this._renderPagination()}
      </div>
    );
  };

  _renderAuthors = () => {
    const { loading, authors } = this.state;

    return (
      <div className="search-page__authors">
        {loading &&
          this._renderLoading({
            width: 800,
            height: 120,
            children: (
              <>
                <rect x="0" y="0" rx="60" ry="60" width="120" height="120" />
                <rect x="140" y="21" rx="3" ry="3" width="300" height="32" />
                <rect x="140" y="86" rx="3" ry="3" width="500" height="20" />
              </>
            ),
          })}
        {authors.length === 0 && this._renderEmpty()}
        {authors.map(author => (
          <div className="search-page__author-item" key={author.objectID}>
            <Link to={author.slug}>
              <div className="search-page__author-item__cover">
                <div style={{ backgroundImage: `url(${author.avatar})` }} />
              </div>
              <div className="search-page__author-item__content">
                <div className="search-page__author-item__nickname">
                  {author.nickname}
                </div>
                <div className="search-page__author-item__slogan">
                  {author.slogan}
                </div>
              </div>
            </Link>
          </div>
        ))}
        {this._renderPagination()}
      </div>
    );
  };

  _renderTags = () => {
    const { tags } = this.state;

    return (
      <div className="search-page__tags">
        {this._renderLoading({
          width: 800,
          height: 120,
          children: (
            <>
              <rect x="0" y="0" rx="60" ry="60" width="120" height="120" />
              <rect x="140" y="21" rx="3" ry="3" width="300" height="32" />
              <rect x="140" y="86" rx="3" ry="3" width="500" height="20" />
            </>
          ),
        })}
        {tags.length === 0 && this._renderEmpty()}
        {tags.map(tag => (
          <div className="search-page__tag-item" key={tag.objectID}>
            <Link to={tag.slug}>
              <div className="search-page__tag-item__cover">
                <div style={{ backgroundImage: `url(${tag.cover})` }} />
              </div>
              <div className="search-page__tag-item__content">
                <div className="search-page__tag-item__name">{tag.name}</div>
                <div className="search-page__tag-item__desc">
                  {tag.description}
                </div>
              </div>
            </Link>
          </div>
        ))}
        {this._renderPagination()}
      </div>
    );
  };

  _renderLoading = ({ children, ...props }) => {
    const { loading } = this.state;

    return (
      loading && (
        <ThemeContext.Consumer>
          {theme => (
            <ContentLoader
              {...props}
              primaryColor={theme === 'light' ? '#f7f7f7' : '#777777'}
              secondaryColor={theme === 'light' ? '#fafafa' : '#828282'}
            >
              {children}
            </ContentLoader>
          )}
        </ThemeContext.Consumer>
      )
    );
  };

  _renderEmpty = () => {
    const { loading } = this.state;

    return !loading && <div className="search-page__placeholder">Empty</div>;
  };

  _renderPagination = () => {
    const { loading, pagination } = this.state;

    return (
      !loading && (
        <Pagination
          {...pagination}
          onPrev={this._handlePrevPage}
          onNext={this._handleNextPage}
        />
      )
    );
  };

  render() {
    const { persist, loading, searchVal, tabs, activeTab } = this.state;

    return (
      <Layout className="search-page">
        <div className="search-page__content">
          <div className="search-page__search">
            <Search
              loading={loading}
              value={searchVal}
              placeholder="Search Blog"
              onChange={this._handleSearchChange}
            />
          </div>
          {!persist && (
            <div className="search-page__result">
              <div className="search-page__tabs">
                {tabs.map(tab => (
                  <div
                    className={cls([
                      'search-page__tab',
                      activeTab === tab.value && 'search-page__tab--active',
                    ])}
                    key={tab.value}
                    onClick={() => this._handleTabChange(tab)}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <div className="search-page__list">
                {/* Posts */}
                {activeTab === TABS.POSTS && this._renderPosts()}

                {/* Series */}
                {activeTab === TABS.SERIES && this._renderSeries()}

                {/* Authors */}
                {activeTab === TABS.AUTHORS && this._renderAuthors()}

                {/* Tags */}
                {activeTab === TABS.TAGS && this._renderTags()}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }
}

export default SearchPage;
