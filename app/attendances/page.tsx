'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { use } from 'react';

interface Attendance {
  id: number;
  customerId: number;
  customerName: string;
  groupId: number;
  groupName: string;
  date: string;
  isPresent: boolean;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED';
}

interface Group {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}

export default function AttendancesPage({ params }: { params: Promise<{}> }) {
  use(params); // Unwrap params even though we're not using it yet
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth()+1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [groups, setGroups] = useState<Group[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();
        console.log('Fetched groups:', data);
        setGroups(data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        console.log('Fetched customers:', data);
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchGroups();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        let url = '/api/attendances';
        const params = new URLSearchParams();
        
        if (selectedGroup) params.append('groupId', selectedGroup);
        if (selectedCustomer) params.append('customerId', selectedCustomer);
        if (selectedMonth) params.append('month', selectedMonth);
        if (selectedYear) params.append('year', selectedYear);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        console.log('Fetching attendances from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch attendances');
        const data = await response.json();
        console.log('Fetched attendances:', data);
        setAttendances(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching attendances:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAttendances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [selectedGroup, selectedCustomer, selectedMonth, selectedYear]);

  console.log(attendances);
  const getStatusColor = (status: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
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

  const getStatusText = (status: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    switch (status) {
      case 'PRESENT':
        return 'Присутствует';
      case 'ABSENT':
        return 'Отсутствует';
      case 'EXCUSED':
        return 'Уважительная причина';
      default:
        return 'Неизвестно';
    }
  };

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen md:ml-72">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 md:ml-72">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">Ошибка загрузки данных</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 md:ml-72">
      <div className="flex flex-col mt-8 md:mt-0 md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Посещаемость</h1>
        <Link
          href="/attendances/new"
          className=" text-sm md:text-base px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          Отметить посещаемость
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Группа
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black p-2"
            >
              <option value="">Все группы</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id.toString()}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Клиент
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black p-2"
            >
              <option value="">Все клиенты</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id.toString()}>
                  {customer.firstName} {customer.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Месяц
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black p-2"
            >
              {months.map((month, index) => (
                <option key={index+1} value={(index+1).toString()}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Год
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black p-2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendances.map((attendance) => (
                console.log(attendance),
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/customers/${attendance.customerId}`}
                      className="text-gray-900 hover:text-purple-600"
                    >
                      {attendance.customerName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/groups/${attendance.groupId}`}
                      className="text-gray-900 hover:text-purple-600"
                    >
                      {attendance.groupName}
                    </Link>
                  </td>
                  <td className="text-gray-900 px-6 py-4 whitespace-nowrap">
                    {format(parseISO(attendance.date), 'd MMMM yyyy', { locale: ru })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(attendance.status)}`}>
                      {getStatusText(attendance.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                    <Link
                      href={`/attendances/${attendance.id}/edit`}
                      className="text-purple-600 hover:text-purple-900 px-auto"
                    >
                     <span className="hidden md:block">Редактировать</span>
                     <span className="block md:hidden">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                     </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendances.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет записей о посещаемости</p>
          </div>
        )}
      </div>
    </div>
  );
} 