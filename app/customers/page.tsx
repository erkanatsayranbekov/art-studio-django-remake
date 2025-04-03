'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerCard from '@/app/components/CustomerCard';

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
  };
  attendanceCount: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        console.log('API Response:', data);
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

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
    <div className="min-h-screen bg-gray-50 pt-20 md:py-8 md:ml-72">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
          <Link
            href="/customers/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="text-sm hidden md:block">Добавить клиента</span>
            <span className="text-xs block md:hidden">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </Link>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет доступных клиентов</p>
            <Link
              href="/customers/new"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              Добавить первого клиента
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => {
              console.log('Customer data:', customer);
              return (
                <CustomerCard
                  key={customer.id}
                  id={customer.id}
                  firstName={customer.firstName}
                  lastName={customer.lastName}
                  phoneNumber={customer.phoneNumber}
                  email={customer.email || 'Не указан'}
                  dateOfBirth={customer.dateOfBirth}
                  groupName={customer.group.name}
                  groupId={customer.group.id}
                  attendanceCount={customer.attendanceCount}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 