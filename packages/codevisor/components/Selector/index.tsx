import React, { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type SelectorProps = {
  onHover: (element: HTMLElement) => void;
  onSelect: (element: HTMLElement) => void;
  root: HTMLElement;
  target?: HTMLElement;
};

export const Selector: FunctionComponent<SelectorProps> = ({
  onHover,
  onSelect,
  root,
  target
}) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      onSelect(event.target as HTMLElement);
    };

    const handleMouseMove = (event: MouseEvent) => {
      onHover(event.target as HTMLElement);
    };

    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleMouseMove);
    };
  });

  if (!target) {
    return null;
  }

  const { top, right, bottom, left } = target.getBoundingClientRect();
  const width = right - left;
  const height = bottom - top;

  return createPortal(
    <div
      className="fixed pointer-events-none z-40 border-blue-500 border border-dashed"
      style={{
        left: `calc(16rem + ${left}px)`,
        height,
        width,
        top,
        transition: "all 200ms ease-in-out"
      }}
    >
      <label className="absolute text-white font-mono text-xs bg-blue-500 px-1 py-px -mt-5 -ml-px rounded-t truncate max-w-full">
        {target.tagName.toLowerCase()}
        <small className="text-blue-200">
          {typeof target.className === "string"
            ? `.${target.className.split(" ").join(".")}`
            : null}
        </small>
      </label>
      <div className="w-full h-full bg-blue-100 opacity-50" />
    </div>,
    document.body
  );
};