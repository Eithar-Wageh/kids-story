"use client"
import axios from 'axios'
import  { useEffect } from 'react'
import {useUser}from "@clerk/nextjs"
function Provider({children}) {
  const {user}= useUser()

  useEffect(()=>{
   user && createNewUser()
  },[user])
const createNewUser=async()=>{
  const result =await axios.post("/api/user",{
    name:user?.fullName,
email: user?.emailAddresses?.[0]?.emailAddress
  })
  console.log(result.data);
  
}

  return (
    <div>
      {children}
    </div>
  )
}

export default Provider
