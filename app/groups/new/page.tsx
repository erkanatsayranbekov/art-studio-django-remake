'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DAYS_OF_WEEK = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
};

export default function NewGroupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }

      router.push('/groups');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br froms-indigo-50 to-purple-50 py-12 md:ml-72">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-8">
          
        <div className='text-center md:text-left'>
            <h1 className="text-lg md:text-4xl mt-4 md:mt-0 font-bold text-gray-900 mb-2">Создание группы</h1>
            <p className="text-gray-600 text-sm md:text-base">Заполните форму для создания новой группы</p>
          </div>
          <Link
            href="/groups"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к списку
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Название группы
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                    placeholder="Введите название группы"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Цена
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₸</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Описание
              </label>
              <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  required
                  className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all resize-none border-2 border-gray-300"
                  placeholder="Опишите группу..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Дни недели
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(DAYS_OF_WEEK).map(([key, value]) => (
                  <label key={key} className="relative flex items-center p-3 rounded-lg border-2 border-gray-300 hover:border-indigo-300 cursor-pointer transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                    <input
                      type="checkbox"
                      name="weekdays"
                      value={key}
                      className="sr-only peer"
                    />
                    <div className="w-full text-sm text-gray-700 peer-checked:text-indigo-600 peer-checked:font-medium">
                      {value}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Время начала
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300 appearance-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Время окончания
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300 appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="isPermanent"
                id="isPermanent"
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
              />
              <label htmlFor="isPermanent" className="ml-3 block text-sm text-gray-700">
                Постоянная группа
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Создание...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Создать группу
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 