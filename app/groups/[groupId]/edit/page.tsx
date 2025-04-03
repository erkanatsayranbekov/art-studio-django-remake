'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfirmModal from '@/app/components/ConfirmModal';

const DAYS_OF_WEEK = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
};

interface Group {
  id: string;
  name: string;
  description: string;
  weekdays: string;
  startTime: string;
  endTime: string;
  price: number;
  isPermanent: boolean;
}

export default function EditGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const [formLoading, setFormLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchGroup() {
      try {
        const response = await fetch(`/api/groups/${groupId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group');
        }
        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch group');
      } finally {
        setFormLoading(false);
      }
    }

    fetchGroup();
  }, [groupId]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete group');
      }

      router.push('/groups');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const selectedDays = Array.from(formData.getAll('weekdays'));

    // Create a base date for today
    const today = new Date();
    
    // Get the time strings from the form
    const startTimeStr = formData.get('startTime') as string;
    const endTimeStr = formData.get('endTime') as string;

    // Create full datetime strings by combining today's date with the selected times
    const startTime = new Date(`${today.toISOString().split('T')[0]}T${startTimeStr}`);
    const endTime = new Date(`${today.toISOString().split('T')[0]}T${endTimeStr}`);

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      weekdays: selectedDays.join(', '),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      price: parseFloat(formData.get('price') as string),
      isPermanent: formData.get('isPermanent') === 'on',
    };

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update group');
      }

      router.push('/groups');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update group');
    } finally {
      setLoading(false);
    }
  }

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">Группа не найдена</div>
        </div>
      </div>
    );
  }

  // Convert the weekdays string to an array
  const selectedWeekdays = group.weekdays.split(', ');

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse gap-4 md:flex-row justify-between items-center mb-8">
          <h1 className="text-lg md:text-4xl font-bold text-gray-900">Редактирование группы</h1>
          <div className="flex space-x-4 mt-8">
            <Link
              href="/groups"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="space-y-8">
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Название группы
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                defaultValue={group.name}
                className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                required
                defaultValue={group.description}
                className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all resize-none border-2 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дни недели
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(DAYS_OF_WEEK).map(([key, value]) => (
                  <label key={key} className="relative flex items-center p-3 rounded-lg border-2 border-gray-300 hover:border-indigo-300 cursor-pointer transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                    <input
                      type="checkbox"
                      name="weekdays"
                      value={key}
                      defaultChecked={selectedWeekdays.includes(key)}
                      className="sr-only peer"
                    />
                    <div className="w-full text-sm text-gray-700 peer-checked:text-indigo-600 peer-checked:font-medium">
                      {value}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Начало
                </label>
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  required
                  defaultValue={new Date(group.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  Конец
                </label>
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  required
                  defaultValue={new Date(group.endTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Цена
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={group.price}
                  className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₸</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPermanent"
                id="isPermanent"
                defaultChecked={group.isPermanent}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
              />
              <label htmlFor="isPermanent" className="ml-2 block text-sm text-gray-700">
                Постоянная группа
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Удаление группы"
        message={`Вы уверены, что хотите удалить группу "${group.name}"? Это действие нельзя отменить.`}
      />
    </div>
  );
} 