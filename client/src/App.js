import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Components:
import Frontpage from './components/Frontpage';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Frontpage />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
