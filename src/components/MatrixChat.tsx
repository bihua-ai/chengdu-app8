import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from 'matrix-js-sdk';
import { Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MATRIX_CONFIG } from '../config/api';
import VoiceRecorder from './VoiceRecorder';
import ResizeHandle from './ResizeHandle';
import MessageBubble from './MessageBubble';
import ChatActionButtons from './ChatActionButtons';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  avatar?: string;
  displayName?: string;
}

export default function MatrixChat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageListHeight, setMessageListHeight] = useState(70);
  const [isResizing, setIsResizing] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Record<string, { avatar_url?: string; displayname?: string }>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processedMessagesRef = useRef(new Set<string>());
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const percentage = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    if (percentage >= 20 && percentage <= 90) {
      setMessageListHeight(percentage);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.classList.remove('select-none', 'resizing');
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await clientRef.current?.getProfileInfo(userId);
      if (profile) {
        setUserProfiles(prev => ({
          ...prev,
          [userId]: profile
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch profile for ${userId}:`, err);
    }
  };

  // Update messages when userProfiles change
  useEffect(() => {
    setMessages(prevMessages => 
      prevMessages.map(msg => ({
        ...msg,
        avatar: userProfiles[msg.sender]?.avatar_url,
        displayName: userProfiles[msg.sender]?.displayname
      }))
    );
  }, [userProfiles]);

  const handleSend = async () => {
    if (!newMessage.trim() || !clientRef.current || !isConnected) return;

    try {
      await clientRef.current.sendTextMessage(
        MATRIX_CONFIG.defaultRoomId,
        newMessage.trim()
      );
      setNewMessage('');
      setError(null);
    } catch (err) {
      console.error('Error sending event:', err);
      setError(language === 'en' 
        ? 'Failed to send message' 
        : '发送消息失败');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecording = async (blob: Blob) => {
  if (!clientRef.current || !isConnected) return;

  try {
    // Upload the voice message (audio file)
    const uploadResponse = await clientRef.current.uploadContent(blob);
    
    // Prepare the content with the uploaded media URL and other metadata
    const content = {
      body: 'Voice message',
      info: {
        size: blob.size,
        mimetype: blob.type,
        // Optional: thumbnail info if you have a thumbnail image for the voice message
        // thumbnail_url: someThumbnailUrl,
      },
      msgtype: 'm.audio',
      url: uploadResponse.content_uri, // The URL of the uploaded audio content
    };

    // Send the message to the room with the content
    await clientRef.current.sendMessage(MATRIX_CONFIG.defaultRoomId, content);

    // Clear any previous error
    setError(null);
  } catch (err) {
    console.error('Error sending voice message:', err);
    setError(language === 'en'
      ? 'Failed to send voice message'
      : '发送语音消息失败');
  }
};

  const handleChatAction = (action: string) => {
    switch (action) {
      case 'analyze':
        // Handle data analysis
        break;
      case 'graph':
        // Handle graph drawing
        break;
      case 'report':
        // Handle report generation
        break;
      case 'new':
        setMessages([]);
        break;
    }
  };

  useEffect(() => {
    if (isResizing) {
      document.body.classList.add('select-none', 'resizing');
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseleave', handleMouseUp);
        document.body.classList.remove('select-none', 'resizing');
      };
    }
  }, [isResizing, handleResize, handleMouseUp]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const initMatrix = async () => {
      try {
        const client = createClient({
          baseUrl: MATRIX_CONFIG.homeserverUrl,
          userId: MATRIX_CONFIG.userId,
        });

        await client.login('m.login.password', {
          user: MATRIX_CONFIG.userId,
          password: MATRIX_CONFIG.password,
        });

        const handleTimelineEvent = async (event: any) => {
          if (event.getType() === 'm.room.message' && 
              event.getRoomId() === MATRIX_CONFIG.defaultRoomId &&
              !processedMessagesRef.current.has(event.getId())) {
                
            const messageId = event.getId();
            const sender = event.getSender();
            processedMessagesRef.current.add(messageId);
            
            setMessages(prev => {
              if (prev.some(msg => msg.id === messageId)) {
                return prev;
              }
              
              return [...prev, {
                id: messageId,
                content: event.getContent().body,
                sender: sender,
                timestamp: event.getTs(),
                avatar: userProfiles[sender]?.avatar_url,
                displayName: userProfiles[sender]?.displayname
              }];
            });

            if (!userProfiles[sender]) {
              await fetchUserProfile(sender);
            }
          }
        };

        client.on('Room.timeline', handleTimelineEvent);

        await client.startClient();
        clientRef.current = client;
        setIsConnected(true);
        setError(null);

        await fetchUserProfile(MATRIX_CONFIG.userId);

        return () => {
          client.removeListener('Room.timeline', handleTimelineEvent);
        };

      } catch (err: any) {
        console.error('Matrix init error:', err);
        setError(language === 'en' 
          ? 'Failed to connect to chat server' 
          : '无法连接到聊天服务器');
        setIsConnected(false);

        if (err.httpStatus === 429) {
          const retryAfter = err.data?.retry_after_ms || 5000;
          retryTimeoutRef.current = setTimeout(initMatrix, retryAfter);
        }
      }
    };

    const cleanup = initMatrix();

    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
      if (clientRef.current) {
        clientRef.current.stopClient();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [language]);

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      <div 
        style={{ height: `${messageListHeight}%` }}
        className="overflow-y-auto p-4 space-y-4 min-h-[20%]"
      >
        {error && (
          <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {language === 'en' 
              ? 'No messages yet' 
              : '暂无消息'}
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            isCurrentUser={message.sender === clientRef.current?.getUserId()}
            avatar={message.avatar}
            displayName={message.displayName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ResizeHandle
        orientation="vertical"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      />

      <div className="flex-1 min-h-[10%] pt-2 px-4 pb-4 flex flex-col">
        <ChatActionButtons 
          onAction={handleChatAction}
          disabled={!isConnected}
        />
        <div className="relative flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'en' ? 'Type a message...' : '输入消息...'}
            className="w-full h-full px-3 py-2 pr-24 rounded-md focus:outline-none resize-none bg-gray-50"
            disabled={!isConnected}
          />
          <div className="absolute left-2 bottom-2">
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecording}
              disabled={!isConnected}
              compact={true}
            />
          </div>
          <div className="absolute right-2 bottom-2">
            <button
              onClick={handleSend}
              disabled={!isConnected || !newMessage.trim()}
              className={`p-1.5 rounded-md ${
                isConnected && newMessage.trim()
                  ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}