"use client";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface CodeEditorProps {
  initialCode: string;
  TestCode: Function;
  SubmitCode: Function;
}

const CodeEditor = ({ initialCode, TestCode, SubmitCode }: CodeEditorProps) => {
  const [code, setCode] = useState<string>(initialCode);
  return (
    <div className="h-1/1 flex flex-col justify-between">
      <div className="flex justify-between px-3 py-3 border-b">
        <h1 className="font-bold text-2xl"> Code Editor </h1>
        <div>
          <button
            onClick={() => {
              TestCode(code);
            }}
            className="cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#000a200d] hover:bg-[#000a201a] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-sm rounded-lg ml-2"
          >
            Run
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
          if (value) {
            setCode(value);
          }
        }}
        className="pt-5"
      />
    </div>
  );
};

export default CodeEditor;
