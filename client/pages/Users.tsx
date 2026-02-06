import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User, Role } from '../types';
import { Button, Input, Badge } from '../components/UI';
import { Modal, ModalForm } from '../components/Modal';
import { Table } from '../components/Table';

export const Users: React.FC = () => {
    const { users, isLoading, createUser, deleteUser } = useUsers();
    const [filter, setFilter] = useState('');
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: Role.USER });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            setIsModalOpen(false);
            setNewUser({ name: '', email: '', password: '', address: '', role: Role.USER });
        } catch (e) {
            alert('Failed to create user');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteUser(id);
        } catch (e) {
            alert('Failed to delete');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(filter.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.toLowerCase()) ||
        u.role.toLowerCase().includes(filter.toLowerCase())
    );

    const columns = [
        {
            header: 'Name',
            accessor: 'name' as keyof User,
            className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900',
        },
        {
            header: 'Email',
            accessor: 'email' as keyof User,
            className: 'px-6 py-4 whitespace-nowrap text-sm text-primary-600',
        },
        {
            header: 'Role',
            accessor: (user: User) => (
                <Badge color={user.role === Role.ADMIN ? 'blue' : user.role === Role.OWNER ? 'green' : 'gray'}>
                    {user.role}
                </Badge>
            ),
            className: 'px-6 py-4 whitespace-nowrap text-sm',
        },
        {
            header: 'Address',
            accessor: (user: User) => user.address || '-',
            className: 'px-6 py-4 whitespace-nowrap text-sm text-primary-500 truncate max-w-xs',
        },
        {
            header: 'Actions',
            accessor: (user: User) => (
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                    Delete
                </button>
            ),
            className: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium',
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-primary-900">User Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>+ Add User</Button>
            </div>

            <div className="mb-6">
                <Input label="Filter Users" placeholder="Name, Email, or Role..." value={filter} onChange={e => setFilter(e.target.value)} />
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-primary-400">Loading users...</div>
            ) : (
                <Table
                    data={filteredUsers}
                    columns={columns}
                    keyExtractor={(user) => user.id}
                />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
                <ModalForm onSubmit={handleCreateUser} onCancel={() => setIsModalOpen(false)} submitLabel="Create User">
                    <Input label="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                    <Input label="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                    <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                    <Input label="Address" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
                    <div>
                        <label className="block text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Role</label>
                        <select
                            className="block w-full px-3 py-2 border border-primary-200 text-sm"
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                        >
                            <option value={Role.USER}>User</option>
                            <option value={Role.OWNER}>Store Owner</option>
                            <option value={Role.ADMIN}>Admin</option>
                        </select>
                    </div>
                </ModalForm>
            </Modal>
        </div>
    );
};