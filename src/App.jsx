import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from '@contexts/Web3Context';
import { Header } from '@components/Header/Header';
import { PurchasePage } from '@pages/PurchasePage';
import { DashboardPage } from '@pages/DashboardPage';
import '@styles/global.css';

export const App = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<PurchasePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  );
};
