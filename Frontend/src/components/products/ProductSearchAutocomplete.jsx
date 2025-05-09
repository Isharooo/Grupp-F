import React from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';

const filterOptions = createFilterOptions({
    ignoreCase: true,
    limit: 5,
    stringify: (option) => `${option.name} ${option.articleNumber}`,
});

const ProductSearchAutocomplete = ({
                                       products,
                                       selectedProduct,
                                       setSelectedProduct,
                                       searchValue,
                                       setSearchValue
                                   }) => {
    return (
        <div className="my-6 flex items-center justify-center">
            <Autocomplete
                id="product-search"
                options={products}
                filterOptions={filterOptions}
                getOptionLabel={option =>
                    option && (option.name || option.articleNumber)
                        ? `${option.name} (${option.articleNumber ?? '-'})`
                        : ''
                }
                value={selectedProduct}
                inputValue={searchValue}
                onInputChange={(_, newInputValue) => setSearchValue(newInputValue)}
                onChange={(_, value) => setSelectedProduct(value)}
                renderInput={(params) => (
                    <MuiTextField
                        {...params}
                        label="Sök produkt (namn eller artikelnummer)"
                        variant="outlined"
                        style={{ width: 400 }}
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="Ingen produkt funnen"
            />
        </div>
    );
};

export default ProductSearchAutocomplete;
