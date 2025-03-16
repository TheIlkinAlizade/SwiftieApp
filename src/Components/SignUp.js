import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const SignUp = () => {
  
  const [formData, setFormData] = useState({
    fullname:'',
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
      const {data, error} = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options:{
          data:{
            full_name: formData.fullname
          }
        }
      })
      alert("Check your email for verification link");
    }catch(error){
      alert(error);
    }
  }

  return (
    <div className='signform'>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input
         placeholder='Full name'
         name='fullname'
         onChange={handleChange}
         type='name'
         />
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
        <p>Already have an account? <Link to='/login'>Login</Link></p>
         <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
