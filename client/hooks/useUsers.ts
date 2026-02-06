import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../store';
import { api } from '../services/api';
import { User } from '../types';

interface UseUsersReturn {
    users: User[];
    isLoading: boolean;
    error: string | null;
    createUser: (data: any) => Promise<void>;
    updateUser: (id: string, data: any) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    refetch: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useAtomValue(tokenAtom);

    const fetchUsers = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await api.users.getAll(token);
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = useCallback(async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.auth.register(data);
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to create user');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchUsers]);

    const updateUser = useCallback(async (id: string, data: any) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.users.update(token, id, data);
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token, fetchUsers]);

    const deleteUser = useCallback(async (id: string) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.users.delete(token, id);
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to delete user');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token, fetchUsers]);

    return {
        users,
        isLoading,
        error,
        createUser,
        updateUser,
        deleteUser,
        refetch: fetchUsers,
    };
};
