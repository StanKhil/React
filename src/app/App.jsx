
import { Route } from 'react-router-dom'
import { BrowserRouter, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import About from '../pages/about/About'
import Privacy from '../pages/privacy/Privacy'
import './ui/App.css'
import Layout from './ui/Layout'

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
