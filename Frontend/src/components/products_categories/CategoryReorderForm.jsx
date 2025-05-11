import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MyButton from "../common/Button";
import { Link } from "react-router-dom";
import { FaTrash, FaGripVertical } from 'react-icons/fa';

const ItemType = 'CATEGORY';

const DraggableCategory = ({ category, index, moveCategory, onNameChange, onDelete }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (item.index === index) return;
            moveCategory(item.index, index);
            item.index = index;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: category.id, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`bg-gray-100 border border-gray-300 rounded-md p-2 my-2 flex items-center justify-between ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center gap-2">
                <div className="cursor-move text-gray-500">
                    <FaGripVertical />
                </div>
                <input
                    type="text"
                    value={category.name}
                    onChange={(e) => onNameChange(category.id, e.target.value)}
                    className="bg-transparent focus:outline-none text-lg"
                />
            </div>
            <button onClick={() => onDelete(category.id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
            </button>
        </div>
    );
};

const CategoryReorderForm = ({
                                 categories,
                                 onNameChange,
                                 onDelete,
                                 onSave,
                                 saving,
                                 error,
                                 successMessage,
                                 moveCategory
                             }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full p-4">
                <div className="text-center text-2xl text-[#166BB3] font-semibold mb-4">Edit Category</div>

                {error && <div className="text-red-600 text-center mb-2">{error}</div>}
                {successMessage && <div className="text-green-600 text-center mb-2">{successMessage}</div>}

                {categories.map((category, index) => (
                    <DraggableCategory
                        key={category.id}
                        index={index}
                        category={category}
                        moveCategory={moveCategory}
                        onNameChange={onNameChange}
                        onDelete={onDelete}
                    />
                ))}

                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton label={saving ? "Saving..." : "Save"} onClick={onSave} disabled={saving} />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default CategoryReorderForm;