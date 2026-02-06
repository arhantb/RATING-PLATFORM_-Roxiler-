import React from 'react';
import { Button } from './UI';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 max-w-md w-full shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-primary-400 hover:text-primary-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

interface ModalFormProps {
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    children: React.ReactNode;
}

export const ModalForm: React.FC<ModalFormProps> = ({
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    isLoading = false,
    children,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {children}
            <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    {cancelLabel}
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
