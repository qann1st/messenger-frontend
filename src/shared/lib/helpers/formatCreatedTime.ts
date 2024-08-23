export const formatCreatedTime = (createdAt: string, updatedAt: string) => {
  const formatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  if (!createdAt || !updatedAt) {
    return 'Invalid date';
  }

  const createdAtFormatted = formatter.format(new Date(createdAt));

  if (updatedAt !== createdAt) {
    const updatedAtFormatted = formatter.format(new Date(updatedAt));

    return `${createdAtFormatted}\nUpdated: ${updatedAtFormatted}`;
  } else {
    return `${createdAtFormatted}`;
  }
};
