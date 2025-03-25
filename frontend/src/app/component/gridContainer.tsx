"use client";
import ReactGridLayout, { ReactGridLayoutProps } from "react-grid-layout";

const Grid = (props: ReactGridLayoutProps) => {
  const { children, ...gridLayoutProps } = props;
  return <ReactGridLayout {...gridLayoutProps}>{children}</ReactGridLayout>;
};

export default Grid;
