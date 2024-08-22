import React from 'react';
import { flexRender } from '@tanstack/react-table';
import TableRow from './TableRow';

const Table = ({ table, onRowClick }) => (
  <table style={styles.table}>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} style={styles.th}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} row={row} onClick={onRowClick} />
      ))}
    </tbody>
  </table>
);

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  th: {
    padding: '12px',
    backgroundColor: '#f3f3f3',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
};

export default Table;
