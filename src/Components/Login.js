import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, redirect, useNavigate } from 'react-router-dom';

const Login = ({setToken}) => {
  
  let navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email:'',
    password:''
  })
  console.log(formData);

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData, 
        [event.target.name]:event.target.value
      }
    })
  }
  async function handleSubmit(e){
    e.preventDefault();
    try{
      const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      if(error)
        throw(error);
      setToken(data);
      console.log(data);
      navigate('/home');
    }catch(error){
      alert(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
         placeholder='Email'
         name='email'
         onChange={handleChange}
         type='email'
         />
        <input
         placeholder='Password'
         name='password'
         onChange={handleChange}
         type='password'
         />
         <button type='submit'>Submit</button>
      </form>
      <p>Don't have an account?<Link to='/register'>register</Link></p>
    </div>
  );
}

export default Login;