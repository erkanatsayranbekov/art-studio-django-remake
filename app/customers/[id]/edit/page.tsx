'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  groupId: string | null;
}

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch customer data
        const customerResponse = await fetch(`/api/customers/${resolvedParams.id}`);
        if (!customerResponse.ok) {
          throw new Error('Failed to fetch customer');
        }
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        // Fetch groups data
        const groupsResponse = await fetch('/api/groups');
        if (!groupsResponse.ok) {
          throw new Error('Failed to fetch groups');
        }
        const groupsData = await groupsResponse.json();
        setGroups(groupsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      groupId: formData.get('groupId') ? parseInt(formData.get('groupId') as string) : null,
    };

    try {
      const response = await fetch(`/api/customers/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update customer');
      }

      router.push(`/customers/${resolvedParams.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 md:ml-72">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-900">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 md:ml-72">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-900">{error || 'Клиент не найден'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 md:ml-72">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col-reverse mt-8 md:mt-0 md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-lg md:text-4xl font-bold text-gray-900 mb-2">Редактирование клиента</h1>
            <p className="text-gray-600 text-sm md:text-base">Измените данные клиента</p>
          </div>
          <Link
            href={`/customers/${customer.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к клиенту
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Имя
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    defaultValue={customer.firstName}
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Фамилия
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    defaultValue={customer.lastName}
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Телефон
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    defaultValue={customer.phoneNumber}
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                  Дата рождения
                </label>
                <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    defaultValue={customer.dateOfBirth.split('T')[0]}
                    required
                    className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="groupId" className="block text-sm font-semibold text-gray-700 mb-2">
                Группа
              </label>
              <div className="relative rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <select
                  name="groupId"
                  id="groupId"
                  defaultValue={customer.groupId || ''}
                  className="block w-full rounded-lg bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm text-gray-900 transition-all border-2 border-gray-300"
                >
                  <option value="">Без группы</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Сохранить
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