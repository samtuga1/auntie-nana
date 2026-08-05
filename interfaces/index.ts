export interface IPaginated<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export interface IProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  imageUrls: string[];
  category: IProductCategory;
  stock: number;
  /** Pack size shown on the storefront, e.g. "1kg" or "5g sachet". */
  weight?: string;
  /** Surfaced in the storefront "Best sellers" rail. */
  featured?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface IOrderItem {
  product: Pick<IProduct, "_id" | "name" | "price" | "imageUrls">;
  quantity: number;
  unitPrice: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: ICustomer;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paystackReference: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}
