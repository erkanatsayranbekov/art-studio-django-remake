'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface GroupCardProps {
  id: number;
  name: string;
  description: string;
  weekdays: string;
  startTime: string;
  endTime: string;
  price: number;
  isPermanent: boolean;
  customerCount: number;
  isAuthenticated: boolean;
}

export default function GroupCard({
  id,
  name,
  description,
  weekdays,
  startTime,
  endTime,
  price,
  isPermanent,
  customerCount,
  isAuthenticated,
}: GroupCardProps) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Convert English weekdays to Russian
  const russianWeekdays = weekdays.split(', ').map(day => {
    const dayNames: { [key: string]: string } = {
      MONDAY: 'Понедельник',
      TUESDAY: 'Вторник',
      WEDNESDAY: 'Среда',
      THURSDAY: 'Четверг',
      FRIDAY: 'Пятница',
      SATURDAY: 'Суббота',
      SUNDAY: 'Воскресенье',
    };
    return dayNames[day] || day;
  }).join(', ');

  return (
    <div className="bg-white rounded-lg shadow-2xl shadow-black/50  p-6 transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <Link 
          href={`/groups/${id}`}
          className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
        >
          {name}
        </Link>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
          {customerCount} учеников
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {russianWeekdays}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {format(start, 'HH:mm', { locale: ru })} - {format(end, 'HH:mm', { locale: ru })}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {price} ₸
        </div>
        {isPermanent && (
          <div className="flex items-center text-sm text-green-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Постоянная группа
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        {isAuthenticated && (
          <Link
            href={`/groups/${id}/edit`}
            className="text-purple-600 hover:text-purple-700 flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
        )}
        <Link
          href={`/groups/${id}`}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
} 