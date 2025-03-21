"use client";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

const CodeEditor = () => {
  return (
    <Editor
      height="100%"
      width={"100%"}
      defaultLanguage="python"
      defaultValue="// some comment"
      options={{
        fontSize: 16,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};

export default CodeEditor;
