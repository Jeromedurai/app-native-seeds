import React, { useState, useEffect } from 'react';
import { Search, Eye, RotateCcw, FileText, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils';
import { Product } from '../../types';


interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface UserOrder {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
}

const MyOrders: React.FC = () => {
  const { user, addToCart } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders: UserOrder[] = [
        {
          id: '1',
          orderNumber: '3245',
          items: [
            {
              id: 'item-1',
              productName: 'Tshirt',
              productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 4999
            },
            {
              id: 'item-2',
              productName: 'Echo Elegance',
              productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 8999
            },
            {
              id: 'item-3',
              productName: 'Smart Watch Timex',
              productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 10877
            }
          ],
          total: 24875,
          status: 'delivered',
          createdAt: '2024-05-12T12:30:00Z'
        },
        {
          id: '2',
          orderNumber: '8651',
          items: [
            {
              id: 'item-4',
              productName: 'Organic Sunscreen',
              productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 5999
            },
            {
              id: 'item-5',
              productName: 'Facewash',
              productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 7999
            },
            {
              id: 'item-6',
              productName: 'Sweater',
              productImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 6802
            }
          ],
          total: 20800,
          status: 'delivered',
          createdAt: '2024-05-16T10:30:00Z'
        },
        {
          id: '3',
          orderNumber: '9876',
          items: [
            {
              id: 'item-7',
              productName: 'Himalayan Apple Seeds',
              productImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=150&h=150&fit=crop&crop=center',
              quantity: 2,
              price: 4999
            },
            {
              id: 'item-8',
              productName: 'Orange Tree Sapling',
              productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&h=150&fit=crop&crop=center',
              quantity: 1,
              price: 8999
            }
          ],
          total: 18997,
          status: 'processing',
          createdAt: '2024-05-18T14:20:00Z'
        }
      ];
      
      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (orderId: string) => {
    // Navigate to order details page
    navigate(`/order-details/${orderId}`);
  };

  const handleReorder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      try {
        // Add all items from the order to cart
        for (const item of order.items) {
          // Create a Product object from the order item
          const product: Product = {
            productId: parseInt(item.id.replace('item-', '')),
            tenantId: 1,
            productName: item.productName,
            productDescription: item.productName,
            productCode: `PROD-${item.id}`,
            fullDescription: item.productName,
            specification: '',
            story: '',
            packQuantity: 1,
            quantity: item.quantity,
            total: item.price * item.quantity,
            price: item.price,
            categrory: 1,
            rating: 0,
            active: true,
            trending: 0,
            userBuyCount: 0,
            return: 0,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            in_stock: true,
            best_seller: false,
            deleveryDate: 3,
            offer: '',
            orderBy: 0,
            userId: 1,
            overview: item.productName,
            long_description: item.productName,
            images: [{
              imageId: 1,
              poster: item.productImage,
              main: true,
              active: true,
              orderBy: 1
            }]
          };
          
          await addToCart(product, item.quantity);
        }
        
        // Navigate to cart
        navigate('/cart');
      } catch (error) {
        console.error('Error adding items to cart:', error);
        alert('Failed to add items to cart. Please try again.');
      }
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setDownloadingInvoice(orderId);
    
    try {
      // Create invoice content
      const invoiceContent = `
INVOICE

Order Number: ${order.orderNumber}
Date: ${formatDate(order.createdAt)}
Customer: ${user?.name || user?.email}

ITEMS:
${order.items.map(item => 
  `${item.productName} x${item.quantity} - ${formatPrice(item.price)}`
).join('\n')}

TOTAL: ${formatPrice(order.total)}

Status: ${order.status.toUpperCase()}

Thank you for your order!
      `.trim();

      // Create blob and download
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(null);
    }
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600 mb-8">View and manage your past orders</p>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="lg:w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filter By */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                        filterStatus === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Orders
                    </button>
                    <button
                      onClick={() => setFilterStatus('delivered')}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                        filterStatus === 'delivered'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setFilterStatus('processing')}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                        filterStatus === 'processing'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => setFilterStatus('cancelled')}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                        filterStatus === 'cancelled'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest Value</option>
                    <option value="lowest">Lowest Value</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t placed any orders yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <div className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</div>
                      <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleReorder(order.id)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reorder
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      disabled={downloadingInvoice === order.id}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {downloadingInvoice === order.id ? 'Downloading...' : 'Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">2</button>
              <button className="px-3 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">3</button>
              <button className="px-3 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">4</button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
