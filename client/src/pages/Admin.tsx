import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, 
  Plus, 
  Package, 
  AlertCircle,
  ShoppingBag,
  TrendingUp,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  PackageCheck
} from "lucide-react";
import type { Product, Category } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface Order {
  id: string;
  userId: string | null;
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  total: string;
  status: string;
  deliveryStatus: string;
  trackingNumber: string | null;
  estimatedDeliveryDate: string | null;
  deliveryNotes: string | null;
  phone: string | null;
  stripePaymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  product: Product;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: string;
}

interface MonthlyReport {
  month: number;
  year: number;
  totalOrders: number;
  totalRevenue: string;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  orders: Order[];
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  const { data: userData, isLoading: userLoading } = useQuery<{ user: User }>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth');
        }
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (userData && !userData.user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userData, navigate, toast]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData || !userData.user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need admin privileges to access this page. Redirecting...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  
  const [deliveryFormData, setDeliveryFormData] = useState({
    deliveryStatus: "",
    trackingNumber: "",
    estimatedDeliveryDate: "",
    deliveryNotes: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    rating: "5",
    stock: "",
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === 'order_update' || lastMessage?.type === 'new_order') {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders/stats"] });
      toast({
        title: lastMessage.type === 'new_order' ? "New Order" : "Order Updated",
        description: `Order ${lastMessage.orderId?.substring(0, 8)}... has been ${lastMessage.type === 'new_order' ? 'placed' : 'updated'}`,
      });
    }
  }, [lastMessage, queryClient, toast]);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  const { data: stats } = useQuery<OrderStats>({
    queryKey: ["/api/admin/orders/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: monthlyReport } = useQuery<MonthlyReport>({
    queryKey: ["/api/admin/orders/monthly-report", reportMonth, reportYear],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/orders/monthly-report?month=${reportMonth}&year=${reportYear}`
      );
      if (!response.ok) throw new Error("Failed to fetch report");
      return response.json();
    },
  });

  const { data: orderItems = [] } = useQuery<OrderItem[]>({
    queryKey: ["/api/admin/orders", selectedOrder?.id, "items"],
    queryFn: async () => {
      if (!selectedOrder) return [];
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/items`);
      if (!response.ok) throw new Error("Failed to fetch order items");
      return response.json();
    },
    enabled: !!selectedOrder,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders/monthly-report"] });
      toast({
        title: "Success!",
        description: "Order status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const updateDeliveryStatusMutation = useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: any }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${orderId}/delivery`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders/stats"] });
      toast({
        title: "Success!",
        description: "Delivery status updated successfully",
      });
      setDeliveryFormData({
        deliveryStatus: "",
        trackingNumber: "",
        estimatedDeliveryDate: "",
        deliveryNotes: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success!",
        description: "Product added successfully",
      });
      setFormData({
        name: "",
        brand: "",
        description: "",
        price: "",
        image: "",
        categoryId: "",
        rating: "5",
        stock: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success!",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    createProductMutation.mutate({
      ...formData,
      price: formData.price,
      rating: parseInt(formData.rating),
      stock: parseInt(formData.stock),
    });
  };

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <PackageCheck className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold font-serif">Admin Panel</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">
              <Calendar className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-total-orders">{stats?.total || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-pending-orders">{stats?.pending || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-delivered-orders">{stats?.delivered || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-total-revenue">PKR {stats?.totalRevenue || "0.00"}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <div className="text-2xl font-bold">{stats?.pending || 0}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Processing</span>
                    </div>
                    <div className="text-2xl font-bold">{stats?.processing || 0}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Shipped</span>
                    </div>
                    <div className="text-2xl font-bold">{stats?.shipped || 0}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Delivered</span>
                    </div>
                    <div className="text-2xl font-bold">{stats?.delivered || 0}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Cancelled</span>
                    </div>
                    <div className="text-2xl font-bold">{stats?.cancelled || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Orders ({orders.length})</CardTitle>
                <CardDescription>
                  Manage and track all customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                          <TableCell className="font-mono text-xs">
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.name}</div>
                              <div className="text-sm text-muted-foreground">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">PKR {order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    data-testid={`button-view-order-${order.id}`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Order Details</DialogTitle>
                                    <DialogDescription>
                                      Order ID: {order.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Customer Name</Label>
                                        <p className="text-sm font-medium">{order.name}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className="text-sm font-medium">{order.email}</p>
                                      </div>
                                      <div>
                                        <Label>Total Amount</Label>
                                        <p className="text-sm font-semibold">PKR {order.total}</p>
                                      </div>
                                      <div>
                                        <Label>Status</Label>
                                        <Badge className={getStatusColor(order.status)}>
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label>Shipping Address</Label>
                                      <p className="text-sm">
                                        {order.address}<br />
                                        {order.city}, {order.postalCode}<br />
                                        {order.country}
                                      </p>
                                    </div>

                                    <div>
                                      <Label>Order Items</Label>
                                      <div className="mt-2 space-y-2">
                                        {orderItems.map((item) => (
                                          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                                            <div className="flex items-center gap-3">
                                              <img 
                                                src={item.product.image} 
                                                alt={item.product.name}
                                                className="h-12 w-12 object-cover rounded"
                                              />
                                              <div>
                                                <p className="font-medium text-sm">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                              </div>
                                            </div>
                                            <p className="font-semibold">PKR {item.price}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Update Status</Label>
                                      <Select
                                        value={order.status}
                                        onValueChange={(value) => {
                                          updateOrderStatusMutation.mutate({
                                            orderId: order.id,
                                            status: value,
                                          });
                                        }}
                                      >
                                        <SelectTrigger className="mt-2" data-testid={`select-status-${order.id}`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="processing">Processing</SelectItem>
                                          <SelectItem value="shipped">Shipped</SelectItem>
                                          <SelectItem value="delivered">Delivered</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold">Delivery Tracking</h3>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Current Status</Label>
                                          <Badge className="mt-2">
                                            {order.deliveryStatus || 'pending'}
                                          </Badge>
                                        </div>
                                        {order.trackingNumber && (
                                          <div>
                                            <Label>Tracking Number</Label>
                                            <p className="text-sm font-mono mt-2">{order.trackingNumber}</p>
                                          </div>
                                        )}
                                      </div>

                                      <div>
                                        <Label htmlFor="deliveryStatus">Update Delivery Status</Label>
                                        <Select
                                          value={deliveryFormData.deliveryStatus || order.deliveryStatus}
                                          onValueChange={(value) => setDeliveryFormData({...deliveryFormData, deliveryStatus: value})}
                                        >
                                          <SelectTrigger className="mt-2" id="deliveryStatus" data-testid={`select-delivery-status-${order.id}`}>
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label htmlFor="trackingNumber">Tracking Number</Label>
                                        <Input
                                          id="trackingNumber"
                                          placeholder="Enter tracking number"
                                          value={deliveryFormData.trackingNumber}
                                          onChange={(e) => setDeliveryFormData({...deliveryFormData, trackingNumber: e.target.value})}
                                          className="mt-2"
                                          data-testid={`input-tracking-${order.id}`}
                                        />
                                      </div>

                                      <div>
                                        <Label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</Label>
                                        <Input
                                          id="estimatedDeliveryDate"
                                          type="date"
                                          value={deliveryFormData.estimatedDeliveryDate}
                                          onChange={(e) => setDeliveryFormData({...deliveryFormData, estimatedDeliveryDate: e.target.value})}
                                          className="mt-2"
                                          data-testid={`input-delivery-date-${order.id}`}
                                        />
                                      </div>

                                      <div>
                                        <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                                        <Textarea
                                          id="deliveryNotes"
                                          placeholder="Add any delivery notes or special instructions"
                                          value={deliveryFormData.deliveryNotes}
                                          onChange={(e) => setDeliveryFormData({...deliveryFormData, deliveryNotes: e.target.value})}
                                          className="mt-2"
                                          rows={3}
                                          data-testid={`textarea-delivery-notes-${order.id}`}
                                        />
                                      </div>

                                      <Button
                                        onClick={() => {
                                          updateDeliveryStatusMutation.mutate({
                                            orderId: order.id,
                                            data: deliveryFormData,
                                          });
                                        }}
                                        className="w-full"
                                        disabled={!deliveryFormData.deliveryStatus}
                                        data-testid={`button-update-delivery-${order.id}`}
                                      >
                                        <Truck className="h-4 w-4 mr-2" />
                                        Update Delivery Status
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Select
                                value={order.status}
                                onValueChange={(value) => {
                                  updateOrderStatusMutation.mutate({
                                    orderId: order.id,
                                    status: value,
                                  });
                                }}
                              >
                                <SelectTrigger className="w-[140px]" data-testid={`select-quick-status-${order.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Product
                  </CardTitle>
                  <CardDescription>
                    Fill in the details below to add a new product to your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Oud Royale"
                        data-testid="input-product-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        required
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        placeholder="e.g., Tom Ford"
                        data-testid="input-product-brand"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Product description..."
                        rows={3}
                        data-testid="input-product-description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (PKR)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder="2999"
                          data-testid="input-product-price"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          required
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          placeholder="50"
                          data-testid="input-product-stock"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, categoryId: value })
                        }
                        required
                      >
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        required
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                        data-testid="input-product-image"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Select
                        value={formData.rating}
                        onValueChange={(value) =>
                          setFormData({ ...formData, rating: value })
                        }
                      >
                        <SelectTrigger data-testid="select-product-rating">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createProductMutation.isPending}
                      data-testid="button-add-product"
                    >
                      {createProductMutation.isPending ? "Adding..." : "Add Product"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Products ({products.length})</CardTitle>
                  <CardDescription>
                    Manage your product inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>PKR {product.price}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(product.id, product.name)}
                                disabled={deleteProductMutation.isPending}
                                data-testid={`button-delete-product-${product.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {products.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No products found. Add your first product above.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Report</CardTitle>
                <CardDescription>
                  View order statistics and revenue for any month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select
                      value={reportMonth.toString()}
                      onValueChange={(value) => setReportMonth(parseInt(value))}
                    >
                      <SelectTrigger data-testid="select-report-month">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select
                      value={reportYear.toString()}
                      onValueChange={(value) => setReportYear(parseInt(value))}
                    >
                      <SelectTrigger data-testid="select-report-year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {monthlyReport && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold" data-testid="report-total-orders">
                            {monthlyReport.totalOrders}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold" data-testid="report-total-revenue">
                            PKR {monthlyReport.totalRevenue}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Orders by Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                          <div>
                            <div className="text-sm text-muted-foreground">Pending</div>
                            <div className="text-2xl font-bold">{monthlyReport.ordersByStatus.pending}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Processing</div>
                            <div className="text-2xl font-bold">{monthlyReport.ordersByStatus.processing}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Shipped</div>
                            <div className="text-2xl font-bold">{monthlyReport.ordersByStatus.shipped}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Delivered</div>
                            <div className="text-2xl font-bold">{monthlyReport.ordersByStatus.delivered}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Cancelled</div>
                            <div className="text-2xl font-bold">{monthlyReport.ordersByStatus.cancelled}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Order History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-auto max-h-[400px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {monthlyReport.orders.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell>
                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                  </TableCell>
                                  <TableCell>{order.name}</TableCell>
                                  <TableCell>PKR {order.total}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
