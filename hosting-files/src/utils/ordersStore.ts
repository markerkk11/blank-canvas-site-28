// Centralized localStorage-backed orders store with events
// Keeps same keys: 'orders' and 'processedOrders'

export type ProcessingType = 'bank' | 'otp';

const ORDER_KEY = 'orders';
const PROCESSED_KEY = 'processedOrders';

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return JSON.parse(raw || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export function getOrders(): any[] {
  const parsed = safeParse<any[]>(localStorage.getItem(ORDER_KEY), []);
  return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
}

export function setOrders(orders: any[]) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  notify();
}

export function addOrder(order: any) {
  const orders = getOrders();
  orders.push(order);
  setOrders(orders);
  return order?.id;
}

export function updateOrder(orderId: string, updater: (o: any) => any) {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === orderId ? updater(o) : o));
  setOrders(updated);
}

export function deleteOrder(orderId: string) {
  const orders = getOrders().filter((o) => o.id !== orderId);
  setOrders(orders);
}

export function clearAllOrders() {
  localStorage.removeItem(ORDER_KEY);
  localStorage.removeItem(PROCESSED_KEY);
  notify();
}

export function getProcessedOrders(): string[] {
  const parsed = safeParse<string[]>(localStorage.getItem(PROCESSED_KEY), []);
  return Array.isArray(parsed) ? parsed : [];
}

export function setProcessedOrders(ids: string[]) {
  localStorage.setItem(PROCESSED_KEY, JSON.stringify(ids));
  notify();
}

export function markOrderProcessed(orderId: string, processingType: ProcessingType = 'otp') {
  // save processingType on the order
  updateOrder(orderId, (o) => ({ ...o, processingType }));
  // add to processed list
  const processed = new Set(getProcessedOrders());
  processed.add(orderId);
  setProcessedOrders(Array.from(processed));
}

function notify() {
  const ev = new Event('orders_updated');
  window.dispatchEvent(ev);
  // @ts-ignore custom document event for robustness
  document.dispatchEvent(ev);
}

export function subscribeOrders(callback: () => void) {
  const handler = () => callback();
  window.addEventListener('orders_updated', handler as EventListener);
  window.addEventListener('storage', handler as EventListener);
  document.addEventListener('visibilitychange', handler as EventListener);
  // @ts-ignore
  document.addEventListener('orders_updated', handler as EventListener);
  return () => {
    window.removeEventListener('orders_updated', handler as EventListener);
    window.removeEventListener('storage', handler as EventListener);
    document.removeEventListener('visibilitychange', handler as EventListener);
    // @ts-ignore
    document.removeEventListener('orders_updated', handler as EventListener);
  };
}
