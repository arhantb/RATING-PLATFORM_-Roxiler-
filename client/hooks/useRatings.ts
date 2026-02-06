import { useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../store';
import { api } from '../services/api';
import { Rating } from '../types';

interface UseRatingsReturn {
    ratings: Rating[];
    isLoading: boolean;
    error: string | null;
    createRating: (data: { storeId: string; rating: number }) => Promise<void>;
    updateRating: (id: string, data: { rating: number }) => Promise<void>;
    deleteRating: (id: string) => Promise<void>;
    fetchRatingsByStore: (storeId: string) => Promise<void>;
}

export const useRatings = (): UseRatingsReturn => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useAtomValue(tokenAtom);

    const fetchRatingsByStore = useCallback(async (storeId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.ratings.getByStore(token, storeId);
            setRatings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch ratings');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const createRating = useCallback(async (data: { storeId: string; rating: number }) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.ratings.create(token, data);
        } catch (err: any) {
            setError(err.message || 'Failed to create rating');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const updateRating = useCallback(async (id: string, data: { rating: number }) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.ratings.update(token, id, data);
        } catch (err: any) {
            setError(err.message || 'Failed to update rating');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const deleteRating = useCallback(async (id: string) => {
        if (!token) throw new Error('Not authenticated');

        setIsLoading(true);
        setError(null);
        try {
            await api.ratings.delete(token, id);
        } catch (err: any) {
            setError(err.message || 'Failed to delete rating');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    return {
        ratings,
        isLoading,
        error,
        createRating,
        updateRating,
        deleteRating,
        fetchRatingsByStore,
    };
};
