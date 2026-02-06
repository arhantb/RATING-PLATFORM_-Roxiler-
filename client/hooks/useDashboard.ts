import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../store';
import { api } from '../services/api';
import { Role } from '../types';

interface DashboardStats {
    users: number;
    stores: number;
    ratings: number;
}

interface UseDashboardReturn {
    stats: DashboardStats;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
    const [stats, setStats] = useState<DashboardStats>({ users: 0, stores: 0, ratings: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useAtomValue(tokenAtom);
    const user = useAtomValue(userAtom);

    const fetchStats = useCallback(async () => {
        if (!token || !user) return;

        setIsLoading(true);
        setError(null);
        try {
            if (user.role === Role.ADMIN) {
                const [users, stores] = await Promise.all([
                    api.users.getAll(token),
                    api.stores.getAll(token),
                ]);
                setStats({
                    users: users.length,
                    stores: stores.length,
                    ratings: stores.reduce((acc: number, s: any) => acc + (s.ratings?.length || 0), 0),
                });
            } else if (user.role === Role.OWNER) {
                const stores = await api.stores.getMyStores(token);
                const totalRating = stores.reduce((acc: number, s: any) => acc + (s.averageRating || 0), 0);
                setStats({
                    users: 0,
                    stores: stores.length,
                    ratings: stores.length ? totalRating / stores.length : 0,
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard stats');
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        isLoading,
        error,
        refetch: fetchStats,
    };
};
