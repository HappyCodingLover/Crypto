import React from 'react';
/*import Header from './Header';*/
import MarketHeader from './MarketHeader/index';

export default function Layout({ children }) {
  return (
    <>
      {/*<Header />*/}
      <MarketHeader />
      {children}
    </>
  );
}
