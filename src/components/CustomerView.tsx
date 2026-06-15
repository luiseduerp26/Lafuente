/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Utensils, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  Check, 
  X, 
  Coins, 
  CreditCard, 
  ChevronRight, 
  Eye, 
  TrendingUp, 
  Timer,
  ChevronDown,
  ExternalLink,
  Instagram
} from 'lucide-react';
import { MenuItem, Category, CartItem, Order, OrderType, PaymentMethod, CustomizedIngredient } from '../types';

interface CustomerViewProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  activeOrders: Order[];
  setActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setView: (view: 'customer' | 'kitchen' | 'admin') => void;
  setCurrentOrderTrackerId: (id: string | null) => void;
  currentOrderTrackerId: string | null;
}

export default function CustomerView({
  menuItems,
  cart,
  setCart,
  activeOrders,
  setActiveOrders,
  setView,
  setCurrentOrderTrackerId,
  currentOrderTrackerId,
}: CustomerViewProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('sandwiches');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Customizer State
  const [customBread, setCustomBread] = useState<'frica' | 'molde' | 'marraqueta' | 'none'>('frica');
  const [customIngredients, setCustomIngredients] = useState<CustomizedIngredient[]>([]);
  const [instructions, setInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
 
  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [address, setAddress] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('webpay');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 
  // Categories helper
  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'sandwiches', label: 'Sandwiches', icon: '🍔' },
    { key: 'completos', label: 'Completos', icon: '🌭' },
    { key: 'completos_as', label: 'Completos As', icon: '🥖' },
    { key: 'promociones', label: 'Promociones', icon: '🏷️' },
  ];
 
  // Add item straight to cart without customizer modal
  const handleDirectAddToCart = (item: MenuItem) => {
    if (!item.available) return;

    // Set default bread type based on category
    let defaultBread: 'frica' | 'molde' | 'marraqueta' | 'none' = 'none';
    if (!(item.category === 'completos' || item.category === 'completos_as' || item.category === 'promociones')) {
      defaultBread = 'frica';
    }

    // Initialize level ingredients with their defaults
    const initialConfig: CustomizedIngredient[] = item.ingredients.map(ing => ({
      name: ing.name,
      price: ing.price,
      status: ing.defaultIncluded ? 'included' : 'excluded'
    }));

    const newCartItem: CartItem = {
      id: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      finalPrice: item.price,
      quantity: 1,
      breadType: defaultBread,
      customIngredients: initialConfig,
      specialInstructions: ''
    };

    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, newCartItem];
    });

    // Open cart drawer panel as feedback so they know it is added
    setIsCartOpen(true);
  };

  // Toggle ingredient state in customizer: excluded -> included -> extra -> excluded
  const handleCycleIngredient = (ingName: string, config: any) => {
    setCustomIngredients(prev => 
      prev.map(ing => {
        if (ing.name !== ingName) return ing;
        
        let newStatus: 'included' | 'excluded' | 'extra' = 'included';
        if (ing.status === 'included') {
          // If it is removable, we can exclude it. Otherwise we go straight to extra
          newStatus = config.isRemovable ? 'excluded' : 'extra';
        } else if (ing.status === 'excluded') {
          newStatus = 'included';
        } else if (ing.status === 'extra') {
          newStatus = config.isRemovable ? 'excluded' : 'included';
        }
        
        return { ...ing, status: newStatus };
      })
    );
  };

  // Specific state setter for Ingredient Selector
  const setIngredientStatus = (ingName: string, status: 'included' | 'excluded' | 'extra') => {
    setCustomIngredients(prev =>
      prev.map(ing => ing.name === ingName ? { ...ing, status } : ing)
    );
  };

  // Calculate customized final price of single sándwich
  const calculateSinglePrice = (): number => {
    if (!selectedItem) return 0;
    let price = selectedItem.price;

    customIngredients.forEach(cus => {
      const originalConfig = selectedItem.ingredients.find(i => i.name === cus.name);
      if (!originalConfig) return;

      if (cus.status === 'extra') {
        // Double portion always charges ingredient's price
        price += cus.price;
      } else if (cus.status === 'included' && !originalConfig.defaultIncluded) {
        // Added an optional ingredient that wasn't included in the base recipe
        price += cus.price;
      }
    });

    // Special bread modifiers (e.g. toasted marraqueta is artisanal, maybe +300 CLP, but we can keep it identical to promote craft)
    if (customBread === 'marraqueta' && selectedItem.category !== 'completos') {
      price += 200; // 200 Pesos extra por Pan Marraqueta crujiente hecho al día
    }

    return price;
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const singlePrice = calculateSinglePrice();
    const newCartItem: CartItem = {
      id: `${selectedItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      finalPrice: singlePrice,
      quantity,
      breadType: customBread,
      customIngredients: [...customIngredients],
      specialInstructions: instructions.trim()
    };

    setCart(prev => [...prev, newCartItem]);
    setSelectedItem(null);

    // Bounce cart button visually
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, del: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQ = Math.max(1, item.quantity + del);
          return { ...item, quantity: newQ };
        }
        return item;
      })
    );
  };

  const getCartTotal = (): number => {
    return cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) newErrors.customerName = 'Debe ingresar su nombre';
    if (!customerPhone.trim()) newErrors.customerPhone = 'Debe ingresar un número de contacto';
    
    if (orderType === 'delivery' && !address.trim()) {
      newErrors.address = 'Debe ingresar una dirección de despacho';
    }

    if (cart.length === 0) {
      newErrors.cart = 'El carrito está vacío';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const subtotal = getCartTotal();
    const deliveryFee = orderType === 'delivery' ? 2000 : 0;
    const finalTotal = subtotal + deliveryFee;

    // Build the beautifully structured message for WhatsApp
    let message = `*🍔 NUEVO PEDIDO - LA FUENTE 🍔*\n`;
    message += `==================================\n`;
    message += `*Cliente:* ${customerName.trim()}\n`;
    message += `*WhatsApp/Tel:* ${customerPhone.trim()}\n`;
    
    const orderLabels: Record<string, string> = {
      delivery: '🛵 Despacho a Domicilio',
      takeaway: '📦 Retiro en Local',
      table: `🍔 Consumo en Mesa (Mesa #${tableNumber})`,
    };
    
    message += `*Modalidad:* ${orderLabels[orderType] || orderType}\n`;
    if (orderType === 'delivery' && address.trim()) {
      message += `*Dirección:* ${address.trim()}\n`;
    }
    
    const payLabels: Record<string, string> = {
      webpay: '💳 Webpay (Tarjeta)',
      transfer: '📱 Transferencia Bancaria',
      cash: '💵 Pago en Local / Efectivo',
    };
    message += `*Forma de Pago:* ${payLabels[paymentMethod] || paymentMethod}\n`;
    message += `==================================\n\n`;
    message += `*🥪 DETALLE DEL PEDIDO:*\n\n`;
    
    cart.forEach((item, index) => {
      message += `*${item.quantity}x ${item.name}* (${formatCLP(item.finalPrice * item.quantity)})\n`;
      if (item.breadType && item.breadType !== 'none') {
        const breadNames: Record<string, string> = {
          frica: 'Frica Clásico',
          marraqueta: 'Marraqueta artesanal',
          molde: 'Molde Tostado',
        };
        message += `  • _Pan: ${breadNames[item.breadType] || item.breadType}_\n`;
      }
      
      const customNotes = item.customIngredients.filter(i => {
        const origItem = menuItems.find(orig => orig.id === item.menuItemId);
        const origIng = origItem?.ingredients.find(oi => oi.name === i.name);
        return i.status !== 'included' || origIng?.defaultIncluded === false;
      });

      if (customNotes.length > 0) {
        customNotes.forEach(ing => {
          if (ing.status === 'excluded') {
            message += `  • _Sin ${ing.name.replace(' de la Fuente', '')}_\n`;
          } else if (ing.status === 'extra') {
            message += `  • _Doble ${ing.name.replace(' de la Fuente', '')}_ (+${formatCLP(ing.price)})\n`;
          } else if (ing.status === 'included') {
            message += `  • _Con ${ing.name.replace(' de la Fuente', '')}_ (+${formatCLP(ing.price)})\n`;
          }
        });
      }
      
      if (item.specialInstructions && item.specialInstructions.trim()) {
        message += `  • _Instrucciones:_ "${item.specialInstructions.trim()}"\n`;
      }
      message += `\n`;
    });
    
    message += `==================================\n`;
    message += `*Subtotal:* ${formatCLP(subtotal)}\n`;
    if (orderType === 'delivery') {
      message += `*Despacho:* ${formatCLP(deliveryFee)}\n`;
    }
    message += `*TOTAL A PAGAR:* ${formatCLP(finalTotal)}\n`;
    message += `==================================\n`;
    message += `¡Muchas gracias! Envíe este mensaje para iniciar su pedido.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/56950214914?text=${encodedMessage}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart and checkout fields to reset state smoothly
    setCart([]);
    setIsCartOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
  };

  // Helper format price
  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  // Filter items based on active tab
  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  // Active tracked order
  const trackedOrder = activeOrders.find(o => o.id === currentOrderTrackerId);

  return (
    <div id="customer_viewport" className="w-full max-w-7xl mx-auto px-4 py-6">
      
      {/* Dynamic Order Tracker Banner if there is a pending order */}
      {currentOrderTrackerId && trackedOrder && (
        <motion.div 
          id="active_order_banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-[#121214] border border-[#C5A059]/30 rounded-none flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A059]"></span>
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Pedido Activo</p>
              <p className="text-sm font-semibold text-white mt-1">Tu solicitud ({trackedOrder.id}) está en preparación.</p>
              <p className="text-xs text-slate-400 mt-1">
                Progreso: <span className="font-mono font-bold uppercase text-slate-200">
                  {trackedOrder.status === 'pending' && 'En Espera'}
                  {trackedOrder.status === 'cooking' && 'En Plancha'}
                  {trackedOrder.status === 'ready' && 'Listo para Retiro / Despachado'}
                  {trackedOrder.status === 'delivered' && 'Entregado'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              id="view_tracker_btn"
              onClick={() => setCurrentOrderTrackerId(trackedOrder.id)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/5 border border-[#C5A059] hover:bg-white/10 text-[#C5A059] hover:text-white rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Timer className="w-3.5 h-3.5" /> Rastrear Pedido
            </button>
            <button 
              id="clear_tracker_banner_btn"
              onClick={() => setCurrentOrderTrackerId(null)}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-none text-xs font-semibold transition-colors cursor-pointer"
              title="Ocultar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Grid: Categories & Items */}
      {!currentOrderTrackerId ? (
        <div id="standard_menu_flow" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Categories Navigation - Column Span 12 */}
          <div id="category_bar_wrapper" className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 border-b border-white/5 pb-8 mb-8 items-stretch">
              {/* Left Column: Title & Description */}
              <div className="xl:col-span-6 flex flex-col justify-center space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-0.5">Especialidades de La Casa</p>
                <h2 className="text-3xl md:text-4xl text-white font-light tracking-wide">
                  Excelencia en cada <span className="italic font-serif">ingrediente</span>.
                </h2>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Sándwiches calientes de primera selección, completos tradicionales, novedosos completos as y una variedad de imperdibles promociones.
                </p>
              </div>

              {/* Middle Column: Business Location Bento Card */}
              <div className="xl:col-span-3 bg-[#121214] border border-white/5 p-4 flex flex-col justify-between relative group hover:border-[#C5A059]/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/2 rounded-full blur-2xl group-hover:bg-[#C5A059]/5 transition-colors duration-350 pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-2 text-[#C5A059] mb-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Nuestra Ubicación</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#C5A059] transition-colors">La Fuente Sándwichería</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">
                    Ven por tu sándwich favorito y disfruta del sabor tradicional del sur.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <a 
                    href="https://maps.app.goo.gl/BS2sv742ZFkhaZrt5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    Abrir en Google Maps <ExternalLink className="w-3 h-3 text-[#C5A059]" />
                  </a>
                  <a 
                    href="https://www.instagram.com/lafuente_talcahuano/?hl=es" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    Ver Instagram <Instagram className="w-3 h-3 text-[#C5A059]" />
                  </a>
                </div>
              </div>

              {/* Right Column: Hours & Utilities Bento Card */}
              <div className="xl:col-span-3 bg-[#121214] border border-white/5 p-4 flex flex-col justify-between hover:border-[#C5A059]/30 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2 text-[#C5A059] mb-2">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Horarios y Despachos</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Lunes a Domingo</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">
                    Horario Continuo: 13:00 hasta las 22:30. Despachos y retiro disponibles de inmediato.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Pedir ahora y retira
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Categories */}
            <div id="categories_rail" className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    id={`cat_tab_${cat.key}`}
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-none whitespace-nowrap text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-white/5 border border-[#C5A059] text-[#C5A059] shadow-lg' 
                        : 'bg-[#121214] hover:bg-[#18181b] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span className="text-base select-none">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menú Grid - Column Span 12 */}
          <div id="menu_grid_wrapper" className="lg:col-span-12">
            <motion.div 
              id="menu_items_display_grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    id={`menu_item_card_${item.id}`}
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-[#121214] border border-white/5 rounded-none flex flex-col justify-between group transition-all duration-300 hover:border-[#C5A059]/30 ${
                      !item.available ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="font-medium text-lg text-white group-hover:text-[#C5A059] transition-colors font-sans">
                          {item.name}
                        </h3>
                        {item.isChileanClassic && (
                          <span className="px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-bold tracking-widest uppercase rounded-none border border-[#C5A059]/20">
                            🇨🇱 Clásico
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-light line-clamp-3 mb-5 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Default Ingredients Previews */}
                      {item.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.ingredients.filter(ing => ing.defaultIncluded).map((ing, i) => (
                            <span key={i} className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-none font-normal">
                              ✓ {ing.name.replace(' de la Fuente', '').replace(' de Campo', '')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="px-6 pb-6 pt-4 bg-[#0a0a0c]/40 border-t border-white/5 flex items-center justify-between">
                      <span className="text-lg font-bold text-[#C5A059] font-mono tracking-tight">
                        {formatCLP(item.price)}
                      </span>
                      {item.available ? (
                        <button
                          id={`add_to_order_btn_${item.id}`}
                          onClick={() => handleDirectAddToCart(item)}
                          className="bg-white/5 hover:bg-white/10 text-white hover:text-[#C5A059] border border-white/10 hover:border-[#C5A059]/55 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Añadir
                        </button>
                      ) : (
                        <span className="bg-white/5 text-slate-500 px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider border border-white/5">
                          Agotado
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Tracker View Details */
        <div id="tracked_order_viewport" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Header row inside tracker */}
          <div className="lg:col-span-12 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#C5A059] font-extrabold tracking-[0.2em] uppercase">Módulo de Seguimiento de Plancha</p>
              <h2 className="text-2xl font-light text-white font-sans mt-0.5">Estado de tu <span className="italic font-serif">Pedido</span></h2>
            </div>
            <button
              id="back_to_menu_btn"
              onClick={() => setCurrentOrderTrackerId(null)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#C5A059] border border-[#C5A059] hover:text-white text-xs font-bold uppercase tracking-wider rounded-none flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Volver al Menú Sándwichero
            </button>
          </div>

          {/* Left Column: Progress status timeline (Column 8) */}
          <div id="tracker_timeline_card" className="lg:col-span-8 bg-[#121214] border border-white/5 rounded-none p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
              <div>
                <span className="text-xs font-mono font-bold bg-white/5 text-[#C5A059] px-3.5 py-1.5 rounded-none border border-[#C5A059]/25">
                  Código: {trackedOrder?.id}
                </span>
                <p className="text-xs text-slate-400 mt-3">
                  Hecho el {trackedOrder && new Date(trackedOrder.createdAt).toLocaleDateString('es-CL', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Tipo de Entrega</span>
                <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-2 border border-white/5 rounded-none uppercase tracking-wider">
                  {trackedOrder?.orderType === 'delivery' && '🛵 Despacho Domicilio'}
                  {trackedOrder?.orderType === 'takeaway' && '📦 Retiro en Local'}
                  {trackedOrder?.orderType === 'table' && `🍔 Servicio en Mesa ${trackedOrder.tableNumber}`}
                </span>
              </div>
            </div>

            {/* Stepper progress */}
            <div id="tracking_stepper" className="space-y-8 relative">
              {/* Vertical timeline connector */}
              <div className="absolute left-[20px] top-3 bottom-3 w-0.5 bg-white/5"></div>

              {/* Status 1: Recibido / Pending */}
              <div className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center font-bold text-sm z-15 border ${
                  trackedOrder?.status !== 'pending' 
                    ? 'bg-[#121214] border-white/10 text-[#C5A059]' 
                    : 'bg-[#C5A059] border-[#C5A059] text-black animate-pulse shadow-md'
                }`}>
                  {trackedOrder && ['cooking', 'ready', 'delivered'].includes(trackedOrder.status) ? <Check className="w-5 h-5 stroke-[2.5]" /> : '1'}
                </div>
                <div className="pt-1">
                  <h4 className={`text-sm uppercase tracking-wider font-bold ${trackedOrder?.status === 'pending' ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                    Pedido Recibido en Caja 🥚
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xl font-light leading-relaxed">
                    Tu pedido ha sido registrado con éxito en nuestro sistema y está en cola para su validación de pago.
                  </p>
                </div>
              </div>

              {/* Status 2: Cooking */}
              <div className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center font-bold text-sm z-15 border ${
                  ['ready', 'delivered'].includes(trackedOrder?.status || '') 
                    ? 'bg-[#121214] border-white/10 text-[#C5A059]' 
                    : trackedOrder?.status === 'cooking'
                      ? 'bg-[#C5A059] border-[#C5A059] text-black animate-pulse shadow-md'
                      : 'bg-white/5 border-white/5 text-slate-600'
                }`}>
                  {trackedOrder && ['ready', 'delivered'].includes(trackedOrder.status) ? <Check className="w-5 h-5 stroke-[2.5]" /> : '2'}
                </div>
                <div className="pt-1">
                  <h4 className={`text-sm uppercase tracking-wider font-bold ${trackedOrder?.status === 'cooking' ? 'text-[#C5A059]' : 'text-slate-500'}`}>
                    En la Plancha del Maestro Sanguchero 🍳
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xl font-light leading-relaxed">
                    ¡La cocina está al rojo vivo! Se están asando las carnes, dorando los panes frica y aderezando con abundante palta y mayonesa casera batida en el momento.
                  </p>
                </div>
              </div>

              {/* Status 3: Ready */}
              <div className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center font-bold text-sm z-15 border ${
                  trackedOrder?.status === 'delivered' 
                    ? 'bg-[#121214] border-white/10 text-[#C5A059]' 
                    : trackedOrder?.status === 'ready'
                      ? 'bg-[#C5A059] border-[#C5A059] text-black animate-pulse shadow-md'
                      : 'bg-white/5 border-white/5 text-slate-600'
                }`}>
                  {trackedOrder?.status === 'delivered' ? <Check className="w-5 h-5 stroke-[2.5]" /> : '3'}
                </div>
                <div className="pt-1">
                  <h4 className={`text-sm uppercase tracking-wider font-bold ${trackedOrder?.status === 'ready' ? 'text-[#C5A059]' : 'text-slate-500'}`}>
                    {trackedOrder?.orderType === 'delivery' ? 'En Camino con Repartidor 🛵' : 'Listo para Retirar / Servir 📦'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xl font-light leading-relaxed">
                    {trackedOrder?.orderType === 'delivery' 
                      ? 'El repartidor ya recogió el sándwich térmico y va rumbo a tu dirección para entregarlo calientito.'
                      : '¡Plato listo en el mesón! Por favor, acércate a la barra de La Fuente brindando tu código de pedido.'}
                  </p>
                </div>
              </div>

              {/* Status 4: Delivered */}
              <div className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center font-bold text-sm z-15 border ${
                  trackedOrder?.status === 'delivered' 
                    ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-md' 
                    : 'bg-white/5 border-white/5 text-slate-650'
                }`}>
                  4
                </div>
                <div className="pt-1">
                  <h4 className={`text-sm uppercase tracking-wider font-bold ${trackedOrder?.status === 'delivered' ? 'text-[#C5A059]' : 'text-slate-500'}`}>
                    ¡Entregado y Disfrutando! 🎉
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xl font-light leading-relaxed">
                    Es el momento de hincarle el diente a ese sándwich monumental. ¡Muchas gracias por preferir La Fuente Sandwichería!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Direct Line Warning */}
            <div className="mt-10 p-5 bg-[#0a0a0c]/50 border border-white/5 rounded-none text-xs text-slate-400 leading-relaxed flex items-center gap-3 animate-none">
              <span className="text-lg">📢</span>
              <p>Puedes refrescar o alternar esta vista para chequear actualizaciones de la cocina. Si necesitas un cambio urgente en tus ingredientes, llámanos directo a cocina al <strong className="text-[#C5A059] font-mono">+56 9 8765 4321</strong>.</p>
            </div>
          </div>

          {/* Right Column: Ticket Breakdown (Column 4) */}
          <div id="tracker_bill_breakdown" className="lg:col-span-4 space-y-6">
            <div className="bg-[#121214] border border-white/5 rounded-none p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#C5A059]"></div>
              <h3 className="font-semibold uppercase tracking-wider text-white text-xs mb-4 flex items-center gap-2 font-sans">
                <CheckCircle className="w-4 h-4 text-[#C5A059]" /> Detalle de tu Boleta
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {trackedOrder?.items.map((item) => (
                  <div key={item.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-200">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-mono font-bold text-[#C5A059]">
                        {formatCLP(item.finalPrice * item.quantity)}
                      </span>
                    </div>
                    {item.breadType && item.breadType !== 'none' && (
                      <p className="text-[11px] text-slate-400 mt-1 italic capitalize font-light">
                        • Pan: {item.breadType === 'frica' ? 'Frica Clásico' : item.breadType === 'marraqueta' ? 'Marraqueta Crujiente' : 'Molde Tostado'}
                      </p>
                    )}
                    {/* List customized options */}
                    {item.customIngredients.filter(i => i.status !== 'included' || menuItems.find(orig => orig.id === item.menuItemId)?.ingredients.find(oi => oi.name === i.name)?.defaultIncluded === false).map((ing, i) => {
                      if (ing.status === 'excluded') {
                        return <p key={i} className="text-[10px] text-red-400 ml-2 font-light">• Sin {ing.name.replace(' de la Fuente', '')}</p>;
                      } else if (ing.status === 'extra') {
                        return <p key={i} className="text-[10px] text-green-400 ml-2 font-light">• Doble {ing.name.replace(' de la Fuente', '')} (+{formatCLP(ing.price)})</p>;
                      } else if (ing.status === 'included') {
                        return <p key={i} className="text-[10px] text-[#C5A059] ml-2 font-light">• Agregar {ing.name.replace(' de la Fuente', '')} (+{formatCLP(ing.price)})</p>;
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-white/10 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-light">
                  <span>Subtotal consumido</span>
                  <span className="font-mono">{formatCLP(trackedOrder?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-light">
                  <span>Cargo de Despacho</span>
                  <span className="font-mono">{formatCLP(trackedOrder?.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/5">
                  <span className="uppercase tracking-wider text-xs">TOTAL BOLETA</span>
                  <span className="font-mono text-[#C5A059]">{formatCLP(trackedOrder?.total || 0)}</span>
                </div>
              </div>
            </div>

            {/* Tracking help details */}
            <div className="bg-[#121214] border border-white/5 rounded-none p-6 text-xs space-y-3 text-slate-400">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">💳 Información del Pago</h4>
              <p>Método escogido: <span className="font-semibold uppercase text-[#C5A059]">{trackedOrder?.paymentMethod}</span></p>
              <p>Estado del pago: <span className="px-2 py-1 bg-white/5 text-[#C5A059] border border-[#C5A059]/20 rounded font-semibold uppercase font-mono tracking-wider">{trackedOrder?.paymentStatus === 'paid' ? 'Aprobado / Webpay' : 'Cobrar al Entregar'}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* ITEM DETAIL MODAL (CUSTOMIZER) */}
      <AnimatePresence>
        {false && (
          <div id="customizer_backdrop" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              id="customizer_modal"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="bg-[#121214] border border-white/5 rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#0A0A0B] text-white relative">
                <div>
                  <span className="text-[9px] font-bold tracking-widest uppercase bg-[#C5A059]/10 text-[#C5A059] px-2.5 py-1 rounded-none border border-[#C5A059]/20">
                    {selectedItem.category}
                  </span>
                  <h3 id="customize_title" className="text-xl font-light tracking-wide mt-3 flex items-center gap-2 text-ellipsis font-sans">
                    <Sparkles className="w-5 h-5 text-[#C5A059]" /> Personaliza tu <span className="font-serif italic">{selectedItem.name}</span>
                  </h3>
                </div>
                <button
                  id="close_customizer_modal_top"
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-none hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Customization Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Bread Selection (Only for sandwich categories) */}
                {['sandwiches'].includes(selectedItem.category) && (
                  <div id="bread_selection_group" className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">
                      1. Tipo de Pan Tradicional
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'frica', label: '🥖 Pan Frica', desc: 'Clásico redondo blando' },
                        { key: 'marraqueta', label: '🍞 Marraqueta', desc: 'Crujiente artesanal (+ $200)' },
                        { key: 'molde', label: '🥪 Pan de Molde', desc: 'Tostado de molde' },
                      ].map((bread) => {
                        const isSel = customBread === bread.key;
                        return (
                          <button
                            id={`bread_opt_${bread.key}`}
                            key={bread.key}
                            type="button"
                            onClick={() => setCustomBread(bread.key as any)}
                            className={`p-3.5 rounded-none text-left border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-white/5 border-[#C5A059] text-white font-bold' 
                                : 'bg-[#0A0A0B] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="font-semibold block text-sm transition-colors text-white">{bread.label}</span>
                            <span className="text-[10px] text-slate-500 mt-1 block font-normal leading-tight">{bread.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Custom Ingredients List */}
                {selectedItem.ingredients.length > 0 && (
                  <div id="ingredients_custom_group" className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">
                      2. Sazón & Ingredientes (A Gusto)
                    </h4>
                    
                    <div className="space-y-2 border border-white/5 rounded-none p-4 bg-[#0A0A0B]">
                      {selectedItem.ingredients.map((ing) => {
                        const custom = customIngredients.find(i => i.name === ing.name);
                        const status = custom?.status || 'included';

                        return (
                          <div id={`ing_row_${ing.name.replace(/\s+/g, '_')}`} key={ing.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-none">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-200">
                                {ing.name}
                              </span>
                              <span className="text-[11px] text-slate-500 mt-0.5">
                                {ing.defaultIncluded ? 'Incluido en la receta original' : `Adicional por +${formatCLP(ing.price)}`}
                              </span>
                            </div>

                            {/* Tri-state controller buttons */}
                            <div className="flex bg-[#121214] border border-white/5 rounded-none p-0.5 max-w-fit antialiased">
                              {/* Option: SIN */}
                              {ing.isRemovable && (
                                <button
                                  type="button"
                                  onClick={() => setIngredientStatus(ing.name, 'excluded')}
                                  className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all cursor-pointer ${
                                    status === 'excluded'
                                      ? 'bg-red-950/45 text-red-400 font-bold border border-red-900/30'
                                      : 'text-slate-500 hover:text-slate-350'
                                  }`}
                                >
                                  Sin
                                </button>
                              )}

                              {/* Option: NORMAL / CON */}
                              <button
                                type="button"
                                  onClick={() => setIngredientStatus(ing.name, 'included')}
                                  className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all cursor-pointer ${
                                    status === 'included'
                                      ? 'bg-white/10 text-white font-bold border border-white/10'
                                      : 'text-slate-500 hover:text-slate-350'
                                  }`}
                              >
                                {ing.defaultIncluded ? 'Normal' : 'Agregar'}
                              </button>

                              {/* Option: EXTRA (Double portion) */}
                              {ing.isOptional && (
                                <button
                                  type="button"
                                  onClick={() => setIngredientStatus(ing.name, 'extra')}
                                  className={`px-2.5 py-1.5 rounded-none text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    status === 'extra'
                                      ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 font-bold'
                                      : 'text-slate-500 hover:text-[#C5A059]'
                                  }`}
                                >
                                  Doble (+{formatCLP(ing.price)})
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Special Instructions */}
                <div id="instructions_group" className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">
                    3. Notas Especiales para el Planchero
                  </h4>
                  <textarea
                    id="special_instructions_input"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ej: Sándwich bien jugoso, tostar muy bien el pan, sin sal..."
                    className="w-full h-20 p-3 bg-[#0A0A0B] border border-white/5 rounded-none text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all resize-none font-light"
                    maxLength={140}
                  />
                </div>

                {/* 4. Quantity adjustment */}
                <div id="quantity_picker_row" className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">Cantidad de sándwiches</span>
                  <div className="flex items-center gap-3 bg-[#0A0A0B] p-1.5 rounded-none border border-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-1 rounded-none hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-8 text-center text-sm font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-1 rounded-none hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom bar with final price and CTA */}
              <div className="p-6 border-t border-white/5 bg-[#0A0A0B] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Monto de tu receta personalizada</span>
                  <span className="text-2xl font-bold text-[#C5A059] font-mono">
                    {formatCLP(calculateSinglePrice() * quantity)}
                  </span>
                </div>
                <button
                  id="add_to_cart_confirm_btn"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#b08b47] text-[#0A0A0B] font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2]" /> Agregar a la Bandeja
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER (RIGHT PANEL) */}
      <AnimatePresence>
        {isCartOpen && (
          <div id="cart_drawer_backdrop" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-end">
            {/* Click outside target */}
            <div id="cart_backdrop_click" className="absolute inset-0 cursor-pointer" onClick={() => setIsCartOpen(false)}></div>
            
            <motion.div
              id="cart_drawer_panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#121214] border-l border-white/5 h-full shadow-2xl flex flex-col z-20 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-[#0A0A0B] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
                  <span className="text-sm uppercase tracking-wider font-light">Tu Bandeja de Pedidos</span>
                  <span className="bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold font-mono w-5 h-5 rounded-none flex items-center justify-center mt-0.5">
                    {cart.reduce((acu, i) => acu + i.quantity, 0)}
                  </span>
                </div>
                <button
                  id="close_cart_btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-none hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Body scrolling */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {cart.length === 0 ? (
                  <div id="empty_cart_slate" className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <span className="text-4xl">🥪</span>
                    <p className="text-white font-bold text-sm">Tu bandeja está vacía</p>
                    <p className="text-xs text-slate-500 max-w-xs font-light leading-relaxed">¡No te quedes con las ganas! Agrega un sándwich con abundante palta y mayo casera.</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items list */}
                    <div id="cart_items_list" className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">Sándwiches Escogidos</h3>
                      {cart.map((item) => (
                        <div id={`cart_item_row_${item.id}`} key={item.id} className="p-4 bg-[#0A0A0B] border border-white/5 rounded-none flex flex-col justify-between gap-3 relative overflow-hidden">
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-white">{item.name}</h4>
                              {item.breadType && item.breadType !== 'none' && (
                                <p className="text-[10px] text-[#C5A059] font-semibold uppercase tracking-wide mt-1">
                                  Pan: {item.breadType === 'frica' ? 'Frica Clásico' : item.breadType === 'marraqueta' ? 'Marraqueta artesanal' : 'Molde Tostado'}
                                </p>
                              )}
                              
                              {/* Display customizations details */}
                              <div className="mt-1.5 space-y-0.5 animate-none">
                                {item.customIngredients.filter(i => i.status !== 'included' || menuItems.find(orig => orig.id === item.menuItemId)?.ingredients.find(oi => oi.name === i.name)?.defaultIncluded === false).map((ing, i) => {
                                  if (ing.status === 'excluded') {
                                    return <p key={i} className="text-[10px] text-red-400 font-medium font-light">• Sin {ing.name.replace(' de la Fuente', '')}</p>;
                                  } else if (ing.status === 'extra') {
                                    return <p key={i} className="text-[10px] text-green-400 font-semibold font-light">• Doble {ing.name.replace(' de la Fuente', '')} (+{formatCLP(ing.price)})</p>;
                                  } else if (ing.status === 'included') {
                                    return <p key={i} className="text-[10px] text-[#C5A059] font-semibold font-light">• Con {ing.name.replace(' de la Fuente', '')} (+{formatCLP(ing.price)})</p>;
                                  }
                                  return null;
                                })}
                                {item.specialInstructions && (
                                  <p className="text-[11px] text-slate-400 bg-white/5 rounded-none px-2 py-1 mt-1 border border-white/5 italic font-light">
                                    " {item.specialInstructions} "
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              id={`remove_cart_item_${item.id}`}
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="p-1 hover:bg-white/5 text-slate-500 hover:text-red-450 transition-colors cursor-pointer"
                              title="Borrar sándwich"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-2 bg-[#121214] border border-white/5 p-0.5 rounded-none shadow-sm">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="p-1 hover:bg-white/5 rounded-none text-slate-400 cursor-pointer"
                              >
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="p-1 hover:bg-white/5 rounded-none text-slate-400 cursor-pointer"
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>
                            
                            {/* Item Price */}
                            <span className="font-mono font-bold text-sm text-[#C5A059]">
                              {formatCLP(item.finalPrice * item.quantity)}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Checkout Form */}
                    <form id="checkout_form" onSubmit={handleCheckout} className="border-t border-white/5 pt-6 space-y-4">
                      <h3 className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">Detalles de Entrega & Pago</h3>

                      {errors.cart && (
                        <p className="text-xs text-red-400 font-bold bg-red-955/20 p-2.5 border border-red-900/35 rounded-none">{errors.cart}</p>
                      )}

                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tu Nombre de Contacto</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                          <input
                            id="customer_name_input"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Marcelo Salas"
                            className="w-full text-xs p-3.5 pl-9 bg-[#0A0A0B] border border-white/5 rounded-none text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/35 focus:border-[#C5A059] font-light"
                          />
                        </div>
                        {errors.customerName && <p className="text-[10px] text-red-400">{errors.customerName}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Celular con WhatsApp</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                          <input
                            id="customer_phone_input"
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Ej: +56 9 8765 4321"
                            className="w-full text-xs p-3.5 pl-9 bg-[#0A0A0B] border border-white/5 rounded-none text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/35 focus:border-[#C5A059] font-light"
                          />
                        </div>
                        {errors.customerPhone && <p className="text-[10px] text-red-400">{errors.customerPhone}</p>}
                      </div>

                      {/* Order Type Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Modalidad de Pedido</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'delivery', label: '🛵 Despacho' },
                            { key: 'takeaway', label: '📦 Retirar' },
                            { key: 'table', label: '🍔 En Mesa' },
                          ].map((type) => {
                            const isSel = orderType === type.key;
                            return (
                              <button
                                key={type.key}
                                type="button"
                                onClick={() => {
                                  setOrderType(type.key as any);
                                  // Reset payment for table to promote ease
                                  if (type.key === 'table') {
                                    setPaymentMethod('cash');
                                  }
                                }}
                                className={`py-2 text-center text-[10px] font-bold uppercase tracking-wide rounded-none transition-all cursor-pointer border ${
                                  isSel
                                    ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]'
                                    : 'bg-[#0A0A0B] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {type.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dynamic inputs based on Order Type */}
                      {orderType === 'delivery' && (
                        <div id="delivery_address_group" className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Dirección de Despacho (con Comuna)</label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                            <input
                              id="delivery_address_input"
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Ej: Av Providencia 1234, Providencia"
                              className="w-full text-xs p-3.5 pl-9 bg-[#0A0A0B] border border-white/5 rounded-none text-slate-101 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/35 focus:border-[#C5A059] font-light"
                            />
                          </div>
                          {errors.address && <p className="text-[10px] text-red-500">{errors.address}</p>}
                          <p className="text-[10px] text-slate-500 italic font-mono mt-1">Costo único de reparto: $2.000</p>
                        </div>
                      )}

                      {orderType === 'table' && (
                        <div id="table_number_group" className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Número de Mesa</label>
                          <div className="relative">
                            <Utensils className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                            <select
                              id="table_number_select"
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className="w-full text-xs p-3.5 pl-9 bg-[#0A0A0B] border border-white/5 rounded-none text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/35 focus:border-[#C5A059] cursor-pointer"
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                                <option key={n} value={String(n)} className="bg-[#121214] text-slate-200">Mesa #{n}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Payment Method */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Método de Pago</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'webpay', label: '💳 Webpay', showForTable: false },
                            { key: 'transfer', label: '📱 Transfer.', showForTable: true },
                            { key: 'cash', label: '💵 Pago Local', showForTable: true },
                          ].map((pay) => {
                            // If table, hide webpay to avoid complex gateways simulation
                            if (orderType === 'table' && !pay.showForTable) return null;
                            const isSel = paymentMethod === pay.key;
                            return (
                              <button
                                key={pay.key}
                                type="button"
                                onClick={() => setPaymentMethod(pay.key as any)}
                                className={`py-2 text-center text-[10px] font-bold uppercase tracking-wide rounded-none transition-all cursor-pointer border ${
                                  isSel
                                    ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]'
                                    : 'bg-[#0A0A0B] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {pay.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </form>
                  </>
                )}

              </div>

              {/* Draw footer with totals */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-[#0A0A0B] space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between font-light">
                      <span>Subtotal pedidos</span>
                      <span className="font-mono text-slate-200">{formatCLP(getCartTotal())}</span>
                    </div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between font-light">
                        <span>Despacho a Domicilio</span>
                        <span className="font-mono text-slate-200">$2.000</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-2.5 border-t border-white/5">
                      <span className="uppercase tracking-wider">Monto Total</span>
                      <span className="font-mono text-[#C5A059]">{formatCLP(getCartTotal() + (orderType === 'delivery' ? 2000 : 0))}</span>
                    </div>
                  </div>

                  <button
                    id="submit_checkout_btn"
                    onClick={handleCheckout}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold uppercase tracking-widest text-xs rounded-none flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg border border-green-500/20"
                  >
                    Pedir por WhatsApp <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIXED FLOATING CART BUTTON */}
      {cart.length > 0 && !isCartOpen && !currentOrderTrackerId && (
        <motion.button
          id="floating_cart_btn"
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-none bg-[#C5A059] hover:bg-[#b08b47] text-[#0A0A0B] shadow-2xl z-40 border border-[#C5A059]/45 flex items-center justify-center gap-3 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-3.5 -right-3.5 bg-black border border-white/10 text-[#C5A059] text-[10px] font-bold w-5.5 h-5.5 rounded-none flex items-center justify-center font-mono">
              {cart.reduce((acum, i) => acum + i.quantity, 0)}
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider pr-1 select-none">{formatCLP(getCartTotal())}</span>
        </motion.button>
      )}

    </div>
  );
}
