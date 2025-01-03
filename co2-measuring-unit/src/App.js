import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from "./pages/MainPage";
import ForecastPage from "./pages/ForecastPage";
import ClimateDataPage from "./pages/ClimateDataPage";
import ErrorPage from "./pages/ErrorPage";

import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
        <div className="App">
              <Header />
              <Routes>
                  <Route path='/' element={<MainPage />} />
                  <Route path='/data' element={<ClimateDataPage />} />
                  <Route path='/predpoved' element={<ForecastPage />} />
                  <Route path='*' element={<ErrorPage />} />
              </Routes>

        </div>
    </BrowserRouter>
  );
}

export default App;
