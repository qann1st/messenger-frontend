import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { useMessageInputStore } from '~/features';

import { classNames } from '../helpers';

export const useMessagesListSize = (styles: CSSModuleClasses) => {
  const inputValue = useMessageInputStore(useShallow((state) => state.inputValue));
  const [isVisibleEditMessage, isVisibleReplyMessage] = useMessageStore(
    useShallow((state) => [state.isVisibleEditMessage, state.isVisibleReplyMessage]),
  );

  return classNames(
    inputValue.includes('\n') && styles.root_spacing,
    inputValue.includes('\n') && (isVisibleReplyMessage || isVisibleEditMessage) && styles.root_reply_spacing,
    inputValue.split(/\r?\n/).length - 1 >= 2 && styles.root_spacing_big,
    inputValue.split(/\r?\n/).length - 1 >= 2 &&
      (isVisibleReplyMessage || isVisibleEditMessage) &&
      styles.root_spacing_reply_big,
  );
};
