import React, { useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../components/common/TextField";
import api from '../services/api';

const NewAccount = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSave = async () => {
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        try {
            await api.post('/api/users', {
                username,
                firstName,
                lastName,
                email,
                password
            });

            navigate('/AdminSettings');
        } catch (err) {
            setError('Failed to create account');
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />

            <Title />

            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">New Account</div>

                {error && <div className="text-red-600 text-center mt-4">{error}</div>}

                <div className="mt-10 flex items-center justify-center">
                    <TextField
                        id="Username"
                        placeholder="Username"
                        size="lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mt-10 flex items-center justify-center">
                    <TextField
                        id="FirstName"
                        placeholder="First Name"
                        size="lg"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="mt-10 flex items-center justify-center">
                    <TextField
                        id="LastName"
                        placeholder="Last Name"
                        size="lg"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="mt-10 flex items-center justify-center">
                    <TextField
                        id="Email"
                        placeholder="Email"
                        size="lg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mt-10 flex items-center justify-center">
                    <TextField
                        id="Password"
                        placeholder="Password"
                        size="lg"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton label="Save" onClick={handleSave} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewAccount;
