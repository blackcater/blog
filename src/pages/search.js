import React from 'react';

import Layout from 'components/Layout';

import { Parallel } from 'components/common';

import './search.less';

const SearchPage = () => (
  <Layout title="Search">
    <div style={{ height: 100, backgroundColor: 'green' }} />
    <Parallel className="search__parallel">
      <Parallel.Line style={{ marginRight: 64 }}>
        <div
          style={{
            height: 4000,
            backgroundImage: 'linear-gradient(to bottom, red, green)',
          }}
        />
      </Parallel.Line>
      <Parallel.Line width={328}>
        <div
          style={{
            height: 1000,
            backgroundImage: 'linear-gradient(to bottom, blue, orange)',
          }}
        />
      </Parallel.Line>
    </Parallel>
    <div style={{ height: 1000, backgroundColor: '#1e1e1e' }} />
  </Layout>
);

export default SearchPage;
