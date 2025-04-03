'use client';

import { useState, useEffect } from 'react';
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

export default function OverdueCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/customers/overdue');
        if (!response.ok) {
          throw new Error('Failed to fetch overdue customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch overdue customers');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handlePaymentUpdate = async () => {
    if (!selectedCustomer) return;
    
    setUpdatingPayment(true);
    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to update payment date');
      }

      // Update the customer in the list
      setCustomers(customers.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, attendanceCount: 0, lastPaymentDate: new Date().toISOString() }
          : customer
      ));

      setShowPaymentModal(false);
      setSelectedCustomer(null);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:ml-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:ml-72 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-0">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-lg font-bold text-gray-900 md:text-3xl">Клиенты с просроченной оплатой</h1>
            <p className="mt-2 text-sm text-gray-600">
              Клиенты, посетившие 7 и более занятий с момента последней оплаты
            </p>
          </div>
          <Link
            href="/customers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            К списку всех клиентов
          </Link>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Нет клиентов с просроченной оплатой</p>
          </div>
        ) : (
          <div className="bg-white shadow-2xl overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Группа
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Посещено занятий
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Последняя оплата
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{customer.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {customer.group ? (
                          <Link href={`/groups/${customer.group.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {customer.group.name}
                          </Link>
                        ) : (
                          'Не назначена'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{customer.attendanceCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {format(parseISO(customer.lastPaymentDate), 'd MMMM yyyy', { locale: ru })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowPaymentModal(true);
                        }}
                        className=" bg-green-600 md:bg-transparent md:text-green-600 md:hover:text-green-900 p-2 rounded-md"
                      >
                        <span className="hidden md:block">Произвести оплату</span>
                        <span className="block md:hidden">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Confirmation Modal */}
        {showPaymentModal && selectedCustomer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Подтверждение оплаты
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Вы уверены, что хотите обновить дату последней оплаты для клиента{' '}
                    <span className="font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>?
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
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 