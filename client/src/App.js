import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Components:
import Frontpage from './components/Frontpage';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar'
import ChatList from './components/ChatList';
import Swiping from './components/Swiping'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Frontpage />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/chat' element={<NavBar Component={ChatList} />}/>
        <Route path='/swipe' element={<NavBar Component={Swiping} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
