"use client"
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

const CodeEditor = () => {
    return (
        <Editor height="90vh" defaultLanguage="python" defaultValue="// some comment" />
    )
}

export default CodeEditor
