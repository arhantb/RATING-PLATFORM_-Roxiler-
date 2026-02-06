import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../store';
import { api } from '../services/api';
import { Store, Role } from '../types';

interface UseStoresReturn {
    stores: Store[];
    myStores: Store[];
    isLoading: boolean;
    error: string | null;
    createStore: (data: { name: string; address: string; description?: string }) => Promise<void>;
    updateStore: (id: string, data: any) => Promise<void>;
    deleteStore: (id: string) => Promise<void>;
    refetch: () => Promise<void>;
}

export const useStores = (): UseStoresReturn => {
    const [stores, setStores] = useState<Store[]>([]);
    const [myStores, setMyStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useAtomValue(tokenAtom);
    const user = useAtomValue(userAtom);

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.stores.getAll(token);
            setStores(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch stores');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const fetchMyStores = useCallback(async () => {
        if (!token || user?.role !== Role.OWNER) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await api.stores.getMyStores(token);
            setMyStores(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch my stores');
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.role]);

    useEffect(() => {
        fetchStores();
        if (user?.role === Role.OWNER) {
            fetchMyStores();
        }
    }, [fetchStores, fetchMyStores, user?.role]);

    const createStore = useCallback(async (data: { name: string; address: string; description?: string }) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.stores.create(token, data);
            await fetchStores();
            if (user?.role === Role.OWNER) {
                await fetchMyStores();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create store');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.role, fetchStores, fetchMyStores]);

    const updateStore = useCallback(async (id: string, data: any) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.stores.update(token, id, data);
            await fetchStores();
            if (user?.role === Role.OWNER) {
                await fetchMyStores();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update store');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.role, fetchStores, fetchMyStores]);

    const deleteStore = useCallback(async (id: string) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.stores.delete(token, id);
            await fetchStores();
            if (user?.role === Role.OWNER) {
                await fetchMyStores();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete store');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.role, fetchStores, fetchMyStores]);

    const refetch = useCallback(async () => {
        await fetchStores();
        if (user?.role === Role.OWNER) {
            await fetchMyStores();
        }
    }, [fetchStores, fetchMyStores, user?.role]);

    return {
        stores,
        myStores,
        isLoading,
        error,
        createStore,
        updateStore,
        deleteStore,
        refetch,
    };
};
