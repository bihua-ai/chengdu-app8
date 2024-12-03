import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Settings() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {language === 'en' ? 'Settings' : '设置'}
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-lg text-gray-700">
          {language === 'en'
            ? 'Customize your learning experience.'
            : '自定义您的学习体验。'}
        </p>
      </div>
    </div>
  );
}