import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from "./pages/MainPage";
import ForecastPage from "./pages/ForecastPage";
import ClimateDataPage from "./pages/ClimateDataPage";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/data' element={<ClimateDataPage />} />
              <Route path='/predpoved' element={<ForecastPage />} />
          </Routes>
          <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
