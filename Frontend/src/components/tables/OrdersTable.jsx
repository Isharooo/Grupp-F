import React from 'react';
import { FaEdit, FaPrint, FaFileDownload, FaSortUp, FaSortDown } from 'react-icons/fa';

const SortIcon = ({ active, direction, onClick }) => (
    <span className={`cursor-pointer ${active ? 'text-blue-600' : 'text-gray-300'}`} onClick={onClick}>
    {direction === 'asc' ? <FaSortUp /> : <FaSortDown />}
  </span>
);

const TableHeader = ({ label, field, sortConfig, onSort }) => (
    <th className="p-2 text-left cursor-pointer" onClick={() => onSort(field)}>
        <div className="flex items-center gap-1">
            {label}
            <span className="ml-1 inline-flex flex-col gap-0.5">
        <SortIcon
            active={sortConfig.field === field && sortConfig.direction === 'asc'}
            direction="asc"
            onClick={(e) => { e.stopPropagation(); onSort(field, 'asc'); }}
        />
        <SortIcon
            active={sortConfig.field === field && sortConfig.direction === 'desc'}
            direction="desc"
            onClick={(e) => { e.stopPropagation(); onSort(field, 'desc'); }}
        />
      </span>
        </div>
    </th>
);

const OrdersTable = ({
                         orders,
                         selectedIds,
                         setSelectedIds,
                         columns,
                         sortConfig,
                         onSort,
                         setEditingOrder,
                         isActiveSection,
                         recentlyReturnedOrderIds
                     }) => {
    return (
        <table className="w-full border-collapse">
            <thead>
            <tr className="border-b-2 border-orange-300">
                <th className="p-2 w-8"></th>
                {columns.map(col => (
                    <TableHeader
                        key={col.field}
                        label={col.label}
                        field={col.field}
                        sortConfig={sortConfig}
                        onSort={(field, direction) => onSort(field, direction)}
                    />
                ))}
                {isActiveSection && <th className="p-2 text-left">Actions</th>}
            </tr>
            </thead>
            <tbody>
            {orders.map(order => (
                <tr key={order.id} className="border-b border-orange-200 hover:bg-gray-50">
                    <td className="p-2">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(order.id)}
                            onChange={e => {
                                const checked = e.target.checked;
                                setSelectedIds(prev =>
                                    checked ? [...prev, order.id] : prev.filter(id => id !== order.id)
                                );
                            }}
                        />
                    </td>
                    <td className={`p-2 ${recentlyReturnedOrderIds.includes(order.id) ? "text-red-600 font-bold" : ""}`}>
                        {order.customerName}
                    </td>
                    <td className="p-2">{new Date(order.creationDate).toLocaleDateString()}</td>
                    <td className="p-2">
                        {order.sendDate
                            ? new Date(order.sendDate).toLocaleDateString()
                            : 'Pending'}
                    </td>
                    {isActiveSection && (
                        <td className="p-2 flex gap-2">
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                                onClick={() => setEditingOrder(order)}
                            >
                                <FaEdit />
                            </button>
                            <button className="text-green-600 hover:text-green-800" title="Print">
                                <FaPrint />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800" title="Download">
                                <FaFileDownload />
                            </button>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default OrdersTable;
