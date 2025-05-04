import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import {Link} from "react-router-dom";
import TextField from "../components/common/TextField";
import CategoryDropdown from "../components/common/CategoryDropdown";
import api from '../services/api';

const NewProduct = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.getCategories()
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Kunde inte hämta kategorier", err));
    }, []);
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />

            <Title />

            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">New Product</div>
                <div className="my-4 flex items-center justify-center">
                    <div className="mr-10">
                        <TextField id="productName" placeholder="Product Name"/>
                    </div>
                    <div className="ml-10">
                        <TextField id="price" placeholder="Price" />
                    </div>
                </div>

                <div className="my-10 flex items-center justify-center">
                    <div className="mr-10">
                        <TextField id="articleNr" placeholder="Article Number"/>
                    </div>
                    <div className="ml-10">
                        <TextField id="imageURL" placeholder="Image URL" />
                    </div>
                </div>

                <div className="my-6 flex items-center justify-center">
                    <div className="mr-10">
                        <TextField id="weight" placeholder="Weight"/>
                    </div>
                    <div className="ml-10">
                        <CategoryDropdown />
                    </div>
                </div>

                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton label="Save"/>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;
