import { MouseEvent, useRef, useState } from 'react';

import { useOutsideClick } from './useOutsideClick';

export const useContextMenu = <T extends HTMLElement = HTMLDivElement>(scrollRef?: React.RefObject<T>) => {
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

      const isLeft = x + contextMenuAttr.width > scrollAttr.width + scrollRef.current.scrollLeft;
      const isTop = y + contextMenuAttr.height > scrollAttr.height + scrollRef.current.scrollTop;

      if (isLeft) {
        x = Math.max(scrollRef.current.scrollLeft, x - contextMenuAttr.width);
      }
      if (isTop) {
        y = Math.max(scrollRef.current.scrollTop, y - contextMenuAttr.height) + 20;
      }
    } else {
      const isLeft = x + contextMenuAttr.width > window.innerWidth;
      const isTop = y + contextMenuAttr.height > window.innerHeight;

      if (isLeft) {
        x = Math.max(0, x - contextMenuAttr.width);
      }
      if (isTop) {
        y = Math.max(0, y - contextMenuAttr.height);
      }
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
