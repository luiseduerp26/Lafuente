/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Eye, 
  Package, 
  Settings, 
  Check, 
  Edit3, 
  RotateCcw, 
  MapPin, 
  AlertCircle, 
  Activity,
  X
} from 'lucide-react';
import { MenuItem, Order, Category } from '../types';

interface AdminViewProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function AdminView({ menuItems, setMenuItems, orders, setOrders }: AdminViewProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDesc, setEditedDesc] = useState<string>('');

  // SEEDED HISTO DATA TO INJECT SPARK INTO THE CHARTS AT STARTUP (PAST 7 DAYS)
  const [historicalRecords] = useState([
    { date: '06-09', amount: 145000, ordersCount: 18 },
    { date: '06-10', amount: 189000, ordersCount: 22 },
    { date: '06-11', amount: 243000, ordersCount: 31 },
    { date: '06-12', amount: 198000, ordersCount: 26 },
    { date: '06-13', amount: 356000, ordersCount: 45 }, // Friday peak
    { date: '06-14', amount: 489000, ordersCount: 58 }, // Saturday peak
    { date: '06-15', amount: 285000, ordersCount: 36 }, // Sunday
  ]);

  // Merge today's active completed orders into chart statistics dynamically
  const getChartData = () => {
    const todayTotal = orders.reduce((acc, o) => acc + o.total, 0);
    const todayCount = orders.length;

    // Join 7 days + today
    const rawData = [...historicalRecords];
    rawData.push({
      date: 'Hoy (En Vivo)',
      amount: todayTotal,
      ordersCount: todayCount
    });
    return rawData;
  };

  // KPI Calculations
  const totalSalesFromHistory = historicalRecords.reduce((acc, r) => acc + r.amount, 0);
  const totalSalesToday = orders.reduce((acc, o) => acc + o.total, 0);
  const grandTotalSales = totalSalesFromHistory + totalSalesToday;

  const totalOrdersCount = historicalRecords.reduce((acc, r) => acc + r.ordersCount, 0) + orders.length;
  const averageTicket = totalOrdersCount > 0 ? Math.floor(grandTotalSales / totalOrdersCount) : 0;

  // Pie chart calculation (distribution of items by category)
  const getCategoryDistribution = () => {
    const counts: { [key in Category]?: number } = {};
    
    // Seed standard base weights to avoid blank distribution if no real orders
    counts.sandwiches = 45;
    counts.completos = 30;
    counts.completos_as = 20;
    counts.promociones = 15;

    // Add active orders counts
    orders.forEach(o => {
      o.items.forEach(it => {
        const itemObj = menuItems.find(m => m.id === it.menuItemId);
        if (itemObj) {
          const cat = itemObj.category;
          counts[cat] = (counts[cat] || 0) + it.quantity;
        }
      });
    });

    const COLORS = ['#2d5a27', '#e67e22', '#c0392b', '#9b59b6', '#3498db', '#f1c40f'];
    return Object.keys(counts).map((key, index) => ({
      name: key.toUpperCase(),
      value: counts[key as Category] || 0,
      color: COLORS[index % COLORS.length]
    }));
  };

  // Handle Inventory Updates
  const handleToggleAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(it => it.id === id ? { ...it, available: !it.available } : it)
    );
  };

  const handleToggleChileanClassic = (id: string) => {
    setMenuItems(prev =>
      prev.map(it => it.id === id ? { ...it, isChileanClassic: !it.isChileanClassic } : it)
    );
  };

  const handleStartEditing = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditedPrice(item.price);
    setEditedName(item.name);
    setEditedDesc(item.description);
  };

  const handleSaveItemChanges = () => {
    if (!editingItemId) return;
    setMenuItems(prev =>
      prev.map(it => {
        if (it.id !== editingItemId) return it;
        return {
          ...it,
          name: editedName.trim() || it.name,
          price: editedPrice > 0 ? editedPrice : it.price,
          description: editedDesc.trim() || it.description
        };
      })
    );
    setEditingItemId(null);
  };

  const handleResetMenuToDefault = () => {
    if (confirm('¿Estás seguro de que quieres restablecer los precios y configuraciones del menú original?')) {
      localStorage.removeItem('lafuente_menu_items');
      window.location.reload();
    }
  };

  // CLP formatting helper
  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  return (
    <div id="admin_dashboard_viewport" className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
      
      {/* 4 Metrics Cards Grid */}
      <div id="admin_quick_stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ventas Acumuladas</span>
            <p className="text-2xl font-black text-gray-900 font-mono tracking-tight">{formatCLP(grandTotalSales)}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% esta semana
            </span>
          </div>
          <div className="p-4 bg-green-50 rounded-2xl">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Boletas Emitidas</span>
            <p className="text-2xl font-black text-gray-900 font-mono tracking-tight">{totalOrdersCount}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8.5% volumen
            </span>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Consumo Promedio</span>
            <p className="text-2xl font-black text-gray-900 font-mono tracking-tight">{formatCLP(averageTicket)}</p>
            <span className="text-[10px] text-amber-600 font-bold">Consumo por sándwich</span>
          </div>
          <div className="p-4 bg-red-50 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sándwiches en Plancha</span>
            <p className="text-2xl font-black text-gray-900 font-mono tracking-tight">
              {orders.filter(o => o.status === 'cooking').reduce((acc, o) => acc + o.items.length, 0)}
            </p>
            <span className="text-[10px] text-gray-400">Actualmente en cocina</span>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>

      </div>

      {/* Charts Panels: Revenue Curve (Column 8) and Popularity % (Column 4) */}
      <div id="analytics_plots_grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Render 1: Live AreaChart of Sales Trend (8 columns) */}
        <div id="sales_trend_chart_card" className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-950" /> Curva de Ventas Diarias
              </h3>
              <p className="text-xs text-gray-400">Arqueo financiero sumando datos históricos y ventas del día de hoy en vivo.</p>
            </div>
            <span className="px-3 py-1 bg-amber-50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-100">
              Consolidado CLP
            </span>
          </div>

          <div id="recharts_trend_wrapper" className="w-full h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e67e22" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#e67e22" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [formatCLP(value), 'Monto Vendido']}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#e67e22" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Render 2: Pie popularity indicator (4 columns) */}
        <div id="categories_distribution_chart_card" className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-950" /> Sándwiches Favoritos
            </h3>
            <p className="text-xs text-gray-400">Distribución porcentual de platos por tipo de carne o categoría.</p>
          </div>

          <div id="recharts_pie_wrapper" className="w-full h-64 flex items-center justify-center relative min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={getCategoryDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getCategoryDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} unidades`, 'Consumo']} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Overlay indicators legend */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-xs text-gray-400 uppercase font-extrabold">Top</span>
              <span className="text-lg font-black text-amber-950">Churrascos</span>
            </div>
          </div>

          {/* Simple custom indicators panel */}
          <div id="custom_legend_box" className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
            {getCategoryDistribution().map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-gray-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                <span className="truncate">{cat.name}: {cat.value}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Central Inventory List Panel */}
      <div id="menu_inventory_section" className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4 mb-6">
          <div>
            <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-955 text-amber-950" /> Editor de Platos (Carta & Precios)
            </h3>
            <p className="text-xs text-gray-400">Configura precios, modifica nombres y deshabilita productos agotados al instante.</p>
          </div>
          
          <button
            id="reset_menu_defaults_btn"
            onClick={handleResetMenuToDefault}
            className="self-start sm:self-center px-4 py-2 hover:bg-gray-100 text-gray-600 hover:text-amber-950 text-xs font-semibold border border-gray-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restablecer Menú Original
          </button>
        </div>

        {/* Table of active products */}
        <div id="inventory_table_scroller" className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-150 text-xs text-gray-400 font-extrabold uppercase">
                <th className="py-3 px-4">Producto / Sándwich</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio Oficial</th>
                <th className="py-3 px-4 text-center">🇨🇱 Destacado</th>
                <th className="py-3 px-4 text-center">Estado Cocina</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {menuItems.map((item) => {
                const isEditing = editingItemId === item.id;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Column Sándwich name & description */}
                    <td className="py-4 px-4 max-w-sm">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="p-1 px-2 border border-gray-200 rounded text-xs w-full font-bold focus:outline-none focus:border-amber-500"
                          />
                          <textarea
                            value={editedDesc}
                            onChange={(e) => setEditedDesc(e.target.value)}
                            className="p-1 px-2 border border-gray-200 rounded text-[11px] w-full h-14 resize-none focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-gray-400 mt-1 line-clamp-1 italic text-[11px]">{item.description}</p>
                        </div>
                      )}
                    </td>

                    {/* Category indicator badge */}
                    <td className="py-4 px-4 capitalize">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold tracking-tight">
                        {item.category}
                      </span>
                    </td>

                    {/* Editable Pricing Column */}
                    <td className="py-4 px-4 font-mono font-bold text-gray-900 text-sm">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">$</span>
                          <input
                            type="number"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(Number(e.target.value))}
                            className="p-1 border border-gray-200 rounded w-20 text-right focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      ) : (
                        formatCLP(item.price)
                      )}
                    </td>

                    {/* Chilean classic status star toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleChileanClassic(item.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          item.isChileanClassic 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-white border-gray-100 text-gray-350 hover:bg-gray-50'
                        }`}
                        title="Alternar Clásico Chileno"
                      >
                        🇨🇱
                      </button>
                    </td>

                    {/* Out of Stock toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                          item.available
                            ? 'bg-green-105 bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {item.available ? '● DISPONIBLE' : '○ AGOTADO'}
                      </button>
                    </td>

                    {/* Editing triggers */}
                    <td className="py-4 px-4 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={handleSaveItemChanges}
                            className="p-1.5 bg-green-700 hover:bg-green-850 hover:bg-green-800 text-white rounded-lg transition-colors cursor-pointer"
                            title="Guardar cambios"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="p-1.5 bg-gray-150 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditing(item)}
                          className="px-2.5 py-1.5 bg-gray-102 hover:bg-gray-100 hover:bg-gray-150 border border-thin border-gray-100 hover:border-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer hover:font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Editar
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
