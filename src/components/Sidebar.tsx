import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Table, TestTube, Box, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MatrixChat from './MatrixChat';

const navigation = [
  { name: '首页', to: '/', icon: Home },
  { name: '监控', to: '/page1', icon: Table },
  { name: '开关柜', to: '/switch-box', icon: Box },
];

export default function Sidebar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleTestClick = () => {
    navigate('/page5');
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 px-4 py-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/src/assets/bihua.png" alt="笔画" className="h-8 w-8" />
          <span className="ml-2 text-2xl font-bold text-gray-900">笔画</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestClick}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md"
            title="测试"
          >
            <TestTube className="h-4 w-4" />
          </button>
          <button
            onClick={logout}
            className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
            title="退出登录"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <MatrixChat />
        </div>
      </div>
    </div>
  );
}