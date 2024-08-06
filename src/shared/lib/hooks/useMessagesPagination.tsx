import { RefObject, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ChatWithPagination, groupMessagesByDate, messengerApi } from '~/shared';

export const useMessagePagination = (
  dialogId: string | undefined,
  scrollRef: RefObject<HTMLDivElement>,
  pageSize = 30,
) => {
  const [page, setPage] = useState(2);
  const [isFetching, setIsFetching] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isFetching) {
      messengerApi.getChatMessages(dialogId ?? '', page, pageSize).then((newMessages) => {
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
      });
    }
  }, [isFetching]);

  const scrollHandler = () => {
    if (
      scrollRef.current &&
      scrollRef.current.scrollHeight - Math.abs(scrollRef.current.scrollTop - scrollRef.current.clientHeight) < 200
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
  }, []);

  return { isFetching, setPage };
};
