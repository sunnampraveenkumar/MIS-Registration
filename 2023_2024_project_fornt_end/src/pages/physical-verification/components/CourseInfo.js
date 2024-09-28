import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,},
  [`&.${tableCellClasses.body}`]: {fontSize: 15,},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {backgroundColor: theme.palette.action.hover,},
  '&:last-child td, &:last-child th': {border: 1},
}));

export default function CourseInfo({courses}) {
  return (
    <TableContainer component={Paper} m={15} p={10}>
      <Table sx={{ minWidth: 600 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="centexr">Serial No.</StyledTableCell>
            <StyledTableCell align="center">Course Code</StyledTableCell>
            <StyledTableCell align="left">Course Name </StyledTableCell>
            <StyledTableCell align="center">Course Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course,index) => (
            <StyledTableRow key={index+1}>
              <StyledTableCell align="center" component="th" scope="row">{index+1}</StyledTableCell>
              <StyledTableCell align="center" >{course.subject_code}</StyledTableCell>
              <StyledTableCell align="left" >{course.subject_name}</StyledTableCell>
              <StyledTableCell align="center">{course.sub_category}</StyledTableCell>
              <StyledTableCell align="center">{course.status!=null?'Alloted':'Not Alloted'}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}