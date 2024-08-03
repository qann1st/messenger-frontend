export const formatOnlineDate = (dateTimeString: string | number): string => {
  const now = new Date();
  const date = new Date(dateTimeString);

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return relativeTimeFormatter.format(-diffInSeconds, 'seconds');
  } else if (diffInMinutes < 60) {
    return relativeTimeFormatter.format(-diffInMinutes, 'minutes');
  } else if (diffInHours < 24) {
    return relativeTimeFormatter.format(-diffInHours, 'hours');
  } else if (diffInDays < 2) {
    const timeFormatter = new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `yesterday at ${timeFormatter.format(date)}`;
  } else {
    const dateFormatter = new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return dateFormatter.format(date);
  }
};
