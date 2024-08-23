import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { FaCheckCircle, FaTimesCircle, FaFilter ,FaPlus} from 'react-icons/fa';
import TableRow from './TableRow';

const Table = ({ table, onRowClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="overflow-x-auto">
    

      
      {/* Table */}
      <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right bg-purple-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap px-6 py-3 font-medium text-purple-900"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-500">
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} row={row} onClick={onRowClick}>
              
              {/* Static Status Icon Column */}
              <td className="px-6 py-4 text-center">
                <FaCheckCircle className="text-green-500" />
              </td>

              {/* Static Empty Team Column */}
              <td className="px-6 py-4">
                {/* Empty for now, can add static content here */}
              </td>

              {/* Other Columns */}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
