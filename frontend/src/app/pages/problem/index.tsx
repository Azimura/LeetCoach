"use client";
import ReactGridLayout from "react-grid-layout";
import { useEffect, useState } from "react";
import CodeEditor from "@/app/component/codeEditor";

const Problem = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const layout = [
    { i: "Problem Details", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "Code Editor", x: 1, y: 0, w: 1, h: 1, static: true },
    { i: "Result", x: 2, y: 1, w: 1, h: 1, static: true },
  ];
  return (
    <main>
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={2}
        width={windowSize.width}
        rowHeight={windowSize.height / 2}
        preventCollision
        allowOverlap={false}
      >
        <div key={"Problem Details"}>
          <h1>Problem</h1>
        </div>
        <div key={"Code Editor"}>
          <CodeEditor />
        </div>
        <div key={"Result"}>
          <h1> Result </h1>
        </div>
      </ReactGridLayout>
    </main>
  );
};

export default Problem;
