import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '@mui/material/Button';
import Dialog from './Dialog';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert'

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
  const { onSelectAllClick, numSelected, students } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < students.length}
            checked={numSelected === students.length && students.length > 0}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align='center'>
            <Typography fontWeight={700} variant='button' fontSize={13}>{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

function EnhancedTableToolbar(props) {
  const { numSelected,selected,isVerify } = props;

  const handleVerify = (e) => {
    e.preventDefault();
    isVerify(true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div' pl={7}>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h7' id='tableTitle' component='div' pl={7}>
          Details
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Verify All'>
          <Grid mr={6}>
              <Button variant="contained" color="primary" size='small' onClick={handleVerify} m={10}>
                Verify
              </Button>
          </Grid>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

export default function ViewVerify({ students, isSubmit, setAlert, setMessage}) {

  students.map((student) => { student['feeStatus'] = student.transaction_id === null||student.transaction_id === '' ? 'NA' : 'SUCCESS' });

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = stableSort(students, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    const preSelectedRows = students.filter((row) => row.feeStatus === 'SUCCESS').map((row) => row.id);
    setSelected(preSelectedRows);
  }, [students]);

  const handleCheckboxChange = (event, rowId) => {
    const newSelected = [...selected];
    const isSelected = selected.indexOf(rowId) !== -1;

    if (isSelected) {
      newSelected.splice(selected.indexOf(rowId), 1);
    } else {
      newSelected.push(rowId);
    }

    setSelected(newSelected);
  };

  const [show, setShow] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const [student,setStudent] = useState();
  const [verify, isVerify] = useState(false);
  const handleViewDetails = (rowData) => {setSelectedRowData(rowData);setShow(true)};

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

  useEffect(() => {
    const verification = async()=>{
      const accessToken=localStorage.getItem('accessToken');
      selected.map(async(i)=>{
        const student=students[i];
        await fetch('http://127.0.0.1:8000/api/verify',
        {
            method:'POST',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`},
            body: JSON.stringify(
                {
                    form_id:student.form_id,
                    admn_no:student.admn_no
                })
        }).then(response => response.json()).then((json) => {
          if(json.errorCode==101) throw('Authentication Error')
          setAlert(true);
          setMessage({message:'Verification Successfull',severity:'success'});
          isSubmit(false)
        }).catch((e)=>{
          setAlert(true);
          setMessage({message:'Verification Failed',severity:'error'});
          isVerify(false)});
      });
    }
    verify&&verification();
  }, [verify]);

  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 5 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} isVerify={isVerify}/>
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
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={selected.indexOf(row.id) !== -1}
                        onChange={(event) => handleCheckboxChange(event, row.id)}
                        inputProps={{ 'aria-labelledby': labelId }}
                        onClick={(event) => event.currentTarget.focus()}
                      />
                    </TableCell>
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
                    {show &&student&& <Dialog submit={show} isSubmit={setShow} student={student} bool={0}/>}
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
    </>
  );
}