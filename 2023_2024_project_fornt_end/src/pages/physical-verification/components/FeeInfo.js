import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white},
  [`&.${tableCellClasses.body}`]: {fontSize: 14,},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {backgroundColor: theme.palette.action.hover,},
  '&:last-child td, &:last-child th': {border: 0,},
}));

const handleDownload = async () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const dialogContent = document.getElementById('dialog-content');
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(dialogContent.cloneNode(true));
    document.body.appendChild(tempContainer);
    const canvas = await html2canvas(tempContainer, {
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight
    });
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
    pdf.save('page_content.pdf');
    document.body.removeChild(tempContainer);
  };

export default function FeeInfo({fees}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Serial No.</StyledTableCell>
            <StyledTableCell align="center">Fee Amount</StyledTableCell>
            <StyledTableCell align="center">Transaction ID</StyledTableCell>
            <StyledTableCell align="center">Fee Status</StyledTableCell>
            <StyledTableCell align="center">Fee Date</StyledTableCell>
            <StyledTableCell align="center">Download</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fees.map((fee,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="center" component="th" scope="row">{index+1}</StyledTableCell>
              <StyledTableCell align="center">{fee.fee_amt}</StyledTableCell>
              <StyledTableCell align="center">{fee.transaction_id}</StyledTableCell>
              <StyledTableCell align="center">{fee.transaction_id==null||fee.transaction_id==''?'NA':'SUCCESS'}</StyledTableCell>
              <StyledTableCell align="center">{fee.fee_date}</StyledTableCell>
              <StyledTableCell align="center"> <Button onClick={handleDownload}>Download</Button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}