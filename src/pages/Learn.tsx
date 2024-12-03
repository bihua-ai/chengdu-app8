import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Learn() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {language === 'en' ? 'Learning Center' : '学习中心'}
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-lg text-gray-700">
          {language === 'en'
            ? 'Your learning content will appear here.'
            : '您的学习内容将显示在这里。'}
        </p>
      </div>
    </div>
  );
}