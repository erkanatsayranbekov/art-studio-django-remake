'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/customers/overdue') {
      return pathname === path;
    }
    if (path === '/customers') {
      return pathname === path || (pathname.startsWith(path + '/') && !pathname.startsWith('/customers/overdue'));
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  

  return (
    <>
    <div className={`w-72 bg-gradient-to-br from-purple-50 via-white to-blue-50 h-screen fixed left-0 top-0 border-r border-gray-100 shadow-2xl shadow-black/50 transition-all duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:block z-100`}>
      <div className="p-8">
        <div className="flex items-center mb-12">
          <Link href="/" className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Art Studio</h1>
          </Link>
        </div>
        
        <nav className="space-y-2">
          <Link
            href="/groups"
            className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive('/groups')
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${isActive('/groups') ? 'text-white' : 'text-purple-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Группы
          </Link>

          <Link
            href="/customers"
            className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive('/customers')
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${isActive('/customers') ? 'text-white' : 'text-purple-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Клиенты
          </Link>

          <Link
            href="/customers/overdue"
            className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive('/customers/overdue')
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${isActive('/customers/overdue') ? 'text-white' : 'text-purple-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Предстоящие платежи
          </Link>

          <Link
            href="/attendances"
            className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive('/attendances')
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${isActive('/attendances') ? 'text-white' : 'text-purple-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Посещаемость
          </Link>
        </nav>

      </div>
    </div>
    <div className='fixed w-full flex justify-end p-4 m-0 z-20 md:hidden'>
      <button onClick={toggleSidebar} className="p-2 rounded-lg bg-white shadow-lg">
        {
          !isOpen ? (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )
        }

      </button>
    </div>
    </>
  );
} 