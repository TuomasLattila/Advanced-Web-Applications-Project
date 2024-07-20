import React from 'react'

//css:
import '../css/Frontpage.css'

function Frontpage() {
  return (
    <div className='container'>
      <div className='row'>
        <a className="waves-effect waves-light btn col s10 blue offset-s1" id='register' href='/register'>Create account</a>
      </div>
      <div className='row'>
        <a className="waves-effect waves-light btn col s10 blue offset-s1" id='login' href='/login'>Log in</a>
      </div>
    </div>
  )
}

export default Frontpage