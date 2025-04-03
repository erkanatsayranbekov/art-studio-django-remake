'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
}

export default function NewCustomerPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    groupId: '',
  });

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Format the date to ISO string
      const formattedDate = new Date(formData.dateOfBirth).toISOString();

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          dateOfBirth: formattedDate,
          groupId: parseInt(formData.groupId, 10),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create customer');
      }

      router.push('/customers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mt-8 md:mt-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Новый клиент</h1>
            <p className="mt-2 text-sm text-gray-600">
              Заполните форму для добавления нового клиента
            </p>
          </div>
          <Link href="/customers" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-2xl rounded-lg p-6 ">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder='Введите имя'
              className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Фамилия
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder='Введите фамилию'
              className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Телефон
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder='Введите телефон'
              className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
            />
          </div>


          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Дата рождения
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300 appearance-none"
            />
          </div>

          <div>
            <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">
              Группа
            </label>
            <select
              name="groupId"
              id="groupId"
              required
              value={formData.groupId}
              onChange={handleChange}
              className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
            >
              <option value="">Выберите группу</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id} className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300">
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 