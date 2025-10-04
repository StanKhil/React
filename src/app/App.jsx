
import { Route, useRouteLoaderData } from 'react-router-dom'
import { BrowserRouter, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import About from '../pages/about/About'
import Privacy from '../pages/privacy/Privacy'
import './ui/App.css'
import Layout from './ui/layout/Layout'
import AppContext from '../features/context/AppContext'
import { useContext, useEffect, useRef, useState } from 'react'
import Base64 from '../shared/base64/Base64'
import Intro from '../pages/intro/Intro'
import Group from '../pages/group/Group'
import Cart from '../pages/cart/Cart'
import Product from '../pages/product/Product'

const tokenStorageKey = "react-token";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [productGroups, setProductsGroups] = useState([]);
  const [cart, setCart] = useState({cartItems: []});

  const request = (url, conf) => new Promise((resolve,reject) => 
  {
    if(url.startsWith('/')){
      url= "https://localhost:7072" + url;
      if(token){
        if(typeof conf == 'undefined'){
        conf = {};
        }
        if(typeof conf.headers == 'undefined'){
          conf.headers = {};
        }
        if(typeof conf.headers["Authorization"] == 'undefined'){
          conf.headers["Authorization"] = "Bearer " + token;
        }
      }
      
    }
    fetch(url, conf)
        .then(r => r.json())
        .then(j => {
            if(j.status.isOk){
                resolve(j.data);
            }
            else{
                if(j.status.code == 401){
                  alert("UnAuthorized")
                }
                reject(j);
            }
        })
        .catch((e) => alert(e))
  });

  useEffect(() => {
    const storedToken = localStorage.getItem(tokenStorageKey);
    if(storedToken){
      const payload = Base64.jwtDecodePayload(storedToken);
      const exp = new Date(payload.Exp.toString().length == 13
        ? Number(payload.Exp)
        : Number(payload.Exp) * 1000);
      const now = new Date();
      if(exp < now){
        localStorage.removeItem(tokenStorageKey);
      }
      else{
        console.log("Token left: ", (exp - now)/1000 + " seconds");
        setToken(storedToken);
      }
      
    }
    request('/api/product-group')
    .then(homePageData => setProductsGroups(homePageData.productGroups));
  }, []);

  const updateCart = () => {
    if(token != null){
      request("/api/cart").then(data => {
        if(data != null){
          setCart(data);
        }
      });
  }
  else{
    setCart({cartItems:[]});
  }
  };

  useEffect(() => {
    if(token == null){
      setUser(null);
      localStorage.removeItem(tokenStorageKey);
    }
    else{
      localStorage.setItem(tokenStorageKey, token);
      setUser(Base64.jwtDecodePayload(token));
    }
    updateCart();
    },[token]);
  
    const alarmRef = useRef();
    const alarm = () => {
      alarmRef.current.click();
    }

  return <>
  <AppContext.Provider value={ {alarm, request, user, cart, updateCart, token, setToken, productGroups, setCart} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart/>} />
          <Route path="group/:slug" element={<Group/>}/>
          <Route path="intro" element={<Intro/>} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="product/:slug" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <i style={{display: 'block', width: 0, height:0, position: 'absolute'}} data-bs-toggle="modal" data-bs-target="#alarmModal" ref={alarmRef}></i>
    <Alarm/>
  </AppContext.Provider>
  </> 
}

function Alarm(){
  return <div className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="alarmModalLabel">
            Modal title
          </h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
          </button>
        </div>
        <div className="modal-body">        ...      

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>;
}

export default App
