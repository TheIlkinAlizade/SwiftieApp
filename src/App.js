import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from './client';
import SearchAlbum from './Components/SearchAlbum';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Homepage from './Components/Homepage';
import DefaultPage from './Components/DefaultPage';


function App() {

  const [token, setToken] = useState(false);

  if(token){
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }

  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path={'/register'} element={<SignUp/>} />
          <Route path={'/login'} element={<Login setToken={setToken}/>} />
          <Route path={'/search'} element={<SearchAlbum/>} />
          {token?<Route path={'/home'} element={<Homepage token={token}/>} /> : <Route path={'/'} element={<DefaultPage/>} />}
          {token?<Route path={'/*'} element={<Homepage token={token}/>} /> : <Route path={'/'} element={<DefaultPage/>} />}
        </Routes>
      </Router>
    </>
  );
}

export default App;
