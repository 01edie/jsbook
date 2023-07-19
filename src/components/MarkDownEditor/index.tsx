import React, { useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import './markdownEditor.css'
type Props = {};

export default function MarkdownEditor({}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        event.target &&
        ref.current &&
        ref.current.contains(event.target as Node)
      )
        return;

      setIsEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  });
  if (isEditing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor />
      </div>
    );
  }

  return (
    <div className="text-editor" onClick={() => setIsEditing(true)}>
      <MDEditor.Markdown source="#  Test" />
    </div>
  );
}
