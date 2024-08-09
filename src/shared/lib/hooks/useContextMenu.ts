import { MouseEvent, useEffect, useRef, useState } from 'react';

import { useOutsideClick } from './useOutsideClick';

export const useContextMenu = (scrollRef?: React.RefObject<HTMLDivElement>) => {
  const [contextMenu, setContextMenu] = useState({
    position: { x: 0, y: 0 },
    toggled: false,
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (clientX: number, clientY: number) => {
    if (!contextMenuRef.current) {
      return { x: clientX, y: clientY };
    }

    const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();
    let x = clientX;
    let y = clientY;

    if (scrollRef?.current) {
      const scrollAttr = scrollRef.current.getBoundingClientRect();
      x = clientX - scrollAttr.left + scrollRef.current.scrollLeft;
      y = clientY - scrollAttr.top + scrollRef.current.scrollTop;

      // Check if context menu overflows to the right or bottom
      const isLeft = x + contextMenuAttr.width > scrollRef.current.clientWidth + scrollRef.current.scrollLeft;
      const isTop = y + contextMenuAttr.height > scrollRef.current.clientHeight + scrollRef.current.scrollTop;

      x = isLeft ? x - contextMenuAttr.width : x;
      y = isTop ? y - contextMenuAttr.height : y;
    } else {
      // Check if context menu overflows to the right or bottom
      const isLeft = x + contextMenuAttr.width > window.innerWidth;
      const isTop = y + contextMenuAttr.height > window.innerHeight;

      x = isLeft ? x - contextMenuAttr.width : x;
      y = isTop ? y - contextMenuAttr.height : y;
    }

    return { x, y };
  };

  const showContextMenu = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();

    let x: number, y: number;

    if (e instanceof TouchEvent) {
      const touch = e.touches[0];
      ({ clientX: x, clientY: y } = touch);
    } else {
      const event = e as MouseEvent;
      ({ clientX: x, clientY: y } = event);
    }

    const position = calculatePosition(x, y);

    setContextMenu({
      position,
      toggled: true,
    });
  };

  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, toggled: false }));
  };

  useOutsideClick(contextMenuRef, hideContextMenu, contextMenu.toggled);

  return {
    contextMenu,
    contextMenuRef,
    showContextMenu,
    hideContextMenu,
  };
};
