export const formatCreatedTime = (createdAt: string, updatedAt: string, edited: boolean) => {
  const formatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const createdAtFormatted = formatter.format(new Date(createdAt));

  if (edited) {
    const updatedAtFormatted = formatter.format(new Date(updatedAt));

    return `${createdAtFormatted}\nUpdated: ${updatedAtFormatted}`;
  } else {
    return `${createdAtFormatted}`;
  }
};
