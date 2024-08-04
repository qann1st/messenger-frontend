import { MouseEvent, useRef, useState } from 'react';

import { useOutsideClick } from './useOutsideClick';

export const useContextMenu = (scrollRef?: React.RefObject<HTMLDivElement>) => {
  const [contextMenu, setContextMenu] = useState({
    position: { x: 0, y: 0 },
    toggled: false,
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  const showContextMenu = (e: MouseEvent) => {
    if (e instanceof TouchEvent) {
      e.preventDefault();

      if (!contextMenuRef.current) {
        return;
      }

      const touch = e.touches[0];

      let x = touch.clientX;
      let y = touch.clientY;

      const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();

      if (scrollRef?.current) {
        const scrollAttr = scrollRef.current.getBoundingClientRect();

        x = touch.clientX - scrollAttr.left + scrollRef.current.scrollLeft;
        y = touch.clientY - scrollAttr.top + scrollRef.current.scrollTop;

        const isLeft = x + contextMenuAttr.width > scrollRef.current.clientWidth + scrollRef.current.scrollLeft;
        const isTop = y + contextMenuAttr.height > scrollRef.current.clientHeight + scrollRef.current.scrollTop;

        x = isLeft ? x - contextMenuAttr.width : x;
        y = isTop ? y - contextMenuAttr.height : y;
      } else {
        const isLeft = x + contextMenuAttr.width > window.innerWidth;
        const isTop = y + contextMenuAttr.height > window.innerHeight;

        x = isLeft ? x - contextMenuAttr.width : x;
        y = isTop ? y - contextMenuAttr.height : y;
      }

      setContextMenu({
        position: { x, y },
        toggled: true,
      });
    } else {
      e.preventDefault();

      if (!contextMenuRef.current) {
        return;
      }

      const event = e as MouseEvent;

      let x = event.clientX;
      let y = event.clientY;

      const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();

      if (scrollRef?.current) {
        const scrollAttr = scrollRef.current.getBoundingClientRect();

        x = event.clientX - scrollAttr.left + scrollRef.current.scrollLeft;
        y = event.clientY - scrollAttr.top + scrollRef.current.scrollTop;

        const isLeft = x + contextMenuAttr.width > scrollRef.current.clientWidth + scrollRef.current.scrollLeft;
        const isTop = y + contextMenuAttr.height > scrollRef.current.clientHeight + scrollRef.current.scrollTop;

        x = isLeft ? x - contextMenuAttr.width : x;
        y = isTop ? y - contextMenuAttr.height : y;
      } else {
        const isLeft = x + contextMenuAttr.width > window.innerWidth;
        const isTop = y + contextMenuAttr.height > window.innerHeight;

        x = isLeft ? x - contextMenuAttr.width : x;
        y = isTop ? y - contextMenuAttr.height : y;
      }

      setContextMenu({
        position: { x, y },
        toggled: true,
      });
    }
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
