import React from 'react';
/*import Header from './Header';*/
import MarketHeader from './MarketHeader';

export default function Layout({ children }) {
  return (
    <>
      {/*<Header />*/}
      <MarketHeader />
      {children}
    </>
  );
}
