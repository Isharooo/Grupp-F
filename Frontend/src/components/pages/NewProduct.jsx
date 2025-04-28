import React, { useEffect, useState } from 'react';
import Background from '../common/Background';
import Title from '../common/Title';
import MyButton from "../common/Button";
import {Link} from "react-router-dom";
import TextField from "../common/TextField";
import api from '../../services/api';

const NewProducts = () => {
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

            <div className="z-10 bg-white rounded-lg px-8 pt-6 pb-8 mt-8 w-full max-w-xl h-96 shadow-[0_0_8px_2px_rgba(251,146,60,0.3)]">

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

                <div className="my-10 flex items-center justify-center">
                    <div className="mr-16">
                        <TextField id="weight" placeholder="Weight"/>
                    </div>
                    <div className="relative">
                        <select
                            className="w-44 px-4 py-1
                   border-2 border-orange-400
                   text-center italic font-semibold text-slate-400
                   rounded-none appearance-none
                   bg-white
                   focus:outline-none" defaultValue=""
                        >
                            <option disabled value="">Categories</option>
                            <option disabled selected hidden>Categories</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat.id ?? cat.name}>
                                    {cat.name ?? cat}
                                </option>
                            ))}
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                                className="w-5 h-5 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="my-16 flex items-center justify-center">
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

export default NewProducts;
