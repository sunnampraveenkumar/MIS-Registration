import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import GeneralInfo from './GeneralInfo'
import CourseInfo from './CourseInfo';
import FeeInfo from './FeeInfo';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert'

const AlertsBasic = () => {
  return (
    <Grid container justifyContent={"center"} alignItems={"center"} pt={3} >
    <Grid item >
      <Alert severity='error'>Fee payment unsuccessfull !!!</Alert>
    </Grid>
  </Grid>
  )
}

export default function CustomDialog({submit,isSubmit,student,bool,setAlert,setMessage}) {

  const [verify, isVerify] = useState(false);
  const handleClose = () => {isSubmit(false);};

  const handleVerify = (e) => {
    e.preventDefault();
    isVerify(true);
  };

  useEffect(() => {
    const accessToken=localStorage.getItem('accessToken');
    verify&&fetch('http://127.0.0.1:8000/api/verify',
    {
        method:'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`},
        body: JSON.stringify(
            {
                form_id:student[3],
                admn_no:student[0][0].admn_no
            })
    }).then(response => response.json()).then((json) => {
        if(json.errorCode==101) throw('Authentication Error')
        setAlert(true);
        setMessage({message:'Verification Successfull',severity:'success'});
        isSubmit(false);
    }).catch((e)=>{
      setAlert(true);
      setMessage({message:'Verification Failed',severity:'error'});
      isVerify(false)});
  }, [verify]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        open={submit}
        onClose={handleClose}>
        <DialogContent id="dialog-content">
        <Typography variant="h5" gutterBottom style={{textAlign: 'center', paddingBottom:'15px'}}>
            Student Information
        </Typography>
        {student[0][0].status=='1'?<Grid container justifyContent={"center"} alignItems={"center"} >
          <Grid item >
            <Button variant="contained" color="success">
              Verified
            </Button>
          </Grid>
        </Grid>:(bool==1?<Grid container justifyContent={"center"} alignItems={"center"} >
            <Grid item >
              <Button variant="contained" color="primary" onClick={handleVerify}>Verify</Button>
            </Grid>
          </Grid>:'')}
          {student[2][0].transaction_id===null||student[2][0].transaction_id===''?<AlertsBasic/>:''}
          <GeneralInfo {...student[0][0]} />
          <CourseInfo courses={student[1]}/>
          <FeeInfo fees={student[2]}/>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}