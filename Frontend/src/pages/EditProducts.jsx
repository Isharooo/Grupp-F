import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import ProductForm from '../components/products/ProductForm';
import ProductSearchAutocomplete from '../components/products/ProductSearchAutocomplete';
import MyButton from "../components/common/Button";
import { useEditProduct } from '../hooks/useEditProduct';

const EditProducts = () => {
    const {
        products,
        categories,
        selectedProduct,
        setSelectedProduct,
        searchValue,
        setSearchValue,
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
        saving,
        deleting,
        handleSave,
        handleDelete
    } = useEditProduct();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">Edit Products</div>

                <ProductSearchAutocomplete
                    products={products}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />

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
                    isSaving={saving}
                    handleSave={handleSave}
                    returnLink="/AdminSettings"
                    title=""
                    disabled={!selectedProduct}
                />

                {/* Delete button - separerad från ProductForm för tydlighets skull */}
                <div className="my-4 flex items-center justify-center">
                    <div className="mx-6">
                        <MyButton
                            label={deleting ? "Deleting..." : "Delete"}
                            onClick={handleDelete}
                            disabled={deleting || !selectedProduct}
                            size="sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProducts;
