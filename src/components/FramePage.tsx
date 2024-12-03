import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface FramePageProps {
  src: string;
}

export default function FramePage({ src }: FramePageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const resizeIframe = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    const handleFrameNavigation = (event: MessageEvent) => {
      if (event.data && event.data.type === 'frameNavigation') {
        navigate(event.data.path);
      }
    };

    window.addEventListener('message', handleFrameNavigation);
    window.addEventListener('resize', resizeIframe);
    resizeIframe();

    return () => {
      window.removeEventListener('message', handleFrameNavigation);
      window.removeEventListener('resize', resizeIframe);
    };
  }, [navigate]);

  return (
    <iframe 
      ref={iframeRef}
      src={src}
      className="w-full border-0"
      style={{ height: '100vh' }}
      title="Page Content"
    />
  );
}