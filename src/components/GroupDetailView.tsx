import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Group } from '../types/list';
import { Save, Users, Lock, Shield, Hash, Image, Maximize2, Minimize2 } from 'lucide-react';

interface GroupDetailViewProps {
  group: Group | undefined;
}

export default function GroupDetailView({ group }: GroupDetailViewProps) {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Group>>(group || {});
  const [isProfileFullscreen, setIsProfileFullscreen] = useState(false);
  const [profile, setProfile] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!group?.group_id) return;
      
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const response = await fetch(`/api/group_profile/${group.group_id}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data.profile || '');
      } catch (err) {
        setProfileError(language === 'en' 
          ? 'Failed to load profile' 
          : '加载简介失败');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [group?.group_id, language]);

  if (!group) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`/api/groups/${group.group_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update group');
      }

      setIsEditing(false);
    } catch (err) {
      setError(language === 'en' 
        ? 'Failed to update group' 
        : '更新群组失败');
    }
  };

  const handleProfileSave = async () => {
    setProfileError(null);
    try {
      const response = await fetch(`/api/group_profile/${group.group_id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_text: profile }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      if (isProfileFullscreen) {
        setIsProfileFullscreen(false);
      }
    } catch (err) {
      setProfileError(language === 'en' 
        ? 'Failed to save profile' 
        : '保存简介失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">
          {group.name}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {isEditing 
            ? (language === 'en' ? 'Cancel' : '取消') 
            : (language === 'en' ? 'Edit' : '编辑')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Group Name' : '群组名称'}
              </label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Alias' : '别名'}
              </label>
              <input
                type="text"
                value={editForm.alias || ''}
                onChange={e => setEditForm({...editForm, alias: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Visibility' : '可见性'}
              </label>
              <select
                value={editForm.public ? 'public' : 'private'}
                onChange={e => setEditForm({...editForm, public: e.target.value === 'public'})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="public">{language === 'en' ? 'Public' : '公开'}</option>
                <option value="private">{language === 'en' ? 'Private' : '私密'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Avatar URL' : '头像链接'}
              </label>
              <input
                type="text"
                value={editForm.avatar_url || ''}
                onChange={e => setEditForm({...editForm, avatar_url: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Save Changes' : '保存更改'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Group ID' : '群组ID'}
                </div>
                <div className="mt-1 text-gray-900">{group.group_id}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Members' : '成员'}
                </div>
                <div className="mt-1 text-gray-900">{group.size}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Visibility' : '可见性'}
                </div>
                <div className="mt-1 text-gray-900">
                  {group.public 
                    ? (language === 'en' ? 'Public' : '公开')
                    : (language === 'en' ? 'Private' : '私密')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Encryption' : '加密'}
                </div>
                <div className="mt-1 text-gray-900">
                  {group.encryption 
                    ? (language === 'en' ? 'Enabled' : '已启用')
                    : (language === 'en' ? 'Disabled' : '未启用')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Avatar' : '头像'}
                </div>
                <div className="mt-1">
                  {group.avatar_url ? (
                    <img
                      src={group.avatar_url}
                      alt={group.name}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                      }}
                    />
                  ) : (
                    <span className="text-gray-500">
                      {language === 'en' ? 'No avatar' : '无头像'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${isProfileFullscreen 
        ? 'fixed inset-0 z-50 bg-white p-6' 
        : 'mt-8 border-t pt-6'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Group Profile' : '群组简介'}
          </h3>
          <div className="flex items-center gap-2">
            {profileError && (
              <span className="text-sm text-red-600">
                {profileError}
              </span>
            )}
            <button
              onClick={() => setIsProfileFullscreen(!isProfileFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            >
              {isProfileFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {isLoadingProfile ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <>
            <textarea
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                isProfileFullscreen ? 'h-[calc(100vh-12rem)]' : 'h-48'
              }`}
              placeholder={language === 'en' 
                ? 'Enter group profile information...' 
                : '输入群组简介信息...'}
            />
            <div className={`flex justify-end mt-4 ${isProfileFullscreen ? 'absolute bottom-6 right-6' : ''}`}>
              <button
                onClick={handleProfileSave}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Save Profile' : '保存简介'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}