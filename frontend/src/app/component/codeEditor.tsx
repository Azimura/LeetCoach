"use client";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface CodeEditorProps {
  initialCode: string;
}
const CodeEditor = ({ initialCode }: CodeEditorProps) => {
  return (
    <div className="h-1/1 border-1 flex flex-col justify-between">
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
        }}
      />
      <div className="flex justify-end px-3 pb-3">
        <button className="cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#000a200d] hover:bg-[#000a201a] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-sm rounded-lg ml-2">
          Run
        </button>
        <button className="cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#2db55d] hover:bg-[#269a4f] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-white text-sm rounded-lg ml-2">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
