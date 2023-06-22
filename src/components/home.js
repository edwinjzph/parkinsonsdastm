import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { v4 as uuidv4 } from 'uuid';
import { Toolbar } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import db, { database } from '../firebase';
import {  ref, onValue,  query, limitToLast} from "firebase/database";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useHistory } from 'react-router-dom';
import "./all.css"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
   
    CartesianGrid,
    Tooltip,
    Legend,

    ResponsiveContainer,
   
  } from 'recharts';
  
import {  Grid } from '@mui/material';
import Emergency from './emergency';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


export default function SimpleBottomNavigation({value,setValue}) {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState("18_5_2023");
  const [temp,setTemp]=React.useState([]);
  const [buzzer,setBuzzer]=React.useState(false);
  const [reminders,setReminders]=React.useState();
  const [data, setData] = React.useState({
    date: "",
    content : ""
  
  }  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedToday = dd + '_' + mm + '_' + yyyy;
    setDate(formattedToday)

 }, [])

  React.useEffect(() => {


      const values =  query(ref(database, `${date}/graph`),limitToLast(20))
      const unsubscribe=  onValue(values, (snapshot) => {
        setTemp([])
        const data = snapshot.val(); 
    
    console.log(data)
    data && Object.entries(data).forEach(([index,value]) => {
    console.log(value,index);
    setTemp(prevState => 
        [...prevState,{
          name:index,
          value:value,
        
         
        
        }]
        )
 
    })


    
      });
      return () => {
        unsubscribe();
       }
    
   
   
  
   }, [date])

   React.useEffect(() => {


    const values =  query(ref(database, `buzzer`))
    const unsubscribe=  onValue(values, (snapshot) => {
    
      const data = snapshot.val(); 
  setBuzzer(data.buzzer)

  
    });
    return () => {
      unsubscribe();
     }
  


 }, [])
 React.useEffect(() =>{
  const unsubscribe =  db.collection('general').onSnapshot((querySnapshot) => {
    const content  = {};
    querySnapshot.forEach((doc) => {
        content[doc.id] = doc.data()
    });
    setReminders(content)
});
return () =>{
  unsubscribe();
}
 },[])
    
 React.useEffect(() => {
  if( temp[1] && temp[temp.length-1].value>17)
  database.ref('buzzer').set({
    buzzer: true
  });

}, [temp])
const handleChange = React.useCallback((e) => {
  const { name, value } = e.target; 
  console.log(name,value)
  setData({ ...data, [name]: value });
}      ,[data])

const addreminder =  async (data) => {
  if(!data) return
  const uuid =uuidv4()
  const {content, date} =data
  console.log(date,content)
  if(date== '' && content=='') return
  const userRef = db.doc(`general/${uuid}`);
  const snapshot = await userRef.get();
  if(!snapshot.exists){
    try {
      await userRef.set({
        templateid: content,
        date : date,
        createdAt: new Date(),
      }).then(() => {
        setOpen(false);
      })
    } catch (error) {
      console.log('Error', error);
    }
}
}

console.log(data)
  return (
    <div >
  
      <Box
    component="main"
    style={{padding:"6px"}}
    sx={{ flexGrow: 1, p: 3, width: "1050" }}
  >    
  
    
    
  
    <Toolbar/>
{buzzer==false ? 
<Grid container spacing={1} style={{padding:"0px"}} >

<Grid item  xs={12} sm={6} md={7} >
<div className="dash_chart">
    <div style={{display:"flex",flexDirection:"row",justifyContent:'flex-end',alignItems:"center",width:"100%",marginBottom:"10px"}}>
    <LocalizationProvider  dateAdapter={AdapterDayjs}>
      <DatePicker 

       onChange={(newValue) => setDate(`${newValue.$D}_${newValue.$M+1}_${newValue.$y}`)}/>
    </LocalizationProvider>  
    </div>


<ResponsiveContainer width="100%" height="88%">
<LineChart width={730} height={200} data={temp}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />

</LineChart>
        </ResponsiveContainer>

</div>



</Grid>


<Grid item  xs={12} sm={6} md={5}>
<div className="dash_chart dash_chart2">
    <div style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px",justifyContent:"space-around",margin:"auto",height:"100%",width:"100%"}}>
        <div style={{width:"100%",display:"flex",justifyContent:"center",flexBasis:"50%",borderRight:"1px solid white"}}>
      {temp[1] &&      <span>Current Value - {temp[temp.length-1].value}</span>}
        </div>
      {temp[1] &&
        <div>
    
        {(temp[temp.length-1].value>17 && temp[temp.length-1].value>7) ?  <span style={{color:"red"}}>Maximum</span>:
       (temp[temp.length-1].value>7 && <span style={{color:"yellow"}}>Medium</span>)}
        {temp[temp.length-1].value<=7 &&  <span style={{color:"green"}}>Low</span>} 
        </div>}
        <div></div>
    </div>
</div>
<div className="dash_chart dash_chart4">

  <div style={{marginBottom:"10px"}}>
  <span style={{fontSize:"20px"}}>Reminders</span>
  </div>


  <div  style={{display:"flex",flexDirection:"column",gap:"10px",}}>
  {reminders 
  
  && Object.values(reminders).map((value)=>{
    console.log(value)
    return (
      <div className="dash_chart dash_chart3" style={{display:"flex",flexDirection:"row",justifyContent:"space-around",margin:"auto"}}>
    <span style={{width:"100px",color:"#82ca9d"}}>{value.date.slice(0,21)}</span>
  <span>{value.templateid}</span>
</div>
    )
  })}


  </div>
    </div>

</Grid>




</Grid> :<Emergency/>}
  </Box>
      
        <div className="bottam" style={{position:"fixed",bottom:"0",width:"100%"}}>
        <Box >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Reminder" icon={<AddIcon />}  onClick={handleClickOpen}/>
        <BottomNavigationAction label="Profile"  onClick={() => {history.push('/account')}} icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Box>
        </div>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Reminder</DialogTitle>
        <DialogContent >

          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Date and Time"   value={data.date}
          
  onChange={(newValue) => setData({["date"]:`${newValue.$d}`})} />
      </DemoContainer>
    </LocalizationProvider>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            fullWidth
            name='content'
            value={data.content}
            onChange={handleChange}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {addreminder(data)}}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
 
  );
}