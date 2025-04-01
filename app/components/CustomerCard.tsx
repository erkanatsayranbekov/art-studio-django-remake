'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CustomerCardProps {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  groupName: string;
  groupId: string;
  attendanceCount: number;
}

export default function CustomerCard({
  id,
  firstName,
  lastName,
  phoneNumber,
  email,
  dateOfBirth,
  groupName,
  groupId,
  attendanceCount,
}: CustomerCardProps) {
  const formattedDate = dateOfBirth ? format(parseISO(dateOfBirth), 'd MMMM yyyy', { locale: ru }) : 'Не указана';

  return (
    <div className="bg-white shadow-2xl shadow-black/50 rounded-lg p-6 transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <Link
          href={`/customers/${id}`}
          className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200"
        >
          {firstName} {lastName}
        </Link>
        <Link
          href={`/customers/${id}/edit`}
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {phoneNumber}
        </div>


        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formattedDate}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-2"
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
          <Link href={`/groups/${groupId}`} className="text-indigo-600 hover:text-indigo-900">
            {groupName}
          </Link>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Посещено занятий: {attendanceCount}
        </div>
      </div>
    </div>
  );
} 