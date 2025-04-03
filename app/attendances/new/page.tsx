'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}

interface Group {
  id: string;
  name: string;
}

export default function NewAttendancePage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendances, setAttendances] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError('Ошибка загрузки групп');
        console.error('Error fetching groups:', err);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!selectedGroup) return;

      try {
        const response = await fetch(`/api/groups/${selectedGroup}`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        setCustomers(data.customers);
        // Initialize attendance status for each customer
        const initialAttendances: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'> = {};
        data.customers.forEach((customer: Customer) => {
          initialAttendances[customer.id] = 'PRESENT';
        });
        setAttendances(initialAttendances);
      } catch (err) {
        setError('Ошибка загрузки клиентов');
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, [selectedGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const attendanceRecords = Object.entries(attendances).map(([customerId, status]) => ({
        customerId: parseInt(customerId),
        groupId: parseInt(selectedGroup),
        date: date,
        status,
      }));

      const response = await fetch('/api/attendances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceRecords),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save attendance');
      }

      router.push('/attendances');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (customerId: string, status: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    setAttendances(prev => ({
      ...prev,
      [customerId]: status,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'EXCUSED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-8 md:ml-72">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Отметить посещаемость</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Назад
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black p-2"
              >
                <option value="">Выберите группу</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black p-2"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {selectedGroup && customers.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Клиенты</h2>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(customer.id, 'PRESENT')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          attendances[customer.id] === 'PRESENT'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                        }`}
                      >
                        <span className="hidden md:block">Присутствует</span>
                        <span className="block md:hidden">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(customer.id, 'ABSENT')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          attendances[customer.id] === 'ABSENT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                      >
                        <span className="hidden md:block">Отсутствует</span>
                        <span className="block md:hidden">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedGroup && customers.length === 0 && (
            <div className="mt-6 text-center text-gray-500">
              В этой группе нет клиентов
            </div>
          )}

          {selectedGroup && customers.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 