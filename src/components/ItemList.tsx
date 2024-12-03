import React from 'react';
import { useParams } from 'react-router-dom';
import type { ListType, Resident, Group, LLMModel } from '../types/list';
import { Bot, Lock, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ItemListProps {
  items: (Resident | Group | LLMModel)[];
  type: ListType;
  onItemClick: (item: Resident | Group | LLMModel) => void;
}

export default function ItemList({ items, type, onItemClick }: ItemListProps) {
  const { id } = useParams();
  const { language } = useLanguage();

  const getItemKey = (item: Resident | Group | LLMModel): string => {
    if ('resident_id' in item) return item.resident_id;
    if ('group_id' in item) return item.group_id;
    return item.model_id;
  };

  const renderItem = (item: Resident | Group | LLMModel) => {
    if (type === 'residents') {
      const resident = item as Resident;
      return (
        <button
          key={resident.resident_id}
          onClick={() => onItemClick(resident)}
          className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
            resident.resident_id === id
              ? 'bg-indigo-50 text-indigo-600'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={resident.avatar_url}
              alt={resident.display_name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{resident.display_name}</span>
                {resident.is_agent && (
                  <Bot className="h-4 w-4 text-indigo-600" title="AI Agent" />
                )}
              </div>
              <div className="text-sm text-gray-500">ID: {resident.resident_id}</div>
            </div>
          </div>
        </button>
      );
    } else if (type === 'groups') {
      const group = item as Group;
      return (
        <button
          key={group.group_id}
          onClick={() => onItemClick(group)}
          className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
            group.group_id === id
              ? 'bg-indigo-50 text-indigo-600'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={group.avatar_url || 'https://via.placeholder.com/40'}
              alt={group.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.name}</span>
                {!group.public && (
                  <Lock className="h-4 w-4 text-gray-500" title={language === 'en' ? 'Private' : '私密'} />
                )}
                {group.encryption && (
                  <Shield className="h-4 w-4 text-green-600" title={language === 'en' ? 'Encrypted' : '加密'} />
                )}
              </div>
              <div className="text-sm text-gray-500">
                <span>ID: {group.group_id}</span>
                <span className="mx-2">•</span>
                <span>{group.size} {language === 'en' ? 'members' : '成员'}</span>
              </div>
            </div>
          </div>
        </button>
      );
    } else {
      const model = item as LLMModel;
      return (
        <button
          key={model.model_id}
          onClick={() => onItemClick(model)}
          className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
            model.model_id === id
              ? 'bg-indigo-50 text-indigo-600'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{model.provider}</span>
              <span className="text-sm text-gray-500">v{model.version}</span>
            </div>
            <div className="text-sm text-gray-500">
              <span>ID: {model.model_id}</span>
              <span className="mx-2">•</span>
              <span>{model.size}B {language === 'en' ? 'parameters' : '参数'}</span>
            </div>
            <div className="text-xs text-gray-400">
              {language === 'en' ? 'Group' : '组'}: {model.group_id}
            </div>
          </div>
        </button>
      );
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <React.Fragment key={getItemKey(item)}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
}