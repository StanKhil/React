
import { Route } from 'react-router-dom'
import { BrowserRouter, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import About from '../pages/about/About'
import Privacy from '../pages/privacy/Privacy'
import './ui/App.css'
import Layout from './ui/Layout'
import AppContext from '../features/context/AppContext'
import { useEffect, useState } from 'react'
import Base64 from '../shared/base64/Base64'

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token);
    setUser(u);
    console.log("user from token", u);
  },[token]);
  return <>
  <AppContext.Provider value={ {message: "Hello fromApp!", user, setUser, count, setCount, token, setToken} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>
  </> 
}

export default App
