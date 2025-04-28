const ProductSearch = ({ value, onChange }) => {
    return (
        <div className="relative w-full md:w-64">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border rounded-lg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};