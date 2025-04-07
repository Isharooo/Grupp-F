import React from 'react';
import Background from './Background';
import Title from './Title';

const LoginPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-fuchsia-50 overflow-hidden">
            {/* Bakgrundskomponenten */}
            <Background />

            {/* Titelkomponenten */}
            <Title />

            {/* Inloggningsformulär */}
            <div className="z-10 bg-white rounded-lg px-8 pt-6 pb-8 w-full max-w-sm mt-8
                      shadow-[0_0_8px_2px_rgba(251,146,60,0.3)]">
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Användarnamn
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Användarnamn"
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Lösenord
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="********"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Logga in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
