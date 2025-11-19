import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import CartDrawer from './components/CartDrawer';
import FloatingCartButton from './components/FloatingCartButton';

import './App.css';
import './theme.css';

const ProductDetail = lazy(() => import('./pages/ProductDetail'));

function App() {
  // Main application wraps structure; context is provided at index.js
  return (
    <div className="App ocean-bg" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <main style={{flex: 1}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<div className="ocean-main-container"><div className="ocean-skeleton" style={{height:180, borderRadius:18, margin:18}} /></div>}>
                <ProductDetail />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}

export default App;
