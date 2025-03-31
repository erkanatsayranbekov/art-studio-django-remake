'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  group: {
    id: string;
    name: string;
  } | null;
}

export default function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await fetch(`/api/customers/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch customer');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) {
      return;
    }

    try {
      const response = await fetch(`/api/customers/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      router.push('/customers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
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

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error || 'Клиент не найден'}</div>
        </div>
      </div>
    );
  }

  const formattedBirthDate = format(parseISO(customer.dateOfBirth), 'd MMMM yyyy', { locale: ru });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex space-x-3">
              <Link
                href={`/customers/${customer.id}/edit`}
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
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Информация о клиенте</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Телефон</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.phoneNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.email || 'Не указан'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Дата рождения</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formattedBirthDate}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Группа</h2>
              {customer.group ? (
                <div>
                  <Link
                    href={`/groups/${customer.group.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {customer.group.name}
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Клиент не привязан к группе</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 