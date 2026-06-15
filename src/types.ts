/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'sandwiches' | 'completos' | 'completos_as' | 'promociones';

export interface IngredientConfig {
  name: string;
  price: number;
  isOptional: boolean;
  isRemovable: boolean;
  defaultIncluded: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  isChileanClassic?: boolean;
  ingredients: IngredientConfig[];
}

export interface CustomizedIngredient {
  name: string;
  price: number;
  status: 'included' | 'excluded' | 'extra';
}

export interface CartItem {
  id: string; // Unique instance ID for the cart item
  menuItemId: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  breadType?: 'frica' | 'molde' | 'marraqueta' | 'none';
  customIngredients: CustomizedIngredient[];
  specialInstructions: string;
}

export type OrderType = 'delivery' | 'takeaway' | 'table';
export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'delivered';
export type PaymentMethod = 'webpay' | 'transfer' | 'cash';

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  address?: string;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  createdAt: string; // ISO string
  history: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface SalesRecord {
  date: string; // YYYY-MM-DD
  amount: number;
  ordersCount: number;
}
