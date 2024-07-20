import React from 'react'

//css:
import '../css/Register.css'

function Register() {
  return (
    <div className='container'> 
      <div className='row'>
        <form className="col s12" id='register-form'>
          <div className="row">
            <div className="input-field col s8 offset-s2">
              <input id="username" type="text" className="validate" />
              <label htmlFor="username" >Username</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s8 offset-s2">
              <input id="email" type="email" className="validate" />
              <label htmlFor="email" >Email</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s8 offset-s2">
              <input id="password" type="password" className="validate" />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <div className='row'>
            <div className='col s8 offset-s2'>
              <button className="btn waves-effect waves-light right blue" type="submit" name="action">Create account</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register