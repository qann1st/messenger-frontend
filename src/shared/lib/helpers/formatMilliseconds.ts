export const formatMilliseconds = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const centiseconds = Math.floor((milliseconds % 1000) / 10);

  const formattedMinutes = String(minutes).padStart(1, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedCentiseconds = String(centiseconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds},${formattedCentiseconds}`;
};
