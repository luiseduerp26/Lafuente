/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Check, 
  ChefHat, 
  X, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Timer, 
  BellRing, 
  Play, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface KitchenViewProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function KitchenView({ orders, setOrders }: KitchenViewProps) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update clock every minute to show ticket cooking duration live
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // --- WEB AUDIO SYNTHESIS FOR KITCHEN SOUNDEFFECTS ---
  const playSizzleSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Generate White Noise Buffer for Sissle Sensation
      const bufferSize = ctx.sampleRate * 1.5; // 1.5 seconds of sizzling
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Noise Source
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // Filter to shape raw noise into soft sizzling sound (bandpass)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(6500, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      // Lowpass Filter for depth
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3200, ctx.currentTime);

      // Gain Node with envelope (gradual decay)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      // Connect standard flow
      noiseNode.connect(filter);
      filter.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start();
    } catch (e) {
      console.warn('Audio Synthesis Sizzle failed', e);
    }
  };

  const playBellSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Restaurant Ding-Ding Service Bell (combination of high sine frequencies)
      const t = ctx.currentTime;
      
      // Bell Tone 1
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2100, t); // high crystal frequency
      
      // Bell Tone 2
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2550, t); // harmonious high dome frequency

      // Gain Node (quick decay)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(t + 0.82);
      osc2.stop(t + 0.82);
    } catch (e) {
      console.warn('Audio Synthesis Bell failed', e);
    }
  };

  const playChopSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // safe fallback
    }
  };

  // Helper change status
  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    // Sound reactions
    if (newStatus === 'cooking') {
      playSizzleSound();
    } else if (newStatus === 'ready') {
      playBellSound();
    } else {
      playChopSound();
    }

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== id) return ord;
        
        // Add note according to status
        let statusNote = 'Actualizado por cocina.';
        if (newStatus === 'cooking') statusNote = 'Sándwiches puestos en la plancha.';
        if (newStatus === 'ready') statusNote = 'Pedido embalado, listo para despacho.';
        if (newStatus === 'delivered') statusNote = 'Pedido entregado al cliente.';

        // Update order history
        const updatedHistory = [
          ...ord.history,
          { status: newStatus, timestamp: new Date().toISOString(), note: statusNote }
        ];

        return {
          ...ord,
          status: newStatus,
          history: updatedHistory
        };
      })
    );
  };

  // Archive orders (delivered orders disappear from direct display, kept in admin analytics)
  const handleArchiveOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Calculate order elapsed minutes
  const getElapsedMinutes = (createdAt: string) => {
    const start = new Date(createdAt);
    const diffMs = currentTime.getTime() - start.getTime();
    return Math.floor(diffMs / 1000 / 60);
  };

  // Filter orders by status
  const getOrdersByStatus = (status: OrderStatus) => {
    // Show only active, un-archived orders in the kitchen.
    // Delivered orders can be completed/archived.
    return orders.filter(o => o.status === status);
  };

  // Simple formatting help
  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  const pendingCount = getOrdersByStatus('pending').length;
  const cookingCount = getOrdersByStatus('cooking').length;
  const readyCount = getOrdersByStatus('ready').length;

  return (
    <div id="kitchen_display_container" className="w-full bg-[#121214] min-h-[90vh] rounded-none p-6 text-white overflow-hidden shadow-2xl relative border border-white/5">
      
      {/* Top Navigation Bar of the Kitchen Screen */}
      <div id="kitchen_top_bar" className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-5 mb-6 gap-4 font-sans">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-none">
            <ChefHat className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <h2 className="text-xl font-light tracking-[0.12em] uppercase flex items-center gap-2">
              COMCINA & PLANCHAS <span className="text-[9px] bg-red-950/45 text-red-400 border border-red-900/40 px-2 py-0.5 rounded-none uppercase tracking-widest animate-pulse font-mono">Monitor En Vivo</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-light">
              Recepción de tickets en tiempo real de La Fuente. Control acústico de avance de comandas.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4 bg-[#0A0A0B] px-4 py-2.5 border border-white/5 rounded-none">
          
          {/* Sounds toggle */}
          <button
            id="toggle_sounds_btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none transition-all cursor-pointer border ${
              soundEnabled 
                ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/35' 
                : 'bg-white/5 text-slate-500 border border-white/5'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" /> Sonido: On
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" /> Sonido: Off
              </>
            )}
          </button>
          
          <div className="text-right">
            <span className="text-[8px] tracking-widest text-slate-500 block font-bold uppercase">Hora Actual</span>
            <span className="text-xs font-mono font-bold text-[#C5A059]">
              {currentTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div id="kitchen_status_ribbon" className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'En Cola (Espera)', count: pendingCount, color: 'border-[#C5A059]/30 bg-[#0A0A0B] text-slate-400' },
          { label: 'En Plancha', count: cookingCount, color: 'border-blue-900/40 bg-[#0A0A0B] text-blue-400' },
          { label: 'Embalados (Listos)', count: readyCount, color: 'border-green-900/40 bg-[#0A0A0B] text-green-400' },
        ].map((met, i) => (
          <div key={i} className={`p-4 border-l-2 rounded-none flex items-center justify-between shadow-sm border border-white/5 ${met.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{met.label}</span>
            <span className="text-xl font-mono font-light text-[#C5A059]">{met.count}</span>
          </div>
        ))}
        {/* Helper to suggest active test */}
        <div className="hidden md:flex p-4 border border-white/5 bg-[#0A0A0B] rounded-none items-center justify-between text-[10px] uppercase tracking-wider text-slate-500">
          <span>Tips de Plancha:</span>
          <span className="text-slate-400">Suenan timbres al finalizar 🛎️</span>
        </div>
      </div>

      {/* THREE RAILS (TICKETS FEED) */}
      <div id="kitchen_grid_rails" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* RAIL 1: PENDING (EN ESPERA) */}
        <div id="rail_pending" className="bg-[#0A0A0B] border border-white/5 rounded-none p-4 min-h-[60vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2 text-[#C5A059] select-none">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              🧭 1. En Cola ({pendingCount})
            </span>
            <span className="text-[9px] font-mono bg-[#C5A059]/5 text-[#C5A059] px-2 py-0.5 border border-[#C5A059]/20 font-bold tracking-wider uppercase">Por Preparar</span>
          </div>

          <div id="pending_tickets_deck" className="space-y-4 flex-1 overflow-y-auto max-h-[110vh] pr-1">
            {getOrdersByStatus('pending').length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-600 text-xs py-8 border border-dashed border-white/5 rounded-none bg-[#121214]/40">
                <span className="text-lg">🥩</span>
                <p className="mt-2 font-bold text-slate-400">Sin pedidos en cola</p>
                <p className="text-[10px] text-slate-550 max-w-[200px] font-light mt-1">Los tickets entrantes de clientes se materializarán aquí.</p>
              </div>
            ) : (
              getOrdersByStatus('pending').map((order) => (
                <KitchenTicketItem 
                  key={order.id} 
                  order={order} 
                  elapsed={getElapsedMinutes(order.createdAt)}
                  onNext={() => handleUpdateStatus(order.id, 'cooking')}
                  nextLabel="Mandar a Plancha 🔥"
                />
              ))
            )}
          </div>
        </div>

        {/* RAIL 2: COOKING (PLANCO) */}
        <div id="rail_cooking" className="bg-[#0A0A0B] border border-white/5 rounded-none p-4 min-h-[60vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2 text-blue-400 select-none">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              🔥 2. En Plancha ({cookingCount})
            </span>
            <span className="text-[9px] font-mono bg-blue-950/30 text-blue-400 px-2 py-0.5 border border-blue-900/40 animate-pulse font-bold tracking-wider uppercase">En Fuego</span>
          </div>

          <div id="cooking_tickets_deck" className="space-y-4 flex-1 overflow-y-auto max-h-[110vh] pr-1">
            {getOrdersByStatus('cooking').length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-600 text-xs py-8 border border-dashed border-white/5 rounded-none bg-[#121214]/40">
                <span className="text-lg">🔥</span>
                <p className="mt-2 font-bold text-slate-400">Planchas despejadas</p>
                <p className="text-[10px] text-slate-550 max-w-[180px] font-light mt-1">Sándwiches en cocimiento aparecerán en este espacio.</p>
              </div>
            ) : (
              getOrdersByStatus('cooking').map((order) => (
                <KitchenTicketItem 
                  key={order.id} 
                  order={order} 
                  elapsed={getElapsedMinutes(order.createdAt)}
                  onNext={() => handleUpdateStatus(order.id, 'ready')}
                  nextLabel="¡Listo / Embalar! 📦"
                />
              ))
            )}
          </div>
        </div>

        {/* RAIL 3: READY (LISTOS) */}
        <div id="rail_ready" className="bg-[#0A0A0B] border border-white/5 rounded-none p-4 min-h-[60vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2 text-green-400 select-none">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              📦 3. Despachar / En Mesa ({readyCount})
            </span>
            <span className="text-[9px] font-mono bg-green-950/30 text-green-400 px-2 py-0.5 border border-green-900/40 font-bold tracking-wider uppercase">Listo</span>
          </div>

          <div id="ready_tickets_deck" className="space-y-4 flex-1 overflow-y-auto max-h-[110vh] pr-1">
            {getOrdersByStatus('ready').length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-600 text-xs py-8 border border-dashed border-white/5 rounded-none bg-[#121214]/40">
                <span className="text-lg">🛎️</span>
                <p className="mt-2 font-bold text-slate-400">No hay sándwiches listos</p>
                <p className="text-[10px] text-slate-550 max-w-[180px] font-light mt-1">Los pedidos listos para llevar o despachar esperan su turno.</p>
              </div>
            ) : (
              getOrdersByStatus('ready').map((order) => (
                <KitchenTicketItem 
                  key={order.id} 
                  order={order} 
                  elapsed={getElapsedMinutes(order.createdAt)}
                  onNext={() => handleUpdateStatus(order.id, 'delivered')}
                  nextLabel="Marcar Entregado ✓"
                />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

/* HELPER INTERNAL SUB-COMPONENT FOR COCOCHENA TICKET */
interface TicketProps {
  key?: string;
  order: Order;
  elapsed: number;
  onNext: () => void;
  nextLabel: string;
}

function KitchenTicketItem({ order, elapsed, onNext, nextLabel }: TicketProps) {
  // Alert colors if tickets dwell for too long (e.g. Churrascos shouldn't wait over 12 mins!)
  const isDelayed = elapsed >= 10;

  return (
    <motion.div
      id={`ticket_card_${order.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className={`bg-[#0A0A0B] border rounded-none p-4 space-y-3.5 shadow-md border-b-4 relative overflow-hidden flex flex-col justify-between ${
        isDelayed 
          ? 'border-red-900 border-b-red-600 bg-red-950/10' 
          : order.status === 'pending'
            ? 'border-white/5 border-b-[#C5A059]'
            : order.status === 'cooking'
              ? 'border-white/5 border-b-[#C5A059]/40'
              : 'border-white/5 border-b-green-700'
      }`}
    >
      
      {/* Ticket Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[9px] text-[#C5A059] font-mono font-bold uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-none">
            #{order.orderNumber}
          </span>
          <p className="text-xs font-bold text-white mt-2 uppercase tracking-wide truncate max-w-[150px]">
            {order.customerName}
          </p>
        </div>
        
        {/* Cooking Duration Alarm */}
        <div className={`flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-none ${
          isDelayed ? 'bg-red-950 border border-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-slate-400'
        }`}>
          <Clock className="w-3 h-3 text-[#C5A059]" /> {elapsed}m
        </div>
      </div>

      {/* Ticket Body: Core plates consumption lists */}
      <div className="bg-[#121214] rounded-none p-3.5 space-y-2.5 border border-white/5">
        {order.items.map((item, index) => (
          <div key={index} className="text-xs border-b border-white/5 last:border-none pb-2.5 last:pb-0 font-light">
            <p className="font-bold text-slate-100 flex justify-between">
              <span>{item.quantity}x {item.name}</span>
            </p>
            {item.breadType && item.breadType !== 'none' && (
              <p className="text-[9px] text-[#C5A059] uppercase font-bold tracking-wider mt-1">
                → Pan: {item.breadType === 'frica' ? 'Frica Clásico' : item.breadType === 'marraqueta' ? 'Marraqueta' : 'Molde'}
              </p>
            )}
            
            {/* Customizations details precisely written so plans master gets it quick */}
            {item.customIngredients.filter(ci => ci.status !== 'included').map((ing, i) => {
              if (ing.status === 'excluded') {
                return (
                  <span key={i} className="inline-block text-[8px] bg-red-950/40 text-red-400 font-bold px-1.5 py-0.5 border border-red-900/30 rounded-none mt-1 mr-1 uppercase tracking-wider">
                    SIN {ing.name.replace(' de la Fuente', '').replace(' de Campo', '')}
                  </span>
                );
              } else if (ing.status === 'extra') {
                return (
                  <span key={i} className="inline-block text-[8px] bg-[#C5A059]/10 text-[#C5A059] font-bold px-1.5 py-0.5 border border-[#C5A059]/20 rounded-none mt-1 mr-1 uppercase tracking-wider">
                    DOBLE {ing.name.replace(' de la Fuente', '').replace(' de Campo', '')}
                  </span>
                );
              }
              return null;
            })}
            
            {/* Notes indication */}
            {item.specialInstructions && (
              <p className="text-[9px] bg-white/[0.02] border border-white/5 text-slate-400 p-2 rounded-none mt-2 italic font-mono lowercase">
                🛑 "{item.specialInstructions}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer detail location */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2 pb-1 bg-white/[0.01] px-2 rounded-none font-light">
        <span className="font-bold uppercase tracking-wider">
          {order.orderType === 'delivery' && '🛵 Domicilio'}
          {order.orderType === 'takeaway' && '📦 Retiro'}
          {order.orderType === 'table' && `🍔 Mesa ${order.tableNumber}`}
        </span>
        <span className="font-mono text-[#C5A059]">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total)}</span>
      </div>

      {/* Trigger switch state CTAs */}
      <button
        id={`kitchen_state_btn_${order.id}`}
        onClick={onNext}
        className={`w-full py-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer mt-1 ${
          order.status === 'pending'
            ? 'bg-[#C5A059] hover:bg-[#b08b47] text-[#0A0A0B]'
            : order.status === 'cooking'
              ? 'bg-blue-900/60 hover:bg-blue-800 text-white border border-blue-700/30'
              : 'bg-green-800 hover:bg-green-700 text-white border border-green-600/30'
        }`}
      >
        <span>{nextLabel}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

    </motion.div>
  );
}
