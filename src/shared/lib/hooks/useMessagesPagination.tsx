import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { ChatWithPagination, groupMessagesByDate, messengerApi } from '~/shared';

export const useMessagePagination = (dialogId: string | undefined, pageSize = 30) => {
  const scrollRef = useMessageStore(useShallow((state) => state.scrollRef));

  const [isFetching, setIsFetching] = useState(false);
  const pageRef = useRef(2);
  console.log(scrollRef);

  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData(['chat', dialogId]);

  useEffect(() => {
    if (isFetching) {
      const fetchMessages = async () => {
        try {
          const newMessages = await messengerApi.getChatMessages(dialogId ?? '', pageRef.current, pageSize);
          queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
            if (!oldData) {
              return {};
            }

            return {
              ...oldData,
              data: [...oldData.data, ...newMessages.data],
              groupedMessages: groupMessagesByDate([...oldData.data, ...newMessages.data]),
              total: newMessages.total,
            };
          });
          pageRef.current += 1;
        } finally {
          setIsFetching(false);
        }
      };

      fetchMessages();
    }
  }, [isFetching]);

  const scrollHandler = () => {
    const messages = queryClient.getQueryData<ChatWithPagination>(['chat', dialogId]);

    if (
      scrollRef.current &&
      scrollRef.current.scrollHeight - Math.abs(scrollRef.current.scrollTop - scrollRef.current.clientHeight) < 100 &&
      messages &&
      messages.total > messages.data.length
    ) {
      setIsFetching(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', scrollHandler);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [queryData]);

  const loadMorePages = async (pagesToLoad: number) => {
    const newMessages = await messengerApi.getChatMessages(
      dialogId ?? '',
      pageRef.current,
      pageSize,
      pageSize * pagesToLoad,
    );
    queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
      if (!oldData) {
        return {};
      }

      return {
        ...oldData,
        data: [...oldData.data, ...newMessages.data],
        groupedMessages: groupMessagesByDate([...oldData.data, ...newMessages.data]),
        total: newMessages.total,
      };
    });
    pageRef.current += pagesToLoad;
  };

  return { isFetching, loadMorePages };
};
