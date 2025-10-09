
import { data, Route, useRouteLoaderData } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import About from '../pages/about/About';
import Privacy from '../pages/privacy/Privacy';
import './ui/App.css';
import Layout from './ui/layout/Layout';
import AppContext from '../features/context/AppContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Base64 from '../shared/base64/Base64';
import Intro from '../pages/intro/Intro';
import Group from '../pages/group/Group';
import Cart from '../pages/cart/Cart';
import Product from '../pages/product/Product';
import Alarm from './ui/Alarm';

const tokenStorageKey = "react-token";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [productGroups, setProductsGroups] = useState([]);
  const [cart, setCart] = useState({cartItems: []});
  const [alarmData, setAlarmData] = useState({});
  const [toastData, setToastData] = useState({});

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
    const alarm = (data) => new Promise((resolve, reject) => {
      data.resolve = resolve;
      data.reject = reject;
      setAlarmData(data)
      alarmRef.current.click();
    });

    const toast = (data) =>{
      setToastData(data);
    }

  return <>
  <AppContext.Provider value={ {toast, alarm, alarmData, request, user, cart, updateCart, token, setToken, productGroups, setCart} }>
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
    <Alarm alarmData={alarmData}/>
    <Toast toastData={toastData}/>
  </AppContext.Provider>
  </> 
}

function Toast({ toastData }) {
  const toastShowTime = 2500; // ms
  const fadeTime = 500; // ms

  const [isToastVisible, setToastVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [queue, setQueue] = useState([]);
  const [visibleData, setVisibleData] = useState({});
  const opacityTimeout = useRef(null);
  const visibilityTimeout = useRef(null);

  useEffect(() => {
    if (toastData.message) {
      setQueue((q) => [...q, toastData]);
    }
  }, [toastData]);

  useEffect(() => {
    if (queue.length === 0) return;
    const nextToast = queue[0];

    if (isToastVisible && nextToast.message === visibleData.message) {
      restartToast(nextToast);
      return;
    }

    if (!isToastVisible) {
      startToast(nextToast);
    }
  }, [queue]);

  const restartToast = (toast) => {
    clearTimeout(opacityTimeout.current);
    clearTimeout(visibilityTimeout.current);

    setQueue((q) => q.slice(1));

    setOpacity(0);

    setTimeout(() => startToast(toast), fadeTime);
  };

  const startToast = (toast) => {
    clearTimeout(opacityTimeout.current);
    clearTimeout(visibilityTimeout.current);

    setVisibleData(toast);
    setToastVisible(true);
    setOpacity(1);

    opacityTimeout.current = setTimeout(() => setOpacity(0), toastShowTime - fadeTime);
    visibilityTimeout.current = setTimeout(() => {
      setToastVisible(false);
      setQueue((q) => q.slice(1));
    }, toastShowTime);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "45vw",
        borderRadius: "10px",
        minWidth: "10vw",
        maxWidth: "25vw",
        padding: "5px 10px",
        backgroundColor: "#888888",
        display: isToastVisible ? "block" : "none",
        opacity,
        transition: `opacity ${fadeTime}ms ease-in-out`,
      }}
    >
      {visibleData.message}
    </div>
  );
}


export default App
