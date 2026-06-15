/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Phone, 
  ListOrdered,
  Database
} from 'lucide-react';
import { MenuItem, CartItem, Order, Category } from './types';
import { getStoredMenu, saveStoredMenu } from './data/menu';
import { fetchFromCloud, saveToCloud, subscribeToCloud } from './data/atomsCloud';
import Logo from './components/Logo';
import CustomerView from './components/CustomerView';

// PRE-SEEDED ACTIVE ORDERS - Not needed since orders go to Whatsapp
const DEFAULT_ACTIVE_ORDERS: Order[] = [];

export default function App() {
  const [view, setView] = useState<'customer'>('customer');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenu());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [currentOrderTrackerId, setCurrentOrderTrackerId] = useState<string | null>(null);

  // Synchronize menu items with AtomsCloud database to enable dual-sync viewing on any device in real-time
  useEffect(() => {
    // We use subscribeToCloud to subscribe to real-time snapshots
    const unsubscribe = subscribeToCloud('lafuente_menu_items', (cloudMenu) => {
      if (cloudMenu && Array.isArray(cloudMenu) && cloudMenu.length > 0) {
        setMenuItems(cloudMenu);
        saveStoredMenu(cloudMenu);
      }
    });

    async function checkAndSeed() {
      const cloudMenu = await fetchFromCloud('lafuente_menu_items');
      if (!cloudMenu || !Array.isArray(cloudMenu) || cloudMenu.length === 0) {
        // Initial seed of current menus into AtomsCloud
        await saveToCloud('lafuente_menu_items', menuItems);
      }
    }
    checkAndSeed();

    return () => unsubscribe();
  }, []);

  // Load orders on startup
  useEffect(() => {
    const storedOrders = localStorage.getItem('lafuente_orders');
    if (storedOrders) {
      try {
        setActiveOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error('Error parseando órdenes', e);
        setActiveOrders(DEFAULT_ACTIVE_ORDERS);
      }
    } else {
      setActiveOrders(DEFAULT_ACTIVE_ORDERS);
      localStorage.setItem('lafuente_orders', JSON.stringify(DEFAULT_ACTIVE_ORDERS));
    }
  }, []);

  // Save changes to orders and menu whenever they are updated
  useEffect(() => {
    if (activeOrders.length > 0) {
      localStorage.setItem('lafuente_orders', JSON.stringify(activeOrders));
    }
  }, [activeOrders]);

  useEffect(() => {
    if (menuItems.length > 0) {
      saveStoredMenu(menuItems);
    }
  }, [menuItems]);

  return (
    <div id="application_root" className="min-h-screen bg-[#0A0A0B] text-slate-300 antialiased flex flex-col font-sans">
      
      {/* GLOBAL HEADER HEADER BAR */}
      <header id="la_fuente_main_header" className="bg-[#0A0A0B]/90 backdrop-blur-md text-white border-b border-white/5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand title */}
          <div id="brand_header_column" className="flex items-center gap-3">
            <Logo size="sm" className="hidden sm:block hover:rotate-3 transition-transform opacity-90" />
            <div className="text-center sm:text-left select-none">
              <h1 className="text-2xl font-light tracking-[0.2em] text-white flex items-center justify-center sm:justify-start gap-2.5">
                LA FUENTE <span className="text-[#C5A059] font-mono text-[10px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm">SANDWICHERÍA</span>
              </h1>
              <p className="text-[9px] text-[#C5A059] tracking-[0.25em] font-normal uppercase mt-0.5">Sabor Chileno Tradicional • Cocinería de Alta Gama</p>
            </div>
          </div>

          {/* Sync status identifier pill */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/20 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider">AtomsCloud Conectado</span>
          </div>

        </div>
      </header>

      {/* RENDER CUSTOMER VUE PORT */}
      <main id="viewports_wrapper" className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key="customer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <CustomerView 
              menuItems={menuItems}
              cart={cart}
              setCart={setCart}
              activeOrders={activeOrders}
              setActiveOrders={setActiveOrders}
              setView={() => {}}
              currentOrderTrackerId={currentOrderTrackerId}
              setCurrentOrderTrackerId={setCurrentOrderTrackerId}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER BAR */}
      <footer id="app_credits_footer" className="bg-[#080809] border-t border-white/5 text-slate-500 text-center py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center sm:text-left">
            © 2026 LAFUENTE. Sabor chileno de alta gama.
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Base de Datos AtomsCloud</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Sincronizado</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
