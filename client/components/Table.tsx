import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string;
    onRowClick?: (row: T) => void;
}

export function Table<T>({ data, columns, keyExtractor, onRowClick }: TableProps<T>) {
    return (
        <div className="bg-white border border-primary-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary-200">
                    <thead className="bg-primary-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-bold text-primary-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-primary-200">
                        {data.map((row) => (
                            <tr
                                key={keyExtractor(row)}
                                onClick={() => onRowClick?.(row)}
                                className={onRowClick ? 'hover:bg-primary-50 cursor-pointer' : 'hover:bg-primary-50'}
                            >
                                {columns.map((column, index) => {
                                    const value = typeof column.accessor === 'function'
                                        ? column.accessor(row)
                                        : row[column.accessor];

                                    return (
                                        <td
                                            key={index}
                                            className={column.className || 'px-6 py-4 whitespace-nowrap text-sm text-primary-900'}
                                        >
                                            {value as React.ReactNode}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
