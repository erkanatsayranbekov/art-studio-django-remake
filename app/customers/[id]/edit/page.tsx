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
  email: string;
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
      email: formData.get('email') as string,
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black">{error || 'Клиент не найден'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Редактирование клиента</h1>
          <Link
            href={`/customers/${customer.id}`}
            className="text-black hover:text-gray-700"
          >
            Назад к клиенту
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-black">
                Имя
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                defaultValue={customer.firstName}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-black">
                Фамилия
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={customer.lastName}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-black">
                Телефон
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                defaultValue={customer.phoneNumber}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={customer.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-black">
                Дата рождения
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                defaultValue={customer.dateOfBirth.split('T')[0]}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="groupId" className="block text-sm font-medium text-black">
                Группа
              </label>
              <select
                name="groupId"
                id="groupId"
                defaultValue={customer.groupId || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
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
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 