// src/App.jsx
import "./styles/styles.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div className="app">
      <Navbar />
      <DashboardPage />
      <Footer />
    </div>
  );
}

export default App;
