import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import Dialog from './Dialog'
import Alert from './Alert';
import { SetAll } from 'mdi-material-ui';

const SingleVerify = () => {
  
  const [sessionYear,setSessionYear] = useState([]);
  const [session,setSession] = useState([]);
  const [submit,isSubmit] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [data,setData] = useState({session_year:'',session:'',admn_no:''});
  const [student,setStudent] = useState();
  const [alert,setAlert] = useState(false);
  const [message,setMessage] = useState({message:'All fields are required',severity:'error'});


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({...data,[name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.session_year || !data.session || !data.admn_no) {
      setAlert(true);
      setMessage({message:'All fields are required',severity:'error'});
      return;
    }
    fetch('http://127.0.0.1:8000/api/info',
    {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(response => response.json()).then((json) => {
        setStudent(json);
        isSubmit(true);
        setAlert(true);
        setMessage({message:'Student Found',severity:'success'});
    }).catch((e)=>{
      setAlert(true);
      setMessage({message:'Student Not Found',severity:'error'});});
  };

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/session_year').then(response => response.json()).then(json => setSessionYear(json));
    fetch('http://127.0.0.1:8000/api/session').then(response => response.json()).then(json => setSession(json));
  },[]);

  return (
  <>
    {alert&&<Alert message={message.message} severity={message.severity} setAlert={setAlert}/>}
    <Box m={10} p={5}>
        <Grid container spacing={10} justifyContent={isSmallScreen ? "center" : "center"} alignItems={isSmallScreen ? "center" : "center"} direction={isSmallScreen ? "column" : "row"}>
        <Grid item>
            <FormControl style={{ minWidth: 200 }}>
            <InputLabel id='demo-basic-select-outlined-label'>Session Year</InputLabel>
            <Select label='Session Year' 
                id='demo-basic-select-outlined' 
                labelId='demo-basic-select-outlined-label' 
                name='session_year' 
                value={data.session_year} 
                onChange={handleInputChange} 
                MenuProps={{PaperProps: {style: {maxHeight: 200},},}}>
                {sessionYear.slice().reverse().map(year=><MenuItem value={year.session_year} >{year.session_year}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <FormControl style={{ minWidth: 200 }}>
            <InputLabel id='demo-basic-select-filled-label'>Session</InputLabel>
            <Select label='Session' 
                labelId='demo-basic-select-filled-label' 
                id='demo-basic-select-filled' 
                name='session' 
                value={data.session} 
                onChange={handleInputChange} 
                MenuProps={{PaperProps: {style: {maxHeight: 200},},}} 
                disabled={!data.session_year}>
            {session.map(year=><MenuItem value={year.session}>{year.session}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <TextField style={{ minWidth: 200 }}
            label='Admission Number'
            placeholder='21XX0000'
            variant='outlined'
            name='admn_no' value={data.admn_no} onChange={handleInputChange}
            disabled={!data.session}/>
        </Grid>
        <Grid container spacing={10} justifyContent={"center"} alignItems={"center"} margin={5}>
          <Grid item >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              View
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    {submit&&<Dialog submit={submit} isSubmit={isSubmit} student={student} bool={1} setAlert={setAlert} setMessage={setMessage}/>}
</>
  )
};

export default SingleVerify
