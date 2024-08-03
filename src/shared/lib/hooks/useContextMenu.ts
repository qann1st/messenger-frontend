import { type MouseEvent, useRef, useState } from 'react';

import { useOutsideClick } from './useOutsideClick';

export const useContextMenu = <T = HTMLDivElement>(scrollRef?: React.RefObject<HTMLDivElement>) => {
  const [contextMenu, setContextMenu] = useState({
    position: { x: 0, y: 0 },
    toggled: false,
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  const showContextMenu = (e: MouseEvent<T>) => {
    e.preventDefault();

    if (!contextMenuRef.current) {
      return;
    }

    let x = e.clientX;
    let y = e.clientY;

    const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();
    const scrollOffset = scrollRef?.current ? scrollRef.current.getBoundingClientRect() : { left: 0, top: 0 };

    if (scrollRef?.current) {
      const scrollAttr = scrollRef.current.getBoundingClientRect();

      x = e.clientX - scrollAttr.left + scrollRef.current.scrollLeft;
      y = e.clientY - scrollAttr.top + scrollRef.current.scrollTop;

      console.log('Adjusted X:', x);
      console.log('Adjusted Y:', y);
      console.log('Context Menu Width:', contextMenuAttr.width);
      console.log('Context Menu Height:', contextMenuAttr.height);

      const isLeft = x + contextMenuAttr.width > scrollRef.current.clientWidth + scrollRef.current.scrollLeft;
      const isTop = y + contextMenuAttr.height > scrollRef.current.clientHeight + scrollRef.current.scrollTop;

      console.log('Is Left Overflow:', isLeft);
      console.log('Is Top Overflow:', isTop);

      x = isLeft ? x - contextMenuAttr.width : x;
      y = isTop ? y - contextMenuAttr.height : y;
    } else {
      const isLeft = x + contextMenuAttr.width > window.innerWidth;
      const isTop = y + contextMenuAttr.height > window.innerHeight;

      console.log('Is Left Overflow (Window):', isLeft);
      console.log('Is Top Overflow (Window):', isTop);

      x = isLeft ? x - contextMenuAttr.width : x;
      y = isTop ? y - contextMenuAttr.height : y;
    }

    setContextMenu({
      position: { x, y },
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
