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
  groupId: string | null;
  group?: {
    id: string;
    name: string;
  };
  attendanceCount: number;
  lastPaymentDate: string;
}

export default function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    async function fetchData() {
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

    fetchData();
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

  const handlePaymentUpdate = async () => {
    setUpdatingPayment(true);
    try {
      const response = await fetch(`/api/customers/${resolvedParams.id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to update payment date');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setShowPaymentModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment date');
    } finally {
      setUpdatingPayment(false);
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
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Оплачено
              </button>
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

        {/* Payment Confirmation Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Подтверждение оплаты
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Вы уверены, что хотите обновить дату последней оплаты на сегодняшнюю?
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={handlePaymentUpdate}
                    disabled={updatingPayment}
                    className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {updatingPayment ? 'Обновление...' : 'Подтвердить'}
                  </button>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Информация о клиенте</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Имя</p>
                  <p className="mt-1 text-lg text-gray-900">{customer.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Фамилия</p>
                  <p className="mt-1 text-lg text-gray-900">{customer.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Телефон</p>
                  <p className="mt-1 text-lg text-gray-900">{customer.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Дата рождения</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(customer.dateOfBirth).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Группа</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {customer.group ? (
                      <Link href={`/groups/${customer.group.id}`} className="text-indigo-600 hover:text-indigo-800">
                        {customer.group.name}
                      </Link>
                    ) : (
                      'Не назначена'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Посещено занятий с последней оплаты</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {customer.attendanceCount || 0} занятий
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Дата последней оплаты</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {format(parseISO(customer.lastPaymentDate), 'd MMMM yyyy', { locale: ru })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 