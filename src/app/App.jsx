
import { Route, useRouteLoaderData } from 'react-router-dom'
import { BrowserRouter, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import About from '../pages/about/About'
import Privacy from '../pages/privacy/Privacy'
import './ui/App.css'
import Layout from './ui/layout/Layout'
import AppContext from '../features/context/AppContext'
import { useContext, useEffect, useState } from 'react'
import Base64 from '../shared/base64/Base64'
import Intro from '../pages/intro/Intro'
import Group from '../pages/group/Group'

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [count, setCount] = useState(0);
  const [productGroups, setProductsGroups] = useState([]);

  const request = (url, conf) => new Promise((resolve,reject) => 
  {
    if(url.startsWith('/')){
      url= "https://localhost:7072" + url;
    }
    fetch(url, conf)
        .then(r => r.json())
        .then(j => {
            if(j.status.isOk){
                resolve(j.data);
            }
            else{
              console.error(j);
                reject(j);
            }
        })
  });

  useEffect(() => {
    request('/api/product-group')
    .then(homePageData => setProductsGroups(homePageData.productGroups));
  }, []);

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token);
    setUser(u);
    console.log("user from token", u);
  },[token]);

  

  return <>
  <AppContext.Provider value={ {request, user, count, setCount, token, setToken, productGroups} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="group/:slug" element={<Group/>}/>
          <Route path="privacy" element={<Privacy />} />
          <Route path="about" element={<About />} />
          <Route path="intro" element={<Intro/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>
  </> 
}

export default App
