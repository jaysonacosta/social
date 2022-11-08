import React from "react";

import Head from "next/head";

import Nav from "../Nav";

type Props = {
  children: React.ReactNode;
  title: string;
};

const Layout: React.FC<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main>{children}</main>
    </>
  );
};

export default Layout;
