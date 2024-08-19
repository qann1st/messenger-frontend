import { useEffect, useRef, useState } from 'react';

import { useMessageStore } from '~/entities';

import { useOptimistSendMessage } from './useOptimistSendMessage';

export const useRecordAudio = (recipient: string) => {
  const { setIsVisibleReplyMessage, setReplyMessage } = useMessageStore();

  const [isRecording, setIsRecording] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const { sendMessage } = useOptimistSendMessage();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const initRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options: MediaRecorderOptions = { audioBitsPerSecond: 128000 };
      const types = ['audio/webm; codecs=opus', 'audio/ogg; codecs=opus', 'audio/webm', 'audio/ogg'];

      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          options.mimeType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener('start', () => {
        setIsRecording(true);
      });

      mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        if (recordedChunksRef.current.length > 0) {
          const newBlob = new Blob(recordedChunksRef.current, { type: options.mimeType });
          recordedChunksRef.current = [];
          if (newBlob.size > 0) {
            sendAudioToServer(newBlob);
          }
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setIsRecording(false);
      });

      mediaRecorder.start();
    } catch (error) {
      setIsRecording(false);
    }
  };

  const handleStartRecording = () => {
    initRecording();
  };

  const handleStopRecording = () => {
    if (isRecording) {
      setIsCancelled(false);
    }
  };

  useEffect(() => {
    if (mediaRecorderRef.current && isCancelled) {
      mediaRecorderRef.current.stop();
    }
  }, [isCancelled]);

  const handleCancelRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const sendAudioToServer = async (sendBlob: Blob) => {
    if (sendBlob) {
      sendMessage({ size: sendBlob.size, voiceMessage: sendBlob });
      setIsVisibleReplyMessage(false);
      setReplyMessage(null);
    }
  };

  return { isRecording, handleStartRecording, handleStopRecording, handleCancelRecording };
};
