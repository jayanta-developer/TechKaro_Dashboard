import { Routes, Route } from "react-router-dom";
import "./App.css";

//pages
import Home from "./pages/home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
