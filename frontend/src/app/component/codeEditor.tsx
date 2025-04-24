"use client";
import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  initialCode: string;
  TestCode: Function;
  SubmitCode: Function;
  RefineCode: Function;
  displayRefinedCode: boolean;
  refinedCode: string;
}

const CodeEditor = ({
  initialCode,
  TestCode,
  SubmitCode,
  RefineCode,
  displayRefinedCode,
  refinedCode,
}: CodeEditorProps) => {
  const [code, setCode] = useState<string>(initialCode);
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
    <div className="h-1/1 flex flex-col justify-between">
      <div className="flex justify-between px-3 py-3 border-b">
        <h1 className="font-bold text-2xl text-black"> Code Editor </h1>
        <div>
          <button
            onClick={() => {
              TestCode(code);
            }}
            className="text-black cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#000a200d] hover:bg-[#000a201a] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-sm rounded-lg ml-2"
          >
            Run
          </button>
          <button
            onClick={() => {
              RefineCode(code);
            }}
            className="text-black cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#000a200d] hover:bg-[#000a201a] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-sm rounded-lg ml-2"
          >
            Refine
          </button>
          <button
            onClick={() => {
              SubmitCode(code);
            }}
            className="cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#2db55d] hover:bg-[#269a4f] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-white text-sm rounded-lg ml-2"
          >
            Submit
          </button>
        </div>
      </div>
      {!displayRefinedCode ? (
        <Editor
          height={"100%"}
          defaultLanguage="python"
          defaultValue={initialCode}
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            autoClosingBrackets: "languageDefined",
            lineNumbers: "on",
          }}
          onChange={(value) => {
            if (value != undefined) {
              setCode(value);
            }
          }}
          className="pt-5"
          onMount={onEditorMount}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CodeEditor;
