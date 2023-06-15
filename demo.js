import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { randomInt } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const columns = [{ field: 'ipAdresses', editable: true, width: 150 }];

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return {
    id: idCounter,
    ipAdresses: `10.50.${randomInt(0, 15)}.${randomInt(0, 255)}`,
  };
};

function updateRowPosition(initialIndex, newIndex, rows) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rowsClone = [...rows];
      const row = rowsClone.splice(initialIndex, 1)[0];
      rowsClone.splice(newIndex, 0, row);
      resolve(rowsClone);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function UpdateRowsProp() {
  const [loading, setLoading] = React.useState();
  const [rows, setRows] = React.useState(() => [
    createRandomRow(),
    createRandomRow(),
    createRandomRow(),
    createRandomRow(),
  ]);

  const handleDeleteRow = () => {
    setRows((prevRows) => {
      const rowToDeleteIndex = randomInt(0, prevRows.length - 1);
      return [
        ...rows.slice(0, rowToDeleteIndex),
        ...rows.slice(rowToDeleteIndex + 1),
      ];
    });
  };

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, createRandomRow()]);
  };

  const handleRowOrderChange = async (params) => {
    setLoading(true);
    const newRows = await updateRowPosition(
      params.oldIndex,
      params.targetIndex,
      rows
    );

    setRows(newRows);
    setLoading(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={handleDeleteRow}>
          Delete a row
        </Button>
        <Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          rowReordering
          onRowOrderChange={handleRowOrderChange}
        />
      </Box>
    </Box>
  );
}
