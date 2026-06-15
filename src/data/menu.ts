/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, IngredientConfig } from '../types';

export const COMMON_INGREDIENTS = {
  palta: { name: 'Palta Hass Molida', price: 1200, isOptional: true, isRemovable: true, defaultIncluded: true },
  tomate: { name: 'Tomate Fresco', price: 800, isOptional: true, isRemovable: true, defaultIncluded: true },
  mayo: { name: 'Mayo Casera de la Fuente', price: 700, isOptional: true, isRemovable: true, defaultIncluded: true },
  chucrut: { name: 'Chucrut Alemán', price: 600, isOptional: true, isRemovable: true, defaultIncluded: true },
  americana: { name: 'Salsa Americana', price: 500, isOptional: true, isRemovable: true, defaultIncluded: true },
  salsaVerde: { name: 'Salsa Verde Tradicional', price: 500, isOptional: true, isRemovable: true, defaultIncluded: true },
  ajiVerde: { name: 'Ají Verde Picadito', price: 400, isOptional: true, isRemovable: true, defaultIncluded: true },
  porotosVerdes: { name: 'Porotos Verdes', price: 800, isOptional: true, isRemovable: true, defaultIncluded: true },
  queso: { name: 'Queso Mantecoso Fundido', price: 1000, isOptional: true, isRemovable: true, defaultIncluded: true },
  cebolla: { name: 'Cebolla Caramelizada', price: 700, isOptional: true, isRemovable: true, defaultIncluded: false },
  huevo: { name: 'Huevo Frito de Campo', price: 850, isOptional: true, isRemovable: true, defaultIncluded: false },
  champingon: { name: 'Champiñones Salteados', price: 900, isOptional: true, isRemovable: true, defaultIncluded: false },
  choclo: { name: 'Choclo Dulce', price: 800, isOptional: true, isRemovable: true, defaultIncluded: false },
  pepinillos: { name: 'Pepinillos en Conserva', price: 600, isOptional: true, isRemovable: true, defaultIncluded: false },
};

export const DEFAULT_MENU: MenuItem[] = [
  // --- SEGMENT: SANDWICHES ---
  {
    id: 'sw-barros-luco',
    name: 'Sándwich Barros Luco',
    category: 'sandwiches',
    description: 'Tradicional sándwich hecho con jugosa carne seleccionada y abundante queso mantecoso fundido en la plancha.',
    price: 4000,
    available: true,
    isChileanClassic: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-vegetariano',
    name: 'Sandwich Vegetariano',
    category: 'sandwiches',
    description: 'La opción verde perfecta: deliciosos champiñones salteados acompañados de queso mantecoso, palta molida fresca, tomate y mayonesa.',
    price: 4300,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.champingon, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-italiano',
    name: 'Sandwich Italiano',
    category: 'sandwiches',
    description: 'Clásico chileno reinventado con tiernos porotos verdes seleccionados, rebanadas de tomate y nuestra mayonesa casera.',
    price: 4700,
    available: true,
    isChileanClassic: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.porotosVerdes, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-tomate-mayo',
    name: 'Sandwich Tomate Mayo',
    category: 'sandwiches',
    description: 'Menos es más. Sencillo y sabroso sándwich de tomate con nuestra inconfundible crema de mayonesa casera.',
    price: 4300,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-diplomatico',
    name: 'Sandwich Diplomático',
    category: 'sandwiches',
    description: 'Elegante preparación que combina queso mantecoso fundido con tierno huevo frito de campo elaborado al instante.',
    price: 4500,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.huevo, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-pobre',
    name: 'Sandwich Pobre',
    category: 'sandwiches',
    description: 'El clásico sabor a lo pobre: cebolla caramelizada salteada, huevo frito de campo, queso derretido y una capa de mayonesa casera.',
    price: 4700,
    available: true,
    isChileanClassic: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.cebolla, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.huevo, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-patron',
    name: 'Sandwich Patrón',
    category: 'sandwiches',
    description: 'Como el patrón manda: queso fundido, granos de choclo dulce, tomate fresco seleccionado y mayonesa casera templada.',
    price: 4900,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.choclo, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'sw-chacarero',
    name: 'Sandwich Chacarero',
    category: 'sandwiches',
    description: 'Sabroso sándwich estilo chacarero con frescos porotos verdes, rodajas de tomate y la clásica mayonesa casera.',
    price: 4800,
    available: true,
    isChileanClassic: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.porotosVerdes, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },

  // --- SEGMENT: COMPLETOS ---
  {
    id: 'comp-mayo',
    name: 'Completo Mayo',
    category: 'completos',
    description: 'Sencillo y delicioso completo coronado únicamente con nuestra cremosa mayonesa casera de la casa.',
    price: 1300,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-aleman',
    name: 'Completo Alemán',
    category: 'completos',
    description: 'Opción tradicional con una base de crujiente tomate fresco, pepinillos seleccionados, chucrut tradicional y mayonesa casera.',
    price: 1800,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.pepinillos, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.chucrut, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-luco',
    name: 'Completo Luco',
    category: 'completos',
    description: 'Inigualable combinación que une el queso fundido tibio con nuestra rica mayonesa sobre la vienesa premium.',
    price: 2000,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-dinamico',
    name: 'Completo Dinámico (Italiano Chucrut)',
    category: 'completos',
    description: 'La gran fusión chilena de sabores: palta hass suave, tomate fresco, chucrut templado y un copo generoso de mayo.',
    price: 2200,
    available: true,
    isChileanClassic: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.chucrut, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-tomate-mayo',
    name: 'Completo Tomate & Mayo',
    category: 'completos',
    description: 'Un dúo inseparable: cubitos de tomate natural sobre la vienesa coronado con suave mayonesa casera.',
    price: 1600,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-palta-mayo',
    name: 'Completo Palta & Mayo',
    category: 'completos',
    description: 'Deliciosa palta hass molida artesanal y abundante mayonesa casera sobre la clásica vienesa.',
    price: 1800,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-italiano',
    name: 'Completo Italiano',
    category: 'completos',
    description: 'El más vendido de todos: palta molida de primera selección, cubos de tomate jugoso y un manto de mayonesa.',
    price: 2000,
    available: true,
    isChileanClassic: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'comp-vegetariano',
    name: 'Completo Vegetariano',
    category: 'completos',
    description: 'Sin vienesa. Exquisita alternativa con champiñones salteados, palta molida fresca, tomate picado y mayonesa casera.',
    price: 2200,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.champingon, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },

  // --- SEGMENT: COMPLETOS AS ---
  {
    id: 'as-mayo',
    name: 'Completo As Mayo',
    category: 'completos_as',
    description: 'Delicioso sándwich alargado tipo "As" relleno de carne jugosa a la plancha cubierta por nuestra mayonesa.',
    price: 2200,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'as-palta-mayo',
    name: 'Completo As Palta Mayo',
    category: 'completos_as',
    description: 'As con tierno picado de carne cubierto por una generosa capa de palta molida y un cordón de mayonesa.',
    price: 2500,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'as-luco',
    name: 'Completo As Luco',
    category: 'completos_as',
    description: 'Especialidad de carne fundida con doble ración de queso mantecoso caliente y mayonesa casera.',
    price: 2600,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'as-tomate-mayo',
    name: 'Completo As Tomate Mayo',
    category: 'completos_as',
    description: 'Un refrescante as de carne cubierto de tomate picado en cubos y mayonesa casera batida al momento.',
    price: 2300,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'as-aleman',
    name: 'Completo As Alemán',
    category: 'completos_as',
    description: 'As tradicional de carne sazonada con cubitos de tomate, pepinillos en conserva, chucrut caliente y mayonesa.',
    price: 2500,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.pepinillos, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.chucrut, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'as-italiano',
    name: 'Completo As Italiano',
    category: 'completos_as',
    description: 'El favorito indiscutido en versión As: carne seleccionada oculta bajo un manto de palta molida, tomate fresca y mayo.',
    price: 2700,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },

  // --- SEGMENT: PROMOCIONES ---
  {
    id: 'promo-ital-chucrut-beb',
    name: 'Completo Italiano chucrut + bebida',
    category: 'promociones',
    description: 'Sabor incomparable: Completo Italiano con toque de chucrut tradicional alemán más una refrescante bebida en lata.',
    price: 2990,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.chucrut, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'promo-4x-alemanes',
    name: '4X Completos Alemanes',
    category: 'promociones',
    description: 'Mega pack ideal para compartir: Cuatro completos alemanes completos con vienesa, tomate fresco, pepinillos, chucrut y mayonesa.',
    price: 6000,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.pepinillos, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.chucrut, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'promo-2x-sandwiches',
    name: '2X Sandwiches Lomo o Pollo',
    category: 'promociones',
    description: 'Par de exquisitos sándwiches a la plancha de lomo de cerdo tierno o pollito jugoso acompañados de palta suave y mayonesa casera.',
    price: 8000,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'promo-churr-ital-bebida',
    name: 'Sandwich Churrasco italiano + Bebida',
    category: 'promociones',
    description: 'El almuerzo chileno de oro: Jugoso sándwich de churrasco italiano (palta, tomate, mayo) acompañado de una gaseosa helada de 350cc.',
    price: 5490,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'promo-4x-italianos',
    name: '4X Completos Italianos (con vienesa)',
    category: 'promociones',
    description: 'La promoción para juntarse a ver el partido: Cuatro completos italianos grandes repletos de palta hass, tomate y bastante mayo.',
    price: 7000,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.palta, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  },
  {
    id: 'promo-2x-patron-churrasco',
    name: '2X Patrón churrasco',
    category: 'promociones',
    description: 'Dupla monumental de sándwich Patrón: Generosas láminas de churrasco, abundante queso mantecoso derretido, choclo dulce, tomate fresco y mayo casera.',
    price: 9000,
    available: true,
    ingredients: [
      { ...COMMON_INGREDIENTS.queso, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.choclo, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.tomate, defaultIncluded: true },
      { ...COMMON_INGREDIENTS.mayo, defaultIncluded: true }
    ]
  }
];

export const getStoredMenu = (): MenuItem[] => {
  if (typeof window === 'undefined') return DEFAULT_MENU;
  const stored = localStorage.getItem('lafuente_menu_items');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || parsed.length === 0 || parsed.some((item: any) => ['churrascos', 'lomitos', 'fricandelas', 'acompanamientos', 'bebidas'].includes(item.category))) {
        localStorage.removeItem('lafuente_menu_items');
        return DEFAULT_MENU;
      }
      // Migrate pricing for Completo As Italiano if stored with old price and merge any new default items
      const merged = [...parsed];
      DEFAULT_MENU.forEach((defaultItem) => {
        if (!merged.some((mItem: any) => mItem.id === defaultItem.id)) {
          merged.push(defaultItem);
        }
      });

      return merged.map((item: any) => {
        if (item.id === 'as-italiano' && item.price === 2500) {
          return { ...item, price: 2700 };
        }
        return item;
      });
    } catch (e) {
      console.error('Error deserealizando menú guardado', e);
    }
  }
  return DEFAULT_MENU;
};

export const saveStoredMenu = (menu: MenuItem[]) => {
  localStorage.setItem('lafuente_menu_items', JSON.stringify(menu));
};
