import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Eye, Trash2, Clock, CheckCircle, RotateCcw, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import DingHeader from "@/components/DingHeader";
import { getAllOrders, deleteOrderFromDatabase, clearAllOrdersFromDatabase, markOrderProcessedInDatabase, updateOrderInDatabase, subscribeToOrderChanges, type DatabaseOrder } from "@/utils/databaseStore";

// Using DatabaseOrder type from databaseStore
type OrderRecord = DatabaseOrder;

export function AdminPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [processedOrders, setProcessedOrders] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [rawOrders, setRawOrders] = useState<string>("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const allOrders = await getAllOrders();
        console.log('Loaded orders (database):', allOrders);
        setOrders(allOrders);
        // Filter processed orders
        const processed = allOrders.filter(order => order.is_processed).map(order => order.id);
        setProcessedOrders(processed);
        setRawOrders(JSON.stringify(allOrders, null, 2));
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load orders from database');
      }
    };
    // Load orders initially
    loadOrders();

    // Set up interval to check for new orders every 2 seconds (fallback)
    const interval = setInterval(loadOrders, 2000);

    // Subscribe to store updates (primary)
    const unsubscribe = subscribeToOrderChanges(loadOrders);

    // Also reload on window focus and custom updates
    const handleRefresh = () => loadOrders();
    window.addEventListener('focus', handleRefresh);

    return () => {
      clearInterval(interval);
      unsubscribe();
      window.removeEventListener('focus', handleRefresh);
    };
  }, []);

  // Manual refresh for debugging and reliability
  const refreshOrdersNow = async () => {
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      const processed = allOrders.filter(order => order.is_processed).map(order => order.id);
      setProcessedOrders(processed);
      setRawOrders(JSON.stringify(allOrders, null, 2));
      console.log('[AdminPanel] Manual refresh. Orders:', allOrders.length);
    } catch (e) {
      console.warn('[AdminPanel] Manual refresh error', e);
      toast.error('Failed to refresh orders');
    }
  };

  const handleLogin = () => {
    if (isBlocked) {
      return;
    }
    
    if (password === "JangaBangaSeven!!") {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      refreshOrdersNow();
      toast.success("Access granted");
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 3) {
        setIsBlocked(true);
        toast.error("Access blocked. Too many failed attempts.");
        // Close connection by redirecting to a blank page after a delay
        setTimeout(() => {
          window.location.href = "about:blank";
        }, 2000);
      } else {
        toast.error(`Invalid password. ${3 - newFailedAttempts} attempts remaining.`);
      }
      setPassword("");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderFromDatabase(orderId);
      await refreshOrdersNow();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error("Failed to delete order");
    }
  };

  const handleProcessOrder = async (orderId: string, processingType: 'bank' | 'otp' = 'otp') => {
    try {
      await markOrderProcessedInDatabase(orderId, processingType);
      
      // Set redirect flags for the user
      if (processingType === 'otp') {
        localStorage.setItem(`redirect_to_otp_${orderId}`, 'true');
      } else if (processingType === 'bank') {
        localStorage.setItem(`redirect_to_bank_${orderId}`, 'true');
      }
      
      await refreshOrdersNow();
      toast.success(`Order processed for ${processingType === 'bank' ? 'bank completion' : 'OTP verification'}. User will be redirected.`);
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error("Failed to process order");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllOrdersFromDatabase();
      setOrders([]);
      setProcessedOrders([]);
      toast.success("All orders cleared");
    } catch (error) {
      console.error('Error clearing orders:', error);
      toast.error("Failed to clear orders");
    }
  };

  const handleReenterOTP = async (orderId: string) => {
    try {
      // Set flag for incorrect OTP and redirect user back to OTP page
      localStorage.setItem(`otp_incorrect_${orderId}`, 'true');
      localStorage.setItem(`redirect_to_otp_${orderId}`, 'true');
      
      // Clear the existing OTP from the order record
      await updateOrderInDatabase(orderId, { otp_code: null });
      await refreshOrdersNow();
      
      toast.info("User will be redirected to re-enter OTP");
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Failed to update order");
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    // Mark order as completed and redirect user to completion page
    localStorage.setItem(`redirect_to_completion_${orderId}`, 'true');
    localStorage.setItem(`order_completed_${orderId}`, 'true');
    toast.success("User will be redirected to order completion page");
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `orders_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Data exported successfully");
  };

  if (!isAuthenticated) {
    if (isBlocked) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
          <Card className="w-full max-w-md p-6 border-red-200 bg-red-50">
            <div className="text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-bold text-red-700 mb-2">Access Blocked</h1>
              <p className="text-red-600 mb-4">Too many failed login attempts.</p>
              <p className="text-sm text-red-500">Connection will be closed...</p>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground mt-2">Enter password to access admin panel</p>
            {failedAttempts > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {3 - failedAttempts} attempts remaining
              </p>
            )}
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full"
            />
            <Button 
              onClick={handleLogin}
              disabled={isBlocked}
              className="w-full"
            >
              Access Admin Panel
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <DingHeader variant="topup" />
      
      {/* Content */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground p-2 h-auto"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDebug((s) => !s)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>{showDebug ? 'Hide Debug' : 'Show Debug'}</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshOrdersNow}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>

        {/* Warning Banner */}
        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Eye className="w-5 h-5" />
            <div>
              <p className="font-semibold">Development/Demo Mode</p>
              <p className="text-sm">This stores data in browser localStorage. Not suitable for production use without proper security measures.</p>
            </div>
          </div>
        </Card>

        {/* Debug Panel */}
        {showDebug && (
          <Card className="p-4 mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Debug: localStorage snapshot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Keys</p>
                <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-40">
{JSON.stringify(Object.keys(localStorage), null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">orders (raw)</p>
                <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-40">
{rawOrders || '(empty)'}
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <p className="text-2xl font-bold text-foreground">
              ${orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Average Order</h3>
            <p className="text-2xl font-bold text-foreground">
              ${orders.length > 0 ? (orders.reduce((sum, order) => sum + parseFloat(order.total), 0) / orders.length).toFixed(2) : '0.00'}
            </p>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/")}
              >
                Create Test Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>PLS</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Zip Code</TableHead>
                    <TableHead>OTP Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => {
                  const isProcessed = processedOrders.includes(order.id);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="text-sm">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{order.phone}</TableCell>
                      <TableCell>{order.provider}</TableCell>
                      <TableCell>${order.amount}.00</TableCell>
                      <TableCell className="text-sm">{order.fees}</TableCell>
                      <TableCell className="font-semibold">${order.total}</TableCell>
                      <TableCell className="font-mono text-sm">{order.id_number}</TableCell>
                      <TableCell className="font-mono text-sm">{order.expiry}</TableCell>
                      <TableCell className="font-mono text-sm">{order.pls}</TableCell>
                      <TableCell>{order.name_on_card}</TableCell>
                      <TableCell>{order.country}</TableCell>
                      <TableCell>{order.zip_code}</TableCell>
                      <TableCell className="font-mono text-sm">{order.otp_code || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={isProcessed ? "default" : "secondary"} className="flex items-center space-x-1">
                          {isProcessed ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Processed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </>
                          )}
                        </Badge>
                      </TableCell>
                       <TableCell>
                         <div className="flex space-x-2">
                           {!isProcessed && (
                             <>
                               <Button
                                 variant="default"
                                 size="sm"
                                 onClick={() => handleProcessOrder(order.id, 'otp')}
                                 className="text-white"
                               >
                                 Process
                               </Button>
                               <Button
                                 variant="secondary"
                                 size="sm"
                                 onClick={() => handleProcessOrder(order.id, 'bank')}
                               >
                                 Process-bank
                               </Button>
                             </>
                           )}
                           {isProcessed && order.otp_code && (
                             <>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleReenterOTP(order.id)}
                                 className="flex items-center space-x-1"
                               >
                                 <RotateCcw className="w-3 h-3" />
                                 <span>Re-enter</span>
                               </Button>
                               <Button
                                 variant="default"
                                 size="sm"
                                 onClick={() => handleCompleteOrder(order.id)}
                                 className="flex items-center space-x-1"
                               >
                                 <Check className="w-3 h-3" />
                                 <span>Complete</span>
                               </Button>
                             </>
                           )}
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleDeleteOrder(order.id)}
                             className="text-red-600 hover:text-red-700"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}