import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import { useUserManagement } from '../hooks/useUserManagement';

const EditAccounts = () => {
    const {
        users, error, successMessage, isUpdating, isDeleting,
        fetchUsers, updateUser, deleteUser, setError, setSuccessMessage
    } = useUserManagement();

    const [selectedUserId, setSelectedUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
        setUsername('');
        setPassword('');
        setError('');
        setSuccessMessage('');
    };

    const handleUpdateUser = async () => {
        if (!selectedUserId) {
            setError('Please select a user to update');
            return;
        }
        if (!username && !password) {
            setError('Please enter a new username or password');
            return;
        }
        await updateUser(selectedUserId, { username, password });
        setUsername('');
        setPassword('');
    };

    const handleDelete = async () => {
        if (!selectedUserId) {
            setError('Please select a user to delete');
            return;
        }
        await deleteUser(selectedUserId);
        setSelectedUserId('');
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">Edit Accounts</div>
                {error && <div className="text-red-600 text-center mt-4">{error}</div>}
                {successMessage && <div className="text-green-600 text-center mt-4">{successMessage}</div>}
                <div className="mt-8 flex items-center justify-center">
                    <div className="relative w-60">
                        <select
                            className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                            value={selectedUserId}
                            onChange={e => handleUserSelect(e.target.value)}
                        >
                            <option value="">Select user...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username || user.firstName + ' ' + user.lastName}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                {selectedUserId && (
                    <>
                        <div className="mt-8 flex items-center justify-center">
                            <input
                                type="text"
                                placeholder="New Username"
                                className="w-60 text-lg py-2 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mt-8 flex items-center justify-center">
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-60 text-lg py-2 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" size="sm" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label={isDeleting ? "Deleting..." : "Delete"}
                            size="sm"
                            onClick={handleDelete}
                            disabled={!selectedUserId || isDeleting || isUpdating}
                        />
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label={isUpdating ? "Updating..." : "Update"}
                            size="sm"
                            onClick={handleUpdateUser}
                            disabled={!selectedUserId || (!username && !password) || isDeleting || isUpdating}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAccounts;
