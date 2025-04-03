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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error || 'Клиент не найден'}</div>
        </div>
      </div>
    );
  }

  const formattedBirthDate = format(parseISO(customer.dateOfBirth), 'd MMMM yyyy', { locale: ru });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:py-8 md:ml-72">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <div className="flex justify-center w-full space-x-3 md:w-auto md:justify-start">
              <Link
                href="/customers"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="text-sm hidden md:block">Назад</span>
                <span className="text-xs block md:hidden">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </span>
              </Link>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="text-sm hidden md:block">Обновить оплату</span>
                <span className="text-xs block md:hidden">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
              <Link
                href={`/customers/${customer.id}/edit`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="text-sm hidden md:block">Редактировать</span>
                <span className="text-xs block md:hidden">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="text-sm hidden md:block">Удалить</span>
                <span className="text-xs block md:hidden">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v3M10 20h.01" />
                  </svg>
                </span>
              </button>
            </div>
        </div>

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

        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Подтверждение удаления
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Вы уверены, что хотите клиента {customer.firstName} {customer.lastName}?
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Удалить
                  </button>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-2xl p-8 mb-8">
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