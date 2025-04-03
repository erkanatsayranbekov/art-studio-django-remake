'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GroupCard from '@/app/components/GroupCard';
import Cookies from 'js-cookie';

interface Group {
  id: number;
  name: string;
  description: string;
  weekdays: string;
  startTime: string;
  endTime: string;
  price: number;
  isPermanent: boolean;
  customers: any[];
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(Cookies.get('auth-token') !== undefined);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center md:ml-72">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center md:ml-72">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Ошибка</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-8 py-8 md:ml-72">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Группы</h1>
          {isAuthenticated && (
            <Link
              href="/groups/new"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Создать группу
            </Link>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Нет доступных групп</p>
            {isAuthenticated && (
              <Link
                href="/groups/new"
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
              >
                Создать первую группу
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                description={group.description}
                weekdays={group.weekdays}
                startTime={group.startTime}
                endTime={group.endTime}
                price={group.price}
                isPermanent={group.isPermanent}
                customerCount={group.customers.length}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 