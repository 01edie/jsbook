import  { useState, useEffect } from "react";

import CodeEditor from "../CodeEditor/CodeEditor";
import Preview from "../Preview/Preview";
import bundle from "../../bundler";
import Resizable from "../Resizable";

function CodeCell() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [err, setErr] = useState("");


  useEffect(()=>{
    const timer = setTimeout(async()=>{
      const output = await bundle(input);
      setOutput(output.code);
      setErr(output.error)
    },1000)
    return ()=>{
      clearTimeout(timer)
    }
  },[input])
  

  return (
    <Resizable direction="vertical">
      <div style={{display:'flex',height:'100%'}}>
      <Resizable direction="horizontal">
      <CodeEditor
        initialValue="const test=1"
        onChange={(value) => setInput(value)}
      /></Resizable>
     
      <Preview code={output} err={err}/>
      </div>
    </Resizable>
  );
}

export default CodeCell;
