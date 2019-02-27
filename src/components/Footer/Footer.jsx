import React from 'react';
import { StaticQuery, withPrefix, graphql } from 'gatsby';
import { Icon } from 'components/common';
import cls from 'classnames';
import pick from 'utils/pick';

import './style.less';

export default () => {
  return (
    <StaticQuery
      query={graphql`
        query FooterComponentQuery {
          site {
            siteMetadata {
              title
              description
              website
              siteUrl
              nickname
              slogan
              email
              footer {
                links {
                  name
                  list {
                    name
                    link
                    tag
                  }
                }
              }
            }
          }
        }
      `}
      render={data => (
        <div className="footer">
          <div className="footer__wrapper">
            <div className="footer__logo">
              <div className="title">
                Blog
                <a
                  href={withPrefix('/rss.xml')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon="rss" />
                </a>
              </div>
              <div className="copyright">
                Copyright © 2019 {pick(data, 'site.siteMetadata.nickname')}.
              </div>
            </div>
            <div className="footer__links">
              {(pick(data, 'site.siteMetadata.footer.links') || []).map(
                ({ name, list }) => {
                  return (
                    <div key={name} className="footer__link-list">
                      <div className="title">{name || 'UNKOW'}</div>
                      <ul>
                        {list.map(({ name, link, tag }) => (
                          <li key={name}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {name}
                            </a>
                            {tag && (
                              <div
                                className={cls(['tag', tag && `tag--${tag}`])}
                              >
                                {tag}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};
