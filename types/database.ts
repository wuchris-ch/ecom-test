export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_cents: number;
          image_url: string | null;
          is_digital: boolean;
          weight_grams: number | null;
          stock: number | null;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_cents: number;
          image_url?: string | null;
          is_digital?: boolean;
          weight_grams?: number | null;
          stock?: number | null;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          image_url?: string | null;
          is_digital?: boolean;
          weight_grams?: number | null;
          stock?: number | null;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          shipping_address: Json | null;
          subtotal_cents: number;
          shipping_cents: number;
          total_cents: number;
          status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          shipping_address?: Json | null;
          subtotal_cents: number;
          shipping_cents?: number;
          total_cents: number;
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          shipping_address?: Json | null;
          subtotal_cents?: number;
          shipping_cents?: number;
          total_cents?: number;
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          quantity: number;
          price_cents: number;
          is_digital: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name: string;
          quantity: number;
          price_cents: number;
          is_digital?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          name?: string;
          quantity?: number;
          price_cents?: number;
          is_digital?: boolean;
          created_at?: string;
        };
      };
      digital_downloads: {
        Row: {
          id: string;
          order_item_id: string;
          product_id: string | null;
          download_token: string;
          download_count: number;
          max_downloads: number;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          product_id?: string | null;
          download_token?: string;
          download_count?: number;
          max_downloads?: number;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          product_id?: string | null;
          download_token?: string;
          download_count?: number;
          max_downloads?: number;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type DigitalDownload = Database["public"]["Tables"]["digital_downloads"]["Row"];

export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];
export type DigitalDownloadInsert = Database["public"]["Tables"]["digital_downloads"]["Insert"];

