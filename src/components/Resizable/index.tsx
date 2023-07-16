import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./resizable.css";
type Props = {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
};

export default function Resizable({ direction, children }: Props) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [width, setWidth] = useState(dimensions.width * 0.5);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        if (window.innerWidth * 0.75 < width)
          setWidth(window.innerWidth * 0.75);
      }, 100);
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width]);
  let resizableProps: ResizableBoxProps;
  if (direction === "vertical") {
    resizableProps = {
      minConstraints: [Infinity, 48],
      maxConstraints: [Infinity, dimensions.height * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
    };
  } else {
    resizableProps = {
      className: "resizable-horizontal",
      minConstraints: [dimensions.width * 0.3, Infinity],
      maxConstraints: [dimensions.width * 0.75, Infinity],
      height: Infinity,
      width,
      resizeHandles: ["e"],
      onResizeStop: (_e, data) => {
        setWidth(data.size.width);
      },
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
}
