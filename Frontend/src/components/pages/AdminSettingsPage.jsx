import React from 'react';
import Background from '../common/Background';
import Title from '../common/Title';
import MyButton from "../common/Button";
import {Link} from "react-router-dom";

const AdminSettingsPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-fuchsia-50 overflow-hidden">
            {/* Bakgrundskomponenten */}
            <Background />

            {/* Titelkomponenten */}
            <Title />

            {/* Inloggningsformulär */}
            <div className="z-10 bg-white rounded-lg px-8 pt-6 pb-8 w-full max-w-sm mt-8
                      shadow-[0_0_8px_2px_rgba(251,146,60,0.3)]">

                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <MyButton
                            label="Edit Products"

                        />
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label="New Product"

                        />
                    </div>
                </div>
                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <MyButton
                            label="Edit Categories"

                        />
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label="New Categories"

                        />
                    </div>
                </div>
                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <MyButton
                            label="Edit Accounts"

                        />
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label="New Account"

                        />
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <Link to="/orders">
                        <MyButton label="Back" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
