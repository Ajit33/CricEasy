import Hero from "./components/general/Hero";
import NavBar from "./components/general/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateTournamnet from "./pages/CreateTournamnet";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Hero />
      <Routes>
        <Route path="/create_tournamnet" element ={<CreateTournamnet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
