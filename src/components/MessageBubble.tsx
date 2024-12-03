import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MATRIX_CONFIG } from '../config/api';

interface MessageBubbleProps {
  content: string;
  sender: string;
  timestamp: number;
  isCurrentUser: boolean;
  avatar?: string;
  displayName?: string;
}

export default function MessageBubble({ 
  content, 
  sender, 
  timestamp, 
  isCurrentUser,
  avatar,
  displayName 
}: MessageBubbleProps) {
  // Convert Matrix MXC URL to HTTP URL
  const getAvatarUrl = (mxcUrl?: string) => {
    if (!mxcUrl) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${sender}`;
    }
    
    // Check if it's an MXC URL
    if (mxcUrl.startsWith('mxc://')) {
      const mediaId = mxcUrl.split('mxc://')[1];
      return `${MATRIX_CONFIG.homeserverUrl}/_matrix/media/r0/thumbnail/${mediaId}?width=96&height=96&method=crop`;
    }
    
    return mxcUrl;
  };

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <img
          src={getAvatarUrl(avatar)}
          alt={displayName || sender}
          className="w-8 h-8 rounded-full object-cover bg-gray-100"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${sender}`;
          }}
        />
        <span className="text-[10px] text-gray-400">
          {format(timestamp, 'HH:mm', { locale: zhCN })}
        </span>
      </div>
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-gray-500 mb-1">
          {displayName || sender.split(':')[0].substring(1)}
        </span>
        
        <div className={`p-2 rounded-lg max-w-[300px] ${
          isCurrentUser ? 'bg-indigo-100' : 'bg-gray-100'
        }`}>
          <div className="text-sm break-words">{content}</div>
        </div>
      </div>
    </div>
  );
}