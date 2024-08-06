import { type FC, useEffect, useRef, useState } from 'react';
import { BiPause, BiPlay } from 'react-icons/bi';
import WaveSurfer from 'wavesurfer.js';

import { classNames, useThemeStore } from '~/shared';

import styles from './WaveForm.module.css';

import { TWaveformProps } from './WaveForm.types';

const Waveform: FC<TWaveformProps> = ({ src, isMyMessage }) => {
  const { theme } = useThemeStore();

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  const createWaveSurfer = () => {
    if (!waveformRef.current) {
      return;
    }

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      barWidth: 2,
      barRadius: 4,
      barGap: 2,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Strange build error
      barMinHeight: 2,
      cursorWidth: 1,
      backend: 'MediaElement',
      height: 23,
      responsive: true,
      cursorColor: 'transparent',
      hideScrollbar: true,
      barHeight: 400,
      waveColor: theme === 'dark' || isMyMessage ? '#fff' : '#000',
      progressColor: isMyMessage ? '#aaaaaa' : '#486cff',
    });

    if (src) {
      wavesurferRef.current.load(src);
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleFinish = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    wavesurferRef.current.on('play', handlePlay);
    wavesurferRef.current.on('pause', handlePause);
    wavesurferRef.current.on('finish', handleFinish);
    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(wavesurferRef.current?.getCurrentTime() ?? 0);
    });
    wavesurferRef.current.on('ready', () => {
      setDuration(wavesurferRef.current?.getDuration() ?? 0);
    });
  };

  useEffect(() => {
    createWaveSurfer();

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [src, theme]);

  const togglePlayPause = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
      if (wavesurferRef.current) {
        wavesurferRef.current.playPause();
      }
    } else if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.root}>
      <button className={classNames(styles.button, isMyMessage && styles.button_my)} onClick={togglePlayPause}>
        {isPlaying ? <BiPause size={40} /> : <BiPlay size={40} />}
      </button>
      <div className={styles.content}>
        <div style={{ width: `${duration * 80}px` }} ref={waveformRef} className={styles.waveform} />
        <p className={classNames(styles.timer, isMyMessage && styles.timer_my)}>
          {isPlaying ? formatTime(currentTime) : formatTime(duration)}
        </p>
      </div>
    </div>
  );
};

export { Waveform };
