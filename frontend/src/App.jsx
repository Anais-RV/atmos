// src/App.jsx

import "./styles/styles.css";
import "./styles/auth.css";
import "./styles/hamburger.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPanelPage from "./pages/UserPanelPage";
import DataProtectionPage from "./pages/DataProtectionPage";
import ForecastChartPage from "./components/charts/ForecastChartPage";
import WeatherHistoryPage from "./components/history/WeatherHistoryPage";
import ForecastPage from "./pages/ForecastPage";
import ForecastExtendedPage from "./pages/ForecastExtendedPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-panel" element={<UserPanelPage />} />
          <Route path="/data-protection" element={<DataProtectionPage />} />
          <Route path="/charts" element={<ForecastChartPage />} />
          <Route path="/history" element={<WeatherHistoryPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/forecast-extended" element={<ForecastExtendedPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
