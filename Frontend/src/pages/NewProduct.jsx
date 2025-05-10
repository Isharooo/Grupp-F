import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import ProductForm from '../components/products_categories/ProductForm';
import { useNewProduct } from '../hooks/useNewProduct';

const NewProduct = () => {
    const {
        categories,
        productName,
        setProductName,
        price,
        setPrice,
        articleNumber,
        setArticleNumber,
        imageURL,
        setImageURL,
        weight,
        setWeight,
        categoryId,
        setCategoryId,
        error,
        successMessage,
        isSaving,
        handleSave
    } = useNewProduct();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <ProductForm
                    productName={productName}
                    setProductName={setProductName}
                    price={price}
                    setPrice={setPrice}
                    articleNumber={articleNumber}
                    setArticleNumber={setArticleNumber}
                    imageURL={imageURL}
                    setImageURL={setImageURL}
                    weight={weight}
                    setWeight={setWeight}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    categories={categories}
                    error={error}
                    successMessage={successMessage}
                    isSaving={isSaving}
                    handleSave={handleSave}
                    returnLink="/AdminSettings"
                    title="New Product"
                />
            </div>
        </div>
    );
};

export default NewProduct;
