import React from 'react';
import Background from '../common/Background';
import Title from '../common/Title';
import MyButton from "../common/Button";
import {Link} from "react-router-dom";
import TextField from "../common/TextField";

const LoginPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Bakgrundskomponenten */}
            <Background />

            {/* Titelkomponenten */}
            <Title />

            {/* Inloggningsformulär */}
            <div className="z-10 bg-white rounded-lg px-8 pt-6 pb-8 w-full max-w-sm mt-8
                      shadow-[0_0_8px_2px_rgba(251,146,60,0.3)]">
                <div className="mb-12 mt-4 flex items-center justify-center">
                    <TextField id="username" placeholder="Username" />
                </div>

                <div className="mb-12 flex items-center justify-center">
                    <TextField id="password" type="password" placeholder="Password" />
                </div>
                <div className="mb-4 flex items-center justify-center">
                    <Link to="/orders"> <MyButton label="Log in" /> </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
