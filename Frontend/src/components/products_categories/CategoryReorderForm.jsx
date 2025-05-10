import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import MyButton from "../common/Button";
import { Link } from "react-router-dom";
import { FaTrash, FaGripVertical } from 'react-icons/fa';

const CategoryReorderForm = ({
                                 categories,
                                 onNameChange,
                                 onDelete,
                                 onDragEnd,
                                 onSave,
                                 saving,
                                 error,
                                 successMessage
                             }) => {
    return (
        <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full p-4">
            <div className="text-center text-2xl text-[#166BB3] font-semibold mb-4">Edit Category</div>

            {error && <div className="text-red-600 text-center mb-2">{error}</div>}
            {successMessage && <div className="text-green-600 text-center mb-2">{successMessage}</div>}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {categories.map((category, index) => (
                                <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="bg-gray-100 border border-gray-300 rounded-md p-2 my-2 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div {...provided.dragHandleProps} className="cursor-move text-gray-500">
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
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

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
    );
};

export default CategoryReorderForm;
