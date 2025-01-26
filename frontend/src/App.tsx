


import Hero from './components/general/Hero'
import NavBar from './components/general/NavBar'
import { BrowserRouter  , Routes, Route } from 'react-router-dom'

function App() {


  return (
 
    <BrowserRouter>
    <NavBar />
    <Hero />
    </BrowserRouter>
   
   
 
  )
}

export default App
