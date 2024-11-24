import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import validation from '../middleware/signupValidation';
import axios from 'axios'

function Login() {
    const [values, setValues] = useState({
      email : '',
      password : ''
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    const handleInput =(event) => {
      setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit =(event) => {
      event.preventDefault();
      setErrors(validation(values));
      if(errors.email === "" && errors.password === "")
        {
            axios.post("http://localhost:5000/api/login", values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }
  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <form action = "" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" placeholder="Enter Email" name='email' onChange={handleInput} className='form-control rounded-0'></input>
            {errors.email && <span className='text-danger'> {errors.email} </span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder="Enter Password" name='password'  onChange={handleInput}className='form-control rounded-0'></input>
            {errors.password && <span className='text-danger'> {errors.password} </span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'> <strong>Log-in</strong></button>
          <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0'><strong>Register</strong></Link>
        </form>
      </div>
    </div>
  )
}

export default Login
