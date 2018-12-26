import React from 'react';

import Layout from 'components/Layout';
import Header from 'components/Header';
import { Popover } from 'components/common';

import { getAttribute, setAttribute } from 'utils/attribute';

function toggleTheme(t) {
  const $html = document.getElementsByTagName('html')[0];
  const themes = ['light', 'dark'];
  const theme = getAttribute($html, 'theme', 'light');

  if (theme === t) return;

  const newTheme =
    themes.indexOf(t) !== -1
      ? t
      : themes[(themes.indexOf(theme) + 1) % themes.length];

  setAttribute($html, 'theme', newTheme);
}

const IndexPage = () => (
  <Layout>
    <Header title="Home" />
    <div style={{ marginTop: 100 }}>hello world</div>
    <button onClick={toggleTheme}>更换主题</button>
    <Popover reference={<div style={{ margin: 100 }}>show</div>}>
      <div>hahaha</div>
    </Popover>
  </Layout>
);

export default IndexPage;
