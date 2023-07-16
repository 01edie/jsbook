import React, { useEffect, useRef } from "react";
import "./preview.css";

type Props = {
  code: string;
  err: string;
};

const codeHTML = `
<html>
<head>
<style>
html{
  background-color: #fff;
}
</style>
</head>
<body>
<div id='root'></div>
<script>
const handleError=(err)=>{
  const root= document.querySelector('#root')
  root.innerHTML='<div style="color:red">'+ '<h3>Runtime Error</h3>' + err+ '</div>'
  console.error(err)
}
window.addEventListener('error',e=>{
  e.preventDefault()
  handleError(e.error)
})
window.addEventListener('message',e=>{
  try{
    eval(e.data)
  }catch(err){
    handleError(err)
  }
},false)
</script>
</body>
</html>
`;

function Preview({ code,err }: Props) {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = codeHTML;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 100);
  }, [code]);
  return (
    <div className="preview-container">
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        title="preview"
        srcDoc={codeHTML}
      />
      {err ? <div className="preview-build-error">{err}</div> : null}
    </div>
  );
}

export default Preview;
