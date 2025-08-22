import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Download, RefreshCw, Eye, Edit, User,
  Package, Truck, CheckCircle, XCircle, Clock, AlertTriangle,
  DollarSign, TrendingUp, BarChart3
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UpdateStatusModal from '../../components/checkout/UpdateStatusModal';
import PrintLabelsModal from '../../components/common/PrintLabelsModal';
import NotificationModal from '../../components/common/NotificationModal';
import ExportModal from '../../components/common/ExportModal';
import { formatPrice } from '../../utils';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderTimeline {
  id: string;
  status: string;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  notes: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
}

const AdminOrderManagement: React.FC = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showPrintLabelsModal, setShowPrintLabelsModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load orders function
  const loadOrders = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockOrders: AdminOrder[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customer: {
          id: 'cust-1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+91 98765 43210',
          avatar: '/api/placeholder/40/40'
        },
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            productName: 'Himalayan Apple Seeds',
            productImage: '/api/placeholder/60/60',
            sku: 'HAS-001',
            quantity: 2,
            price: 4999,
            total: 9998
          },
          {
            id: 'item-2',
            productId: 'prod-2',
            productName: 'Orange Tree Sapling',
            productImage: '/api/placeholder/60/60',
            sku: 'OTS-002',
            quantity: 1,
            price: 8999,
            total: 8999
          }
        ],
        subtotal: 18997,
        shipping: 200,
        tax: 1900,
        total: 21097,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'MH',
          zipCode: '400001',
          country: 'India'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'MH',
          zipCode: '400001',
          country: 'India'
        },
        notes: 'Customer requested expedited shipping',
        timeline: [
          {
            id: 'timeline-1',
            status: 'Order Placed',
            timestamp: '2024-01-20T10:00:00Z',
            updatedBy: 'Customer'
          },
          {
            id: 'timeline-2',
            status: 'Payment Confirmed',
            timestamp: '2024-01-20T10:15:00Z',
            updatedBy: 'System'
          },
          {
            id: 'timeline-3',
            status: 'Processing',
            timestamp: '2024-01-20T14:30:00Z',
            note: 'Items picked and packed',
            updatedBy: 'Admin'
          }
        ],
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        estimatedDelivery: '2024-01-25',
        trackingNumber: 'TRK123456789',
        shippingCarrier: 'FedEx'
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        customer: {
          id: 'cust-2',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+91 98765 43211',
          avatar: '/api/placeholder/40/40'
        },
        items: [
          {
            id: 'item-3',
            productId: 'prod-3',
            productName: 'Organic Tomato Seeds',
            productImage: '/api/placeholder/60/60',
            sku: 'OTS-003',
            quantity: 1,
            price: 3659,
            total: 3659
          }
        ],
        subtotal: 3659,
        shipping: 200,
        tax: 366,
        total: 4225,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'PayPal',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Delhi',
          state: 'DL',
          zipCode: '110001',
          country: 'India'
        },
        billingAddress: {
          street: '456 Oak Ave',
          city: 'Delhi',
          state: 'DL',
          zipCode: '110001',
          country: 'India'
        },
        notes: '',
        timeline: [
          {
            id: 'timeline-4',
            status: 'Order Placed',
            timestamp: '2024-01-19T09:00:00Z',
            updatedBy: 'Customer'
          },
          {
            id: 'timeline-5',
            status: 'Payment Confirmed',
            timestamp: '2024-01-19T09:05:00Z',
            updatedBy: 'System'
          },
          {
            id: 'timeline-6',
            status: 'Shipped',
            timestamp: '2024-01-19T16:00:00Z',
            note: 'Package shipped via UPS',
            updatedBy: 'Admin'
          }
        ],
        createdAt: '2024-01-19T09:00:00Z',
        updatedAt: '2024-01-19T16:00:00Z',
        estimatedDelivery: '2024-01-24',
        trackingNumber: 'UPS987654321',
        shippingCarrier: 'UPS'
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        customer: {
          id: 'cust-3',
          name: 'Mike Wilson',
          email: 'mike.w@email.com',
          phone: '+91 98765 43212',
          avatar: '/api/placeholder/40/40'
        },
        items: [
          {
            id: 'item-4',
            productId: 'prod-4',
            productName: 'Premium Rose Seeds',
            productImage: '/api/placeholder/60/60',
            sku: 'PRS-004',
            quantity: 5,
            price: 5479,
            total: 27395
          }
        ],
        subtotal: 27395,
        shipping: 0,
        tax: 0,
        total: 27395,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'Bank Transfer',
        shippingAddress: {
          street: '789 Pine St',
          city: 'Bangalore',
          state: 'KA',
          zipCode: '560001',
          country: 'India'
        },
        billingAddress: {
          street: '789 Pine St',
          city: 'Bangalore',
          state: 'KA',
          zipCode: '560001',
          country: 'India'
        },
        notes: 'Customer prefers bank transfer',
        timeline: [
          {
            id: 'timeline-7',
            status: 'Order Placed',
            timestamp: '2024-01-22T16:45:00Z',
            updatedBy: 'Customer'
          }
        ],
        createdAt: '2024-01-22T16:45:00Z',
        updatedAt: '2024-01-22T16:45:00Z'
      }
    ];
    
    setOrders(mockOrders);
    setIsLoading(false);
  };

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, filterStatus, filterPayment]);

  // Sort logic
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'orderNumber':
          aValue = a.orderNumber;
          bValue = b.orderNumber;
          break;
        case 'customer':
          aValue = a.customer.name.toLowerCase();
          bValue = b.customer.name.toLowerCase();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredOrders, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // API Functions for new features
  const updateOrderStatus = async (newStatus: string, note: string) => {
    setActionLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.updateOrderStatus(selectedOrders, newStatus, note);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setOrders(prevOrders => prevOrders.map(order => {
        if (selectedOrders.includes(order.id)) {
          return {
            ...order,
            status: newStatus as any,
            timeline: [
              ...order.timeline,
              {
                id: Date.now().toString(),
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: note || `Status updated to ${newStatus}`,
                updatedBy: user?.name || 'Admin'
              }
            ],
            updatedAt: new Date().toISOString()
          };
        }
        return order;
      }));
      
      setShowUpdateStatusModal(false);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const printShippingLabels = async () => {
    setActionLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.printShippingLabels(selectedOrders);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate opening print dialog
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Shipping Labels</title></head>
            <body>
              <h1>Shipping Labels</h1>
              <p>Printing labels for ${selectedOrders.length} order(s)...</p>
              <script>window.print(); window.close();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      
      setShowPrintLabelsModal(false);
    } catch (error) {
      console.error('Failed to print labels:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const sendNotifications = async (message: string, type: 'email' | 'sms' | 'both') => {
    setActionLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.sendNotifications(selectedOrders, message, type);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowNotificationModal(false);
    } catch (error) {
      console.error('Failed to send notifications:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const exportOrders = async (format: 'pdf' | 'excel', filters?: any) => {
    setActionLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.exportOrders(format, filters);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate file download
      const blob = new Blob(['Mock export data'], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Failed to export orders:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage customer orders, payments, and shipments
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button 
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Orders
              </button>
              <button 
                onClick={loadOrders}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Order</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length > 0 ? formatPrice(orders.reduce((sum, order) => sum + order.total, 0) / orders.length) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders, customers, tracking..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Payment Filter */}
              <div className="md:col-span-2">
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="md:col-span-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="created-desc">Newest First</option>
                  <option value="created-asc">Oldest First</option>
                  <option value="total-desc">Highest Value</option>
                  <option value="total-asc">Lowest Value</option>
                  <option value="orderNumber-asc">Order Number A-Z</option>
                  <option value="customer-asc">Customer A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-700">
                  {selectedOrders.length} order(s) selected
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowUpdateStatusModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
                <button 
                  onClick={() => setShowPrintLabelsModal(true)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Print Labels
                </button>
                <button 
                  onClick={() => setShowNotificationModal(true)}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(paginatedOrders.map(o => o.id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          {order.trackingNumber && (
                            <div className="text-sm text-gray-500">Track: {order.trackingNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {order.customer.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={order.customer.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                            <div className="text-sm text-gray-500">{order.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item(s), {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                          <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, sortedOrders.length)}
                      </span>{' '}
                      of <span className="font-medium">{sortedOrders.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <UpdateStatusModal
          isOpen={showUpdateStatusModal}
          onClose={() => setShowUpdateStatusModal(false)}
          onSubmit={updateOrderStatus}
          loading={actionLoading}
          selectedCount={selectedOrders.length}
        />

        <PrintLabelsModal
          isOpen={showPrintLabelsModal}
          onClose={() => setShowPrintLabelsModal(false)}
          onConfirm={printShippingLabels}
          loading={actionLoading}
          selectedCount={selectedOrders.length}
        />

        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          onSubmit={sendNotifications}
          loading={actionLoading}
          selectedCount={selectedOrders.length}
        />

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={exportOrders}
          loading={actionLoading}
          totalOrders={orders.length}
        />
      </div>
    </div>
  );
};

export default AdminOrderManagement; 