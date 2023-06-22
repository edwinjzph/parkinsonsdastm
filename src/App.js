import './App.css';
import SimpleBottomNavigation from './components/home';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Signin from './components/signup/signup';
import { login, logout, selectUser } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import Account from './components/accounts';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';

function App() {
  const user = useSelector(selectUser);
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  console.log(user)
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth =>{
      if(userAuth){
        console.log(userAuth)
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
          name:userAuth.displayName
        }));
        
      }else{
        dispatch(logout());   
      }
    });
    return () =>{
      unsubscribe();
    }
  },[dispatch])

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
 

    <div className="App">
  
    <AppBar
        position="fixed"
        color='primary'
    
      >
        <Toolbar>
    
        <Typography>
Parkinson'sDiseaseAsistsystem
</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: 'flex' } }} style={{display:"flex",flexDirection:"row",alignItems:"center",}}>
    
  
   
          </Box>
     
        </Toolbar>
     
      </AppBar> 
    {user?.uid?
        <BrowserRouter>
  <Switch>
    
  <Route exact path='/' >
  <SimpleBottomNavigation value = {value} setValue={setValue}/>
           </Route>
           <Route exact path='/account'  >
        <Account user={user} value = {value} setValue={setValue}/>
           </Route></Switch>
</BrowserRouter>
  :<Signin/>}
    </div>
    </ThemeProvider>
  );
}

export default App;
