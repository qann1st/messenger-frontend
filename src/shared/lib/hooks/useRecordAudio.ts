import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import { useUserStore } from '~/shared';

export const useRecordAudio = (recipient: string) => {
  const { replyMessage, setIsVisibleReplyMessage, setReplyMessage } = useMessageStore();
  const { socket } = useUserStore();

  const [isRecording, setIsRecording] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const { dialogId } = useParams();

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
        if (!isCancelled && recordedChunksRef.current.length > 0) {
          const newBlob = new Blob(recordedChunksRef.current, { type: options.mimeType });
          recordedChunksRef.current = [];

          if (newBlob.size > 0) {
            sendAudioToServer(newBlob);
          }
        }

        if (isCancelled) {
          setIsCancelled(false);
        }
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
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (mediaRecorderRef.current && isCancelled) {
      mediaRecorderRef.current.stop();
    }
  }, [isCancelled]);

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
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
      setIsVisibleReplyMessage(false);
      setReplyMessage(null);
    }
  };

  return { isRecording, handleStartRecording, handleStopRecording, handleCancelRecording };
};
