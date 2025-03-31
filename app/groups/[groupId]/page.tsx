'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import CustomerCard from '@/app/components/CustomerCard';
import Cookies from 'js-cookie';

interface Group {
  id: string;
  name: string;
  description: string;
  weekdays: string;
  startTime: string;
  endTime: string;
  price: number;
  isPermanent: boolean;
  customers: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
  }[];
}

export default function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(Cookies.get('auth-token') !== undefined);
  }, []);

  useEffect(() => {
    async function fetchGroup() {
      try {
        const response = await fetch(`/api/groups/${resolvedParams.groupId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group');
        }
        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch group');
      } finally {
        setLoading(false);
      }
    }

    fetchGroup();
  }, [resolvedParams.groupId]);

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту группу?')) {
      return;
    }

    try {
      const response = await fetch(`/api/groups/${resolvedParams.groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      router.push('/groups');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error || 'Группа не найдена'}</div>
        </div>
      </div>
    );
  }

  const weekdays = group.weekdays.split(',').map(day => {
    const dayNames: { [key: string]: string } = {
      MONDAY: 'Понедельник',
      TUESDAY: 'Вторник',
      WEDNESDAY: 'Среда',
      THURSDAY: 'Четверг',
      FRIDAY: 'Пятница',
      SATURDAY: 'Суббота',
      SUNDAY: 'Воскресенье',
    };
    return dayNames[day.trim()] || day.trim();
  });

  const formattedStartTime = format(parseISO(group.startTime), 'HH:mm');
  const formattedEndTime = format(parseISO(group.endTime), 'HH:mm');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            {isAuthenticated && (
              <div className="flex space-x-3">
                <Link
                  href={`/groups/${group.id}/edit`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Редактировать
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Информация о группе</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Описание</dt>
                  <dd className="mt-1 text-sm text-gray-900">{group.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Дни недели</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {weekdays.join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Время занятий</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formattedStartTime} - {formattedEndTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Стоимость</dt>
                  <dd className="mt-1 text-sm text-gray-900">{group.price} ₽</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Тип группы</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {group.isPermanent ? 'Постоянная' : 'Временная'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Клиенты группы</h2>
              <Link
                href="/customers/new"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Добавить клиента
              </Link>
            </div>

            {!group.customers || group.customers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">В группе пока нет клиентов</p>
                <Link
                  href="/customers/new"
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
                >
                  Добавить первого клиента
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.customers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    id={customer.id}
                    firstName={customer.firstName}
                    lastName={customer.lastName}
                    phoneNumber={customer.phoneNumber}
                    email={customer.email || 'Не указан'}
                    dateOfBirth={customer.dateOfBirth}
                    groupName={group.name}
                    groupId={group.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 