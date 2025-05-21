import React, { useRef, useCallback, memo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import { FaTrash, FaGripVertical } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { throttle } from 'lodash';
import {MultiBackend, TouchTransition} from "react-dnd-multi-backend";

const ItemType = 'CATEGORY';

// Funktion för att detektera om enheten stöder touch
const isTouchDevice = () => {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);
};



// Välj rätt backend baserat på enhetstyp
const getBackend = () => {
    return isTouchDevice() ?
        TouchBackend({ enableMouseEvents: true }) :
        HTML5Backend;
};

const DraggableCategory = memo(({ category, index, moveCategory, onNameChange, onDelete }) => {
    const ref = useRef(null);

    const throttledMove = useRef(
        throttle((dragIndex, hoverIndex) => {
            moveCategory(dragIndex, hoverIndex);
        }, 50)
    ).current;

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (item.index === index) return;
            throttledMove(item.index, index);
            item.index = index;
        },
    });

    const handleDeleteClick = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${category.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(category.id);
            }
        });
    }, [category.id, category.name, onDelete]);

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => ({ id: category.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (
        <div className="flex items-center justify-center">
            <div
                ref={ref}
                className={`w-96 border border-orange-400 rounded-md p-2 my-2 flex items-center justify-between ${isDragging ? 'opacity-50' : ''}`}
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
                <button onClick={handleDeleteClick} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
});

const EditCategoryForm = ({
                              categories,
                              onNameChange,
                              onDelete,
                              onSave,
                              saving,
                              error,
                              successMessage,
                              moveCategory
                          }) => {
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase() !== "nocategory"
    );
    const HTML5toTouch = {
        backends: [
            {
                id: 'html5',
                backend: HTML5Backend,
                transition: TouchTransition
            },
            {
                id: 'touch',
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true
            }
        ]
    };

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <div className="z-10 bg-white rounded-lg my-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full p-4">
                <div className="text-center text-2xl text-[#166BB3] font-semibold mb-4">Edit Category</div>

                {error && <div className="text-red-600 text-center mb-2">{error}</div>}
                {successMessage && <div className="text-green-600 text-center mb-2">{successMessage}</div>}

                {filteredCategories.map((category, index) => (
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

export default EditCategoryForm;
