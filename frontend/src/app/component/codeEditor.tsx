"use client";
import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  initialCode: string;
  setCode: Function;
}

const CodeEditor = ({ initialCode, setCode }: CodeEditorProps) => {
  let code = initialCode;
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const onEditorMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    /*editorRef.current?.createDecorationsCollection([
      {
        range: {
          startLineNumber: 4,
          endLineNumber: 4,
          startColumn: 0,
          endColumn: 0,
        },
        options: {
          isWholeLine: true,
          inlineClassName: "underline decoration-red-500 decoration-wavy",
        },
      },
    ]);*/
  };
  return (
    <Editor
      height={"100%"}
      value={code}
      options={{
        fontSize: 14,
        minimap: {
          enabled: false,
        },

        autoClosingBrackets: "languageDefined",
        lineNumbers: "on",
      }}
      onChange={(value) => {
        if (value) {
          setCode(value);
        }
      }}
      className="pt-5"
      onMount={onEditorMount}
    />
  );
};

export default CodeEditor;
