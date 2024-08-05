import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import { useUserStore } from '~/shared';

import { MessageInput } from '../MessageInput';
import { TAudioInputProps } from './AudioInput.types';

const AudioInput: FC<TAudioInputProps> = ({ recipient }) => {
  const { setIsAudioMessage, replyMessage, setIsVisibleReplyMessage, setReplyMessage, inputValue, setInputValue } =
    useMessageStore();
  const { socket } = useUserStore();

  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationIdRef = useRef<number | null>(null);

  const { dialogId } = useParams();

  useEffect(() => {
    const initRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options: MediaRecorderOptions = { audioBitsPerSecond: 128000 };

        const types = ['audio/webm; codecs=opus', 'audio/ogg; codecs=opus', 'audio/webm', 'audio/ogg'];

        for (const type of types) {
          if (MediaRecorder.isTypeSupported(type)) {
            options.mimeType = type;
            break;
          }
        }

        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyzerRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyzerRef.current);

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        });

        mediaRecorder.addEventListener('stop', () => {
          cancelAnimationFrame(animationIdRef.current ?? 1);
          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
          const newBlob = new Blob(recordedChunksRef.current, { type: options.mimeType });
          recordedChunksRef.current = [];

          if (newBlob) {
            sendAudioToServer(newBlob);
          }
        });

        setIsRecording(true);
        mediaRecorder.start();
      } catch (error) {
        console.error('Error accessing microphone', error);
      }
    };

    initRecording();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      recordedChunksRef.current = [];
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (sendBlob: Blob) => {
    if (sendBlob) {
      socket?.emit('message', {
        recipient,
        chatId: dialogId,
        replyMessage: replyMessage?.id,
        voiceMessage: sendBlob,
        size: sendBlob.size,
      });
      setIsAudioMessage(false);
      setIsVisibleReplyMessage(false);
      setReplyMessage(null);
    }
  };

  return (
    <MessageInput
      isVoice
      onStopRecording={handleStopRecording}
      onCancelRecording={handleCancelRecording}
      inputValue={inputValue}
      setInputValue={setInputValue}
      recipient={recipient}
    />
  );
};

export { AudioInput };
