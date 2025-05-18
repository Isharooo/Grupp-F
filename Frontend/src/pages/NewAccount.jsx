import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useNewAccount } from '../hooks/useNewAccount';

const NewAccount = () => {
    const navigate = useNavigate();
    const {
        username, setUsername,
        password, setPassword,
        error, loading, handleSave
    } = useNewAccount(() => navigate('/AdminSettings'));

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">New Account</div>
                {error && <div className="text-red-600 text-center mt-4">{error}</div>}
                <div className="mt-10 flex items-center justify-center">
                    <input
                        id="Username"
                        type="text"
                        placeholder="Username"
                        className="w-60 text-lg py-2 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="my-10 flex items-center justify-center">
                    <input
                        id="Password"
                        type="password"
                        placeholder="Password"
                        className="w-60 text-lg py-2 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton label={loading ? "Saving..." : "Save"} onClick={handleSave} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewAccount;
