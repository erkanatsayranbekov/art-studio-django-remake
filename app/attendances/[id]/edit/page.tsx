'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { use } from 'react';

interface Attendance {
  id: string;
  customerId: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  groupId: string;
  group: {
    name: string;
  };
  date: string;
  isPresent: boolean;
}

export default function EditAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`/api/attendances/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch attendance');
        const data = await response.json();
        setAttendance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [resolvedParams.id]);

  console.log(attendance);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/attendances/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPresent: attendance.isPresent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance');
      }

      router.push('/attendances');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">Ошибка загрузки данных</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-gray-500">Запись не найдена</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Редактировать посещаемость</h1>
        <button
          onClick={() => router.push('/attendances')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Назад
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Информация о посещаемости</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Клиент:</span>{' '}
              <span className="text-gray-900">{attendance.customer.firstName} {attendance.customer.lastName}</span>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Группа:</span>{' '}
              <span className="text-gray-900">{attendance.group.name}</span>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Дата:</span>{' '}
              <span className="text-gray-900">
                {format(parseISO(attendance.date), 'd MMMM yyyy', { locale: ru })}
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус посещаемости
            </label>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isPresent"
                  checked={attendance.isPresent}
                  onChange={() => setAttendance({ ...attendance, isPresent: true })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-3 text-gray-900">Присутствует</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isPresent"
                  checked={!attendance.isPresent}
                  onChange={() => setAttendance({ ...attendance, isPresent: false })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-3 text-gray-900">Отсутствует</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/attendances')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 