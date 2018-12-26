import React from 'react';

import Layout from 'components/Layout';
import Header from 'components/Header';
import { Dropdown } from 'components/common';

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
    <div style={{ marginLeft: 50 }}>
      <Dropdown reference={<button>我</button>} placement="bottom-end">
        <Dropdown.Item name="1">Become a member</Dropdown.Item>
        <Dropdown.Line />
        <Dropdown.Item name="2">New stories</Dropdown.Item>
        <Dropdown.Item name="3">Stories</Dropdown.Item>
        <Dropdown.Item name="4">Series</Dropdown.Item>
        <Dropdown.Item name="5">Stats</Dropdown.Item>
        <Dropdown.Line />
        <Dropdown.Item name="6">Profile</Dropdown.Item>
        <Dropdown.Item name="7">Setting</Dropdown.Item>
        <Dropdown.Item name="8">Help</Dropdown.Item>
        <Dropdown.Item name="9">Logout</Dropdown.Item>
      </Dropdown>
    </div>
  </Layout>
);

export default IndexPage;
