import React, { FunctionComponent, useEffect, useState } from "react";

type SelectorProps = {
  root: HTMLElement;
  onSelect: (element: HTMLElement) => void;
};

export const Selector: FunctionComponent<SelectorProps> = ({
  root,
  onSelect
}) => {
  const [rect, setRect] = useState();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      onSelect(target);
    };
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      setRect(target.getBoundingClientRect());
    };

    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleMouseMove);
    };
  });

  if (!rect) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-gray-600 opacity-50 pointer-events-none text-black"
      style={{
        clipPath: `polygon(0 0, 100% 0, 100% 100%, ${rect.right}px 100%, ${
          rect.right
        }px ${rect.top}px, ${rect.left}px ${rect.top}px, ${rect.left}px ${
          rect.bottom
        }px, ${rect.right}px ${rect.bottom}px, ${rect.right}px 100%, 0 100%)`,
        transition: "all 200ms ease-out"
      }}
    />
  );
};
