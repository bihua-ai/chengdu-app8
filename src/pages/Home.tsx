import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {language === 'en' ? 'Welcome to Bihua' : '欢迎使用笔画'}
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-lg text-gray-700">
          {language === 'en'
            ? 'Start your journey of learning Chinese characters today.'
            : '今天就开始学习汉字吧。'}
        </p>
      </div>
    </div>
  );
}