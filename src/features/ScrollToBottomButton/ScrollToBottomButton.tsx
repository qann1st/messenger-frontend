import { FC, useEffect, useState } from 'react';
import { GoChevronDown } from 'react-icons/go';

import { classNames } from '~/shared';

import styles from './ScrollToBottomButton.module.css';

import { TScrollToBottomButton } from './ScrollToBottomButton.types';

const ScrollToBottomButton: FC<TScrollToBottomButton> = ({ scrollRef }) => {
  const currentScrollRef = scrollRef.current;
  const [isArrowVisible, setIsArrowVisible] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      if (scrollRef.current.scrollTop < -scrollRef.current.clientHeight) {
        setIsArrowVisible(true);
      } else {
        setIsArrowVisible(false);
      }
    }
  };

  const handleArrowClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ behavior: 'smooth', top: scrollRef.current.clientHeight });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentScrollRef]);

  return (
    <button onClick={handleArrowClick} className={classNames(styles.arrow, isArrowVisible && styles.arrow_visible)}>
      <GoChevronDown size={32} />
    </button>
  );
};

export { ScrollToBottomButton };
