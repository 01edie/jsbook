import React, { useRef } from "react";
import MonacoEditor, { EditorDidMount, } from "@monaco-editor/react";
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import './CodeEditor.css'

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const codeEditorRef = useRef<any>();
  const onEditorMount: EditorDidMount = (getValue, monacoEditor) => {
    codeEditorRef.current=monacoEditor
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const formatCode = () => {
    const unFormatted = codeEditorRef.current.getModel().getValue()
    const formatted = prettier.format(unFormatted,{
        parser:'babel',
        plugins:[parser],
        useTabs:false,
        semi:true,
        singleQuote:true,
    }).replace(/\n$/,'')
    codeEditorRef.current.setValue(formatted)
  };
  return (
    <div className="editor-wrapper">
      <button className="button button-format is-primary is-small" onClick={formatCode}>format</button>
      <MonacoEditor
        height='100%'
        value={initialValue}
        editorDidMount={onEditorMount}
        language="javascript"
        theme="dark"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
