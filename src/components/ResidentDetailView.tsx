import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Resident } from '../types/list';
import { Save, UserCog, Mail, Clock, Shield, Activity, Maximize2, Minimize2 } from 'lucide-react';
import { buildApiUrl } from '../config/api';

interface ResidentDetailViewProps {
  resident: Resident | undefined;
}

export default function ResidentDetailView({ resident }: ResidentDetailViewProps) {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Resident>>(resident || {});
  const [isProfileFullscreen, setIsProfileFullscreen] = useState(false);
  const [profile, setProfile] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!resident?.resident_id) return;
      
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const response = await fetch(buildApiUrl(`/resident_profile/${resident.resident_id}`));
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
  }, [resident?.resident_id, language]);

  if (!resident) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(buildApiUrl(`/residents/${resident.resident_id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update resident');
      }

      setIsEditing(false);
    } catch (err) {
      setError(language === 'en' 
        ? 'Failed to update resident' 
        : '更新居民信息失败');
    }
  };

  const handleProfileSave = async () => {
    setProfileError(null);
    try {
      const response = await fetch(buildApiUrl(`/resident_profile/${resident.resident_id}/`), {
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

  // Rest of the component remains the same
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">
          {resident.display_name}
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
                {language === 'en' ? 'Display Name' : '显示名称'}
              </label>
              <input
                type="text"
                value={editForm.display_name || ''}
                onChange={e => setEditForm({...editForm, display_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Email' : '邮箱'}
              </label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={e => setEditForm({...editForm, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Agent Status' : '代理状态'}
              </label>
              <select
                value={editForm.agent || 'disabled'}
                onChange={e => setEditForm({...editForm, agent: e.target.value as 'enabled' | 'disabled'})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="enabled">{language === 'en' ? 'Enabled' : '启用'}</option>
                <option value="disabled">{language === 'en' ? 'Disabled' : '禁用'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Role' : '角色'}
              </label>
              <select
                value={editForm.role || 'user'}
                onChange={e => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="admin">{language === 'en' ? 'Admin' : '管理员'}</option>
                <option value="user">{language === 'en' ? 'User' : '用户'}</option>
              </select>
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
              <UserCog className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Role' : '角色'}
                </div>
                <div className="mt-1">
                  {resident.role === 'admin' 
                    ? (language === 'en' ? 'Administrator' : '管理员')
                    : (language === 'en' ? 'User' : '用户')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Email' : '邮箱'}
                </div>
                <div className="mt-1">
                  {resident.email || (language === 'en' ? 'Not set' : '未设置')}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Last Login' : '最后登录'}
                </div>
                <div className="mt-1">
                  {resident.last_login_timestamp_ms 
                    ? new Date(resident.last_login_timestamp_ms).toLocaleString()
                    : (language === 'en' ? 'Never' : '从未')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Agent Status' : '代理状态'}
                </div>
                <div className="mt-1">
                  {resident.agent === 'enabled'
                    ? (language === 'en' ? 'Enabled' : '已启用')
                    : (language === 'en' ? 'Disabled' : '已禁用')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Status' : '状态'}
                </div>
                <div className="mt-1">
                  {resident.state === 'active'
                    ? (language === 'en' ? 'Active' : '活跃')
                    : (language === 'en' ? 'Inactive' : '不活跃')}
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
            {language === 'en' ? 'Resident Profile' : '居民简介'}
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
                ? 'Enter resident profile information...' 
                : '输入居民简介信息...'}
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