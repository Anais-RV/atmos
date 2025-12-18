// src/App.jsx

import "./styles/styles.css";
import "./components/features/auth/auth.css";
import "./components/ui/HamburgerMenu/HamburgerMenu.css";
import "./components/features/theme/ClaroOscuro.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPanelPage from "./pages/UserPanelPage";
import DataProtectionPage from "./pages/DataProtectionPage";
import ForecastChartPage from "./pages/ForecastChartPage";
import WeatherHistoryPage from "./pages/WeatherHistoryPage";
import ForecastPage from "./pages/ForecastPage";
import ForecastExtendedPage from "./pages/ForecastExtendedPage";
import PasswordResetPage from "./pages/PasswordResetPage";

function App() {
  return (
    <ThemeProvider>
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
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/password-reset/:token" element={<PasswordResetPage />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
