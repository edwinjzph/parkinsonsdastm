import { useHistory } from 'react-router-dom';
import { Toolbar } from '@mui/material'
import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { auth } from '../firebase';

const Account = ({user,value,setValue}) => {
  const history = useHistory();
    console.log(user)
    if(user)
  return (
    <div className='account1' style={{width:"100%" }}>
        <Toolbar/>
        <div className='account' style={{width:"90%",margin :" auto",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
           <h4>Hello, {user?.name}</h4>
           <AccountCircleIcon className='account_Circle'/>
            </div>
            <div className='account' style={{width:"90%",display:"flex",flexDirection:"row",margin :" auto",justifyContent:"space-between",alignItems:"center"}}>
         <button  className='account_btn' style={{width:"100%",padding:"10px"}} onClick={()=>{auth.signOut()}}>SIGNOUT</button>
            </div>
            <div className="bottam" style={{position:"fixed",bottom:"0",width:"100%",}}>
        <Box >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" onClick={() => {history.push('/')}} icon={<HomeIcon />} />
        <BottomNavigationAction label="Reminder" icon={<AddIcon />} />
        <BottomNavigationAction label="Profile"  onClick={() => {history.push('/account')}} icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Box>
        </div>
            </div>
  )
}

export default Account