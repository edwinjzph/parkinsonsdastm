import React from 'react'
import ClipLoader from "react-spinners/BounceLoader";
import { database } from '../firebase';


function Emergency() {

    const fallfalse = () =>{
        database.ref('buzzer').set({
            buzzer: false
          });
    } 
 
  return (
    <div style={{height:"100vh",width:'100%'}}>

   
        <div style={{display:"flex",justifyContent:"center",margin:"auto",flexDirection:"column",alignItems:'center',height:"100%"}}> 
            <ClipLoader 
        size={150}        loading={true}
        color='red'
        aria-label="Loading Spinner"
        data-testid="loader"/>
        <h4>Maximum Value Reached</h4>
        <button onClick={()=>{fallfalse()}} style={{padding:"10px",border:"0",background:"red",color:"white",width:"100px",borderRadius:"10px"}}>View</button>
        </div>

    </div>
  )
}

export default Emergency