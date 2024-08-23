import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TableRow = ({ row, onClick }) => (
  <tr style={styles.row} onClick={() => onClick(row.original)}>
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} style={styles.td}>
        {/* Conditional rendering of icons and text based on the column type */}
        {cell.column.id === 'status' ? (
          <div style={styles.statusContainer}>
            {cell.getValue() === 'Active' ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span style={styles.statusText}>Active</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500" />
                <span style={styles.statusText}>Inactive</span>
              </>
            )}
          </div>
        ) : cell.column.id === 'Teams' ? (
          <button
            style={{
              ...styles.teamButton,
              backgroundColor: getTeamColor(cell.getValue()),
            }}
          >
            {cell.getValue()}
          </button>
        ) : (
          flexRender(cell.column.columnDef.cell, cell.getContext())
        )}
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
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusText: {
    marginLeft: '8px',
    fontSize: '14px',
    color: '#4A5568', // text-gray-700 equivalent
  },
  teamButton: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'default',
  },
};

// Function to determine the color of the team button
const getTeamColor = (team) => {
  switch (team) {
    case 'Team A':
      return '#4299E1'; // blue-500 equivalent
    case 'Team B':
      return '#48BB78'; // green-500 equivalent
    case 'Team C':
      return '#ECC94B'; // yellow-500 equivalent
    default:
      return '#A0AEC0'; // gray-500 equivalent
  }
};

export default TableRow;
