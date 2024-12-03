import React from 'react';
import { BarChart2, Network, FileText, MessageSquarePlus } from 'lucide-react';

interface ChatActionButtonsProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export default function ChatActionButtons({ onAction, disabled = false }: ChatActionButtonsProps) {
  const leftButtons = [
    { id: 'analyze', tooltip: '数据分析', icon: BarChart2 },
    { id: 'graph', tooltip: '图谱绘制', icon: Network },
    { id: 'report', tooltip: '生成报告', icon: FileText },
  ];

  const rightButtons = [
    { id: 'new', tooltip: '新建对话', icon: MessageSquarePlus },
  ];

  const renderButton = ({ id, tooltip, icon: Icon }) => (
    <button
      key={id}
      onClick={() => onAction(id)}
      disabled={disabled}
      title={tooltip}
      className={`p-2 rounded-md transition-colors ${
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
      }`}
      aria-label={tooltip}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex justify-between mb-2">
      <div className="flex gap-2">
        {leftButtons.map(renderButton)}
      </div>
      <div className="flex gap-2">
        {rightButtons.map(renderButton)}
      </div>
    </div>
  );
}