import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { useMessageInputStore } from '~/features';

import { classNames } from '../helpers';

export const useMessagesListSize = (styles: CSSModuleClasses) => {
  const inputValue = useMessageInputStore(useShallow((state) => state.inputValue));
  const [isVisibleEditMessage, isVisibleReplyMessage, isVisibleForwardMessage] = useMessageStore(
    useShallow((state) => [state.isVisibleEditMessage, state.isVisibleReplyMessage, state.isVisibleForwardMessage]),
  );
  const isVisible = isVisibleReplyMessage || isVisibleEditMessage || isVisibleForwardMessage;
  const hasSpacing = inputValue.includes('\n');
  const hasBigSpacing = inputValue.split(/\r?\n/).length - 1 >= 2;

  return classNames(
    hasSpacing && styles.root_spacing,
    isVisible && styles.root_reply,
    hasSpacing && isVisible && styles.root_reply_spacing,
    hasBigSpacing && isVisible && styles.root_spacing_reply_big,
    hasBigSpacing && styles.root_spacing_big,
  );
};
