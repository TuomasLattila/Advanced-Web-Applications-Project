import React from 'react'

//css:
import '../css/Login.css'

function Login() {
  return (
    <div className='container'> 
      <div className='row'>
        <form className="col s12" id='login-form'>
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
              <button className="btn waves-effect waves-light right blue" type="submit" name="action">Login</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login