import React, { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from './Dialog';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'admn_no', numeric: false, disablePadding: true, label: 'Admission Number' },
  { id: 'deptid', numeric: false, disablePadding: true, label: 'Department' },
  { id: 'courseid', numeric: false, disablePadding: true, label: 'Course' },
  { id: 'branchid', numeric: false, disablePadding: true, label: 'Branch' },
  { id: 'fee_amt', numeric: true, disablePadding: true, label: 'Fees Amount' },
  { id: 'transaction_id', numeric: false, disablePadding: true, label: 'Transaction Id' },
  { id: 'feeStatus', disablePadding: false, label: 'Fee Status' },
  { id: 'fee_date', numeric: false, disablePadding: true, label: 'Date' },
  { id: 'semester', numeric: false, disablePadding: true, label: 'Semester' },
  { id: 'action', numeric: false, disablePadding: true, label: 'Action' }
];

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align='center'>
            <Typography fontWeight={700} variant='button' fontSize={13}>{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function ViewRegistered({ students, isSubmit }) {

  students.map((student) => { student['feeStatus'] = student.transaction_id === null||student.transaction_id === '' ? 'NA' : 'SUCCESS' });

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const [student,setStudent] = useState();

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const visibleRows = stableSort(students, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = students.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (rowData) => {setSelectedRowData(rowData);setShow(true)};
  useEffect(() => {
    const preSelectedRows = students.filter((row) => row.feeStatus === 'SUCCESS').map((row) => row.id);
    setSelected(preSelectedRows);
  }, [students]);

  useEffect(() => {
    selectedRowData&&fetch('http://127.0.0.1:8000/api/info',
    {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {   session_year:selectedRowData?.session_year,
                session:selectedRowData?.session,
                admn_no:selectedRowData?.admn_no
            })
    }).then(response => response.json()).then((json) => {
        setStudent(json);
        setShow(true);
    });
  }, [selectedRowData]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 5 }}>
        <TableContainer>
          <Table sx={{ minWidth: 600 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              orderBy={orderBy}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              rowCount={students.length}
              students={students}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role='checkbox'
                    aria-checked={selected.indexOf(row.id) !== -1}
                    tabIndex={-1}
                    key={row.id}
                    selected={selected.indexOf(row.id) !== -1}
                    sx={{ cursor: 'pointer', backgroundColor: row.feeStatus === 'NA' ? alpha('#F44336', 0.1) : 'white' }}
                  >
                    {headCells.map((headCell) =>
                      headCell.id !== 'action' ? (
                        <TableCell key={headCell.id} align='center' padding='none'>
                          <Typography variant='button' fontSize={12} fontWeight={500}>{row[headCell.id]}</Typography>
                        </TableCell>
                      ) : (
                        <TableCell align='center'>
                          <Button variant='contained' size='small' onClick={() => handleViewDetails(row)}>
                            View
                          </Button>
                        </TableCell>
                      )
                    )}
                    {show &&student&& <Dialog submit={show} isSubmit={setShow} student={student} bool={1}/>}
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
