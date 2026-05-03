/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import { AnimatePresence } from 'motion/react';
import { AuthProvider } from './hooks/useAuth';
import PageTransition from './components/PageTransition';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
              <Route path="/track" element={<PageTransition><TrackOrder /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
