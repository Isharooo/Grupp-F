import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import {Link} from "react-router-dom";

const AdminSettingsPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />

            <Title />

                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/EditProducts"> <MyButton label="Edit Products" size="lg"/> </Link>
                    </div>
                    <div className="mx-6">
                        <Link to="/NewProduct"> <MyButton label="New Product" size="lg"/> </Link>
                    </div>
                </div>

                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/EditCategories"> <MyButton label="Edit Categories" size="lg"/> </Link>
                    </div>
                    <div className="mx-6">
                        <Link to="/NewCategory"> <MyButton label="New Categories" size="lg"/> </Link>
                    </div>
                </div>

                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/EditAccounts"> <MyButton label="Edit Accounts" size="lg"/> </Link>
                    </div>
                    <div className="mx-6">
                        <Link to="/NewAccount"> <MyButton label="New Account" size="lg"/> </Link>

                    </div>
                </div>

                <div className="my-4 flex items-center justify-center">
                    <Link to="/orders">
                        <MyButton label="Back" size="lg"/>
                    </Link>
                </div>
        </div>
    );
};

export default AdminSettingsPage;
