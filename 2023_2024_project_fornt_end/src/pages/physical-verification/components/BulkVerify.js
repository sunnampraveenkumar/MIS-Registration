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
import ViewVerify from './ViewVerify'
import ViewRegistered from './ViewRegistered'
import Alert from './Alert';


const BulkVerify = ({status}) => {
  
  const [sessionYear,setSessionYear] = useState([]);
  const [session,setSession] = useState([]);
  const [department,setDepartment] = useState([]);
  const [course,setCourse] = useState([]);
  const [branch,setBranch] = useState([]);
  const [submit,isSubmit] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [data,setData] = useState({session_year:'',session:'',department:'',course:'',branch:'',semester:''});
  const [students,setStudents] = useState();
  const [alert,setAlert] = useState(false);
  const [message,setMessage] = useState({message:'Session Year and Session are required',severity:'error'});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({...data,[name]: value})
    isSubmit(false)};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.session_year || !data.session) {
      setAlert(true);
      setMessage({message:'Session Year and Session are required',severity:'error'});
      return;
    }
    fetch('http://127.0.0.1:8000/api/bulkinfo',
    {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                session_year:data.session_year,
                session:data.session,
                deptid:department.find(dept=>dept.name==data.department)?.id,
                courseid: course.find(cour=>cour.name==data.course)?.id,
                branchid:branch.find(bran=>bran.name==data.branch)?.id,
                semester:data.semester,
                status:status
            })
    }).then(response => response.json()).then((json) => {
        json.map((js,index)=>{
            js['id']=index;
            js['session_year']=data.session_year;
            js['session']=data.session;
        });
        setStudents(json);
        if(json.length){ 
          isSubmit(true);
          setAlert(true);
          setMessage({message:'Students Found',severity:'success'});
        }
        else {
          setAlert(true);
          setMessage({message:'Students Not Found',severity:'error'});
        }
    })
  };

  useEffect(() => {
        fetch('http://127.0.0.1:8000/api/course',
        {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({deptid:department.find(dept=>dept.name==data?.department)?.id})
        }).then(response => response.json()).then((json) => {
            setCourse(json);
            data.course=''
        });
  },[data.department])

  useEffect(() => {
        fetch('http://127.0.0.1:8000/api/branch',
        {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({deptid:department.find(dept=>dept.name==data?.department)?.id,courseid:course.find(cour=>cour.name==data?.course)?.id})
        }).then(response => response.json()).then((json) => {
            setBranch(json);
            data.branch='';
            data.semester='';
        });
},[data.course])

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/session_year').then(response => response.json()).then(json => setSessionYear(json));
    fetch('http://127.0.0.1:8000/api/session').then(response => response.json()).then(json => setSession(json));
    fetch('http://127.0.0.1:8000/api/department').then(response => response.json()).then(json => {setDepartment(json)});
  },[]);

  return (
  <>
    {alert&&<Alert message={message.message} severity={message.severity} setAlert={setAlert}/>}
    <Box m={5} p={5}>
        <Grid container spacing={10} justifyContent={isSmallScreen ? "center" : "center"} alignItems={isSmallScreen ? "center" : "center"} direction={isSmallScreen ? "column" : "row"}>
        <Grid item>
            <FormControl style={{ minWidth: 250 }}>
            <InputLabel id='demo-basic-select-outlined-label'>Session Year</InputLabel>
            <Select label='Session Year' id='demo-basic-select-outlined' labelId='demo-basic-select-outlined-label' name='session_year' value={data.session_year} onChange={handleInputChange} MenuProps={{PaperProps: {style: {maxHeight: 200},},}}>
                {sessionYear.slice().reverse().map(year=><MenuItem value={year.session_year}>{year.session_year}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <FormControl style={{ minWidth: 250 }}MenuProps={{PaperProps: {style: {maxHeight: 200},},}}>
            <InputLabel id='demo-basic-select-filled-label'>Session</InputLabel>
            <Select label='Session' labelId='demo-basic-select-filled-label' id='demo-basic-select-filled' defaultValue=''  name='session' value={data.session} onChange={handleInputChange} disabled={!data.session_year}>
            {session.map(year=><MenuItem value={year.session}>{year.session}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <FormControl style={{ minWidth: 250 }}>
            <InputLabel id='demo-basic-select-filled-label'>Department</InputLabel>
            <Select label='Department' labelId='demo-basic-select-filled-label' id='demo-basic-select-filled' defaultValue=''  name='department' value={data.department} onChange={handleInputChange} MenuProps={{PaperProps: {style: {maxHeight: 200},},}} disabled={!data.session}>
            <MenuItem value=''><em>None</em></MenuItem>
            {department.map(dept=><MenuItem value={dept.name}>{dept.name}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <FormControl style={{ minWidth: 250 }}>
            <InputLabel id='demo-basic-select-filled-label'>Course</InputLabel>
            <Select label='Course' labelId='demo-basic-select-filled-label' id='demo-basic-select-filled' defaultValue=''  name='course' value={data.course} onChange={handleInputChange} MenuProps={{PaperProps: {style: {maxHeight: 200},},}} disabled={!data.department} >
            <MenuItem value=''><em>None</em></MenuItem>
            {course.map(cour=><MenuItem value={cour.name}>{cour.name}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <FormControl style={{ minWidth: 250 }}>
            <InputLabel id='demo-basic-select-filled-label'>Branch</InputLabel>
            <Select label='Branch' labelId='demo-basic-select-filled-label' id='demo-basic-select-filled' defaultValue='select'  name='branch' value={data.branch} onChange={handleInputChange} MenuProps={{PaperProps: {style: {maxHeight: 200},},}} disabled={!data.course} >
            <MenuItem value=''><em>None</em></MenuItem>
            {branch.map(bran=><MenuItem value={bran.name}>{bran.name}</MenuItem>)};
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
            <TextField style={{ minWidth: 250 }}
            label='Semester'
            placeholder='1'
            variant='outlined'
            name='semester' value={data.semester} onChange={handleInputChange} disabled={!data.branch} />
        </Grid>
        <Grid container spacing={2} justifyContent={"center"} alignItems={"center"} marginTop={5}>
          <Grid item >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    {submit&&(status==0?<ViewVerify students={students} isSubmit={isSubmit} setAlert={setAlert} setMessage={setMessage}/>:<ViewRegistered students={students} isSubmit={isSubmit}/>)}
</>
  )
};

export default BulkVerify
