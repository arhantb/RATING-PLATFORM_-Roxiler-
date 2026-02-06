import React from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '../store';
import { Role } from '../types';
import { useDashboard } from '../hooks/useDashboard';
import { useStores } from '../hooks/useStores';
import { Badge } from '../components/UI';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white p-6 border border-primary-200 shadow-sm">
    <dt className="text-sm font-medium text-primary-500 truncate">{label}</dt>
    <dd className="mt-1 text-3xl font-semibold text-primary-900">{value}</dd>
  </div>
);

export const Dashboard: React.FC = () => {
  const user = useAtomValue(userAtom);
  const { stats, isLoading } = useDashboard();
  const { myStores } = useStores();

  if (user?.role === Role.ADMIN) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Admin Dashboard</h1>
          <p className="text-primary-500 mt-1">Overview of the system.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-primary-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Users" value={stats.users} />
            <StatCard label="Total Stores" value={stats.stores} />
            <StatCard label="Total Ratings" value={stats.ratings} />
          </div>
        )}

        <div className="bg-primary-100 p-6 border border-primary-200">
          <h3 className="font-semibold text-primary-800">Quick Actions</h3>
          <div className="flex gap-4 mt-4">
            <Link to="/users" className="bg-white px-4 py-2 text-sm font-medium border border-primary-300 hover:bg-primary-50 text-primary-700">Manage Users</Link>
            <Link to="/stores" className="bg-white px-4 py-2 text-sm font-medium border border-primary-300 hover:bg-primary-50 text-primary-700">Manage Stores</Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === Role.OWNER) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Owner Dashboard</h1>
          <p className="text-primary-500 mt-1">Manage your business presence.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-primary-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard label="My Stores" value={stats.stores} />
            <StatCard label="Average Rating" value={stats.ratings.toFixed(1)} />
          </div>
        )}

        <div className="bg-white border border-primary-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-primary-200">
            <h3 className="font-semibold text-primary-900">My Stores</h3>
          </div>
          <ul className="divide-y divide-primary-200">
            {myStores.map(store => (
              <li key={store.id} className="px-6 py-4 flex justify-between items-center hover:bg-primary-50">
                <div>
                  <p className="font-medium text-primary-900">{store.name}</p>
                  <p className="text-sm text-primary-500">{store.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge color="blue">{store.averageRating || 0} / 5</Badge>
                  <Link to={`/stores`} className="text-sm text-primary-600 hover:underline">View Details</Link>
                </div>
              </li>
            ))}
            {myStores.length === 0 && <li className="px-6 py-8 text-center text-primary-500 text-sm">You haven't added any stores yet.</li>}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 border border-primary-200 text-center">
        <h1 className="text-2xl font-bold text-primary-900">Welcome back, {user?.name}!</h1>
        <p className="text-primary-500 mt-2 max-w-lg mx-auto">Explore local stores, leave ratings, and help others find the best spots in town.</p>
        <div className="mt-8">
          <Link to="/stores" className="inline-block bg-primary-900 text-white px-6 py-3 font-medium hover:bg-primary-800 transition-colors">Browse Stores</Link>
        </div>
      </div>
    </div>
  );
};