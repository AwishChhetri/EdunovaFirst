import React from 'react';
import { flexRender } from '@tanstack/react-table';

const TableRow = ({ row, onClick }) => (
  <tr style={styles.row} onClick={() => onClick(row.original)}>
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} style={styles.td}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);

const styles = {
  row: { cursor: 'pointer' },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
};

export default TableRow;
