import { Product, ProductMaster, MenuMaster, LegacyProduct, ProductReview, ReviewStats } from '../types';

// Mock reviews data
export const mockReviews: ProductReview[] = [
  {
    reviewId: 1,
    productId: 1001,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john@example.com',
    rating: 5,
    title: 'Excellent product!',
    comment: 'This apple is incredibly fresh and delicious. Perfect for my morning smoothies. Highly recommend!',
    helpful: 15,
    verified: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    reviewId: 2,
    productId: 1001,
    userId: 2,
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    rating: 4,
    title: 'Good quality',
    comment: 'Fresh and crisp apples. Great value for money. Will order again.',
    helpful: 8,
    verified: true,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    reviewId: 3,
    productId: 1001,
    userId: 3,
    userName: 'Mike Wilson',
    userEmail: 'mike@example.com',
    rating: 5,
    title: 'Perfect for baking',
    comment: 'These apples are perfect for my apple pie recipes. Sweet and firm texture.',
    helpful: 12,
    verified: true,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  },
  {
    reviewId: 4,
    productId: 1002,
    userId: 4,
    userName: 'Emma Davis',
    userEmail: 'emma@example.com',
    rating: 4,
    title: 'Fresh oranges',
    comment: 'Juicy and sweet oranges. Perfect for breakfast juice.',
    helpful: 6,
    verified: true,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    reviewId: 5,
    productId: 1002,
    userId: 5,
    userName: 'David Brown',
    userEmail: 'david@example.com',
    rating: 3,
    title: 'Average quality',
    comment: 'The oranges were okay, but not as sweet as I expected. Decent for the price.',
    helpful: 3,
    verified: false,
    createdAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-08T11:30:00Z'
  }
];

// Function to get reviews by product ID
export const getReviewsByProductId = (productId: number): ProductReview[] => {
  return mockReviews.filter(review => review.productId === productId);
};

// Function to get review stats by product ID
export const getReviewStatsByProductId = (productId: number): ReviewStats => {
  const reviews = getReviewsByProductId(productId);
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });
  
  // Fill missing ratings with 0
  for (let i = 1; i <= 5; i++) {
    if (!ratingDistribution[i]) {
      ratingDistribution[i] = 0;
    }
  }
  
  return {
    totalReviews,
    averageRating,
    ratingDistribution
  };
};

// Helper function to create fallback SVG images
const createFallbackImage = (productName: string, color: string = '#22c55e') => {
  // Create fast-loading inline SVG - no external requests, loads instantly
  // const cleanName = productName.replace(/[^a-zA-Z0-9]/g, ''); // Reserved for future use
  const svg = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='400' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='200' cy='150' r='50' fill='white' opacity='0.3'/%3E%3Ctext x='200' y='190' text-anchor='middle' fill='white' font-size='40'%3E🌱%3C/text%3E%3Ctext x='200' y='250' text-anchor='middle' fill='white' font-size='18' font-family='Arial'%3E${encodeURIComponent(productName)}%3C/text%3E%3C/svg%3E`;
  return svg;
};

// New product data based on the API structure provided
export const mockProducts: Product[] = [
  {
    "productId": 1001,
    "tenantId": 10,
    "productName": "Apple",
    "productDescription": "Apple",
    "productCode": "SD101",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 100,
    "total": 100,
    "price": 4999,
    "categrory": 1,
    "rating": 2,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 15,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": createFallbackImage("Apple", "#dc2626"),
        "main": true,
        "active": true,
        "orderBy": 1
      },
      {
        "imageId": 2,
        "poster": createFallbackImage("Red Apple", "#b91c1c"),
        "main": false,
        "active": true,
        "orderBy": 2
      },
      {
        "imageId": 3,
        "poster": createFallbackImage("Apple Slice", "#ef4444"),
        "main": false,
        "active": true,
        "orderBy": 3
      }
    ]
  },
  {
    "productId": 1002,
    "tenantId": 10,
    "productName": "Orange",
    "productDescription": "Orange",
    "productCode": "OR1O1",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 100,
    "total": 100,
    "price": 3999,
    "categrory": 1,
    "rating": 3,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 1,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 1,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": createFallbackImage("Orange", "#ea580c"),
        "main": true,
        "active": true,
        "orderBy": 1
      },
      {
        "imageId": 2,
        "poster": createFallbackImage("Orange Side View", "#f97316"),
        "main": false,
        "active": true,
        "orderBy": 2
      },
      {
        "imageId": 3,
        "poster": createFallbackImage("Orange Close-up", "#fb923c"),
        "main": false,
        "active": true,
        "orderBy": 3
      },
      {
        "imageId": 4,
        "poster": createFallbackImage("Orange Cross Section", "#fdba74"),
        "main": false,
        "active": true,
        "orderBy": 4
      }
    ]
  },
  {
    "productId": 1003,
    "tenantId": 10,
    "productName": "Graps",
    "productDescription": "Graps",
    "productCode": "DR101",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 200,
    "total": 200,
    "price": 200,
    "categrory": 1,
    "rating": 1,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 2,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": createFallbackImage("Grapes", "#7c3aed"),
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1004,
    "tenantId": 10,
    "productName": "Givi",
    "productDescription": "Givi",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 400,
    "total": 400,
    "price": 400,
    "categrory": 1,
    "rating": 5,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 1,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "10%",
    "orderBy": 3,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": createFallbackImage("Givi", "#10b981"),
        "main": true,
        "active": true,
        "orderBy": 1
      },
      {
        "imageId": 2,
        "poster": createFallbackImage("Givi Fresh", "#059669"),
        "main": false,
        "active": true,
        "orderBy": 2
      },
      {
        "imageId": 3,
        "poster": createFallbackImage("Givi Organic", "#047857"),
        "main": false,
        "active": true,
        "orderBy": 3
      },
      {
        "imageId": 4,
        "poster": createFallbackImage("Givi Premium", "#065f46"),
        "main": false,
        "active": true,
        "orderBy": 4
      }
    ]
  },
  {
    "productId": 1005,
    "tenantId": 10,
    "productName": "Gova",
    "productDescription": "Gova",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 50,
    "total": 50,
    "price": 50,
    "categrory": 1,
    "rating": 3,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 1,
    "created": "date",
    "modified": "date",
    "in_stock": false,
    "best_seller": true,
    "deleveryDate": 5,
    "offer": "70%",
    "orderBy": 4,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1595617795501-9661aafda72a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1006,
    "tenantId": 10,
    "productName": "Mango",
    "productDescription": "Mango",
    "productCode": "PRT100",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 60,
    "total": 60,
    "price": 60,
    "categrory": 1,
    "rating": 4,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": false,
    "best_seller": true,
    "deleveryDate": 5,
    "offer": "80%",
    "orderBy": 5,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1007,
    "tenantId": 10,
    "productName": "JackFruit",
    "productDescription": "JackFruit",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 70,
    "total": 70,
    "price": 70,
    "categrory": 1,
    "rating": 1,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "20%",
    "orderBy": 6,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1008,
    "tenantId": 10,
    "productName": "Banana",
    "productDescription": "Banana",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 80,
    "total": 80,
    "price": 80,
    "categrory": 1,
    "rating": 4,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "40%",
    "orderBy": 7,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1009,
    "tenantId": 10,
    "productName": "Cherry",
    "productDescription": "Cherry",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 90,
    "total": 90,
    "price": 90,
    "categrory": 1,
    "rating": 5,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 1,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "20%",
    "orderBy": 8,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1613490900233-141c5560d75d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1010,
    "tenantId": 10,
    "productName": "Water Apple",
    "productDescription": "Water Apple",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 10,
    "total": 10,
    "price": 20,
    "categrory": 1,
    "rating": 1,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 9,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1011,
    "tenantId": 10,
    "productName": "Pappaya",
    "productDescription": "Pappaya",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 110,
    "total": 110,
    "price": 210,
    "categrory": 1,
    "rating": 3,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 10,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1012,
    "tenantId": 10,
    "productName": "Sapotta",
    "productDescription": "Sapotta",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 120,
    "total": 120,
    "price": 220,
    "categrory": 1,
    "rating": 4,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 11,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1013,
    "tenantId": 10,
    "productName": "Pomagrante",
    "productDescription": "Pomagrante",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 130,
    "total": 130,
    "price": 230,
    "categrory": 1,
    "rating": 1,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 12,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1014,
    "tenantId": 10,
    "productName": "Apple",
    "productDescription": "Ooty Apple",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 140,
    "total": 140,
    "price": 140,
    "categrory": 1,
    "rating": 5,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 2,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 13,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  },
  {
    "productId": 1015,
    "tenantId": 10,
    "productName": "Apple",
    "productDescription": "Ooty Apple",
    "productCode": "app001",
    "fullDescription": "",
    "specification": "",
    "story": "",
    "packQuantity": 10,
    "quantity": 100,
    "total": 100,
    "price": 200,
    "categrory": 1,
    "rating": 1,
    "active": true,
    "trending": 1,
    "userBuyCount": 50,
    "return": 1,
    "created": "date",
    "modified": "date",
    "in_stock": true,
    "best_seller": false,
    "deleveryDate": 5,
    "offer": "50%",
    "orderBy": 14,
    "userId": 1,
    "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
    "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
    "images": [
      {
        "imageId": 1,
        "poster": "https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "main": true,
        "active": true,
        "orderBy": 1
      }
    ]
  }
];

// Keep legacy products for backwards compatibility
export const legacyMockProducts: LegacyProduct[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and smartphone notifications.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    rating: 4.7,
    reviews: 95
  },
  {
    id: '3',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans, single-origin, fair trade certified with rich flavor profile.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    category: 'Food & Beverages',
    inStock: true,
    rating: 4.3,
    reviews: 67
  },
  {
    id: '4',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Non-slip yoga mat made from sustainable materials, perfect for all types of yoga practice.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    category: 'Sports & Fitness',
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '5',
    name: 'Portable Phone Charger',
    description: 'Fast-charging portable power bank with 20,000mAh capacity and multiple USB ports.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1609592177370-1b8a1e8c4d15?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    rating: 4.4,
    reviews: 156
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    category: 'Home & Kitchen',
    inStock: true,
    rating: 4.8,
    reviews: 203
  },
  {
    id: '7',
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: false,
    rating: 4.2,
    reviews: 74
  },
  {
    id: '8',
    name: 'Premium Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection and multiple card slots.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    category: 'Fashion & Accessories',
    inStock: true,
    rating: 4.9,
    reviews: 45
  }
];

// Mock menu data based on the API structure provided
export const mockMenuData: MenuMaster = {
  menuMaster: [
    {
      menuId: 1,
      menuName: "Home",
      orderBy: 1,
      active: true,
      image: "",
      subMenu: false,
      category: []
    },
    {
      menuId: 2,
      menuName: "Seed",
      orderBy: 2,
      active: true,
      image: "",
      subMenu: true,
      category: [
        {
          categoryId: 1,
          category: "All Seed",
          active: true
        },
        {
          categoryId: 2,
          category: "Vegetable",
          active: true
        },
        {
          categoryId: 3,
          category: "Herbal",
          active: true
        },
        {
          categoryId: 4,
          category: "Fruits",
          active: true
        },
        {
          categoryId: 5,
          category: "Greens",
          active: true
        }
      ]
    },
    {
      menuId: 3,
      menuName: "Plants",
      orderBy: 3,
      active: true,
      image: "",
      subMenu: true,
      category: [
        {
          categoryId: 1,
          category: "All Plants",
          active: true
        },
        {
          categoryId: 2,
          category: "Indoor",
          active: true
        },
        {
          categoryId: 3,
          category: "Outdoor",
          active: true
        },
        {
          categoryId: 4,
          category: "New Arrivals",
          active: true
        },
        {
          categoryId: 5,
          category: "Air Purify",
          active: true
        }
      ] 
    },
    {
      menuId: 4,
      menuName: "Contact Us",
      orderBy: 4,
      active: true,
      image: "",
      subMenu: false,
      category: []
    },
    {
      menuId: 5,
      menuName: "About Us",
      orderBy: 5,
      active: true,
      image: "",
      subMenu: false,
      category: []
    }
  ]
};

export const mockCategories = [
  'Electronics',
  'Food & Beverages',
  'Sports & Fitness',
  'Home & Kitchen',
  'Fashion & Accessories'
];

// Function to get products (simulating API call)
export const getProducts = (page: number = 1, limit: number = 10): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeProducts = mockProducts.filter(p => p.active);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = activeProducts.slice(startIndex, endIndex);
      resolve(paginatedProducts);
    }, 500); // Simulate network delay
  });
};

// Function to get products in ProductMaster format
export const getProductMaster = (): Promise<ProductMaster> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        productMaster: mockProducts.filter(p => p.active)
      });
    }, 500); // Simulate network delay
  });
};

// Function to get menu items (simulating API call)
export const getMenuItems = (): Promise<MenuMaster> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMenuData);
    }, 300); // Simulate network delay
  });
};

// Function to get product by ID
export const getProductById = (id: number): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.productId === id);
      resolve(product || null);
    }, 300);
  });
};

// Function to get products by category with pagination
export const getProductsByCategory = (categoryId: number, page: number = 1, limit: number = 10): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockProducts.filter(p => p.categrory === categoryId && p.active);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filtered.slice(startIndex, endIndex);
      resolve(paginatedProducts);
    }, 400);
  });
};

// Utility function to generate route path from menu and category
export const generateRoutePath = (menuName: string, categoryName?: string): string => {
  // Handle special cases
  if (menuName.toLowerCase() === 'home') {
    return '/';
  }
  
  if (menuName.toLowerCase() === 'contact us') {
    return '/contact';
  }
  
  const baseRoute = menuName.toLowerCase().replace(/\s+/g, '-');
  
  if (categoryName) {
    const categoryRoute = categoryName.toLowerCase().replace(/\s+/g, '-');
    return `/${baseRoute}/${categoryRoute}`;
  }
  
  return `/${baseRoute}`;
}; 

// Interface for filter options
interface ProductFilters {
  search?: string;
  priceRange?: { min: number; max: number };
  categories?: number[];
  ratings?: number[];
  inStock?: boolean;
  bestSeller?: boolean;
  hasOffer?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Function to get products with search and filter on-demand
export const getProductsOnDemand = async (
  page: number = 1,
  limit: number = 10,
  filters: ProductFilters = {}
): Promise<{
  products: Product[];
  total: number;
  hasNext: boolean;
  page: number;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredProducts = [...mockProducts];

  // Apply search filter
  if (filters.search?.trim()) {
    const lowerQuery = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.productName.toLowerCase().includes(lowerQuery) ||
      product.productDescription.toLowerCase().includes(lowerQuery) ||
      product.productCode.toLowerCase().includes(lowerQuery) ||
      product.overview.toLowerCase().includes(lowerQuery)
    );
  }

  // Apply price range filter
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.priceRange!.min && product.price <= filters.priceRange!.max
    );
  }

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filters.categories!.includes(product.categrory)
    );
  }

  // Apply rating filter
  if (filters.ratings && filters.ratings.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filters.ratings!.some(rating => product.rating >= rating)
    );
  }

  // Apply stock filter
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(product => product.in_stock);
  }

  // Apply best seller filter
  if (filters.bestSeller) {
    filteredProducts = filteredProducts.filter(product => product.best_seller);
  }

  // Apply offer filter
  if (filters.hasOffer) {
    filteredProducts = filteredProducts.filter(product => product.offer);
  }

  // Apply sorting
  if (filters.sortBy && filters.sortBy !== 'default') {
    filteredProducts.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'productName':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'userBuyCount':
          aValue = a.userBuyCount;
          bValue = b.userBuyCount;
          break;
        case 'created':
          aValue = new Date(a.created).getTime();
          bValue = new Date(b.created).getTime();
          break;
        case 'best_seller':
          aValue = a.best_seller ? 1 : 0;
          bValue = b.best_seller ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  const total = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    total,
    hasNext: endIndex < total,
    page
  };
};

// Function to search products on-demand
export const searchProductsOnDemand = async (
  query: string,
  limit: number = 8
): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return mockProducts
    .filter(product =>
      product.productName.toLowerCase().includes(lowerQuery) ||
      product.productDescription.toLowerCase().includes(lowerQuery) ||
      product.productCode.toLowerCase().includes(lowerQuery) ||
      product.overview.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
};

// Function to get product by ID on-demand (always fresh)
export const getProductByIdOnDemand = async (id: number): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const product = mockProducts.find(p => p.productId === id);
  return product ? { ...product } : null; // Return a copy to ensure fresh data
};

// Function to get products by category on-demand
export const getProductsByCategoryOnDemand = async (
  categoryId: number,
  page: number = 1,
  limit: number = 10,
  filters: Omit<ProductFilters, 'categories'> = {}
): Promise<{
  products: Product[];
  total: number;
  hasNext: boolean;
  page: number;
}> => {
  const filtersWithCategory: ProductFilters = {
    ...filters,
    categories: [categoryId]
  };

  return getProductsOnDemand(page, limit, filtersWithCategory);
};

// Function to get related products on-demand
export const getRelatedProductsOnDemand = async (
  currentProductId: number,
  categoryId?: number,
  limit: number = 12
): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  let filtered = mockProducts.filter(product => 
    product.productId !== currentProductId && 
    product.active && 
    product.in_stock
  );
  
  // If categoryId is provided, prefer products from the same category
  if (categoryId) {
    const sameCategory = filtered.filter(product => product.categrory === categoryId);
    const otherCategory = filtered.filter(product => product.categrory !== categoryId);
    filtered = [...sameCategory, ...otherCategory];
  }
  
  return filtered.slice(0, limit);
}; 

// Update shipping threshold in relevant components
export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_COST = 200;

// Update mock variants with INR prices
export const mockVariants = [
  {
    id: '1',
    type: 'package',
    value: '100g',
    price: 4999,
    stock: 150
  },
  {
    id: '2',
    type: 'package',
    value: '250g',
    price: 9999,
    stock: 80
  },
  {
    id: '3',
    type: 'size',
    value: 'Small (6-12 inches)',
    price: 8999,
    stock: 75
  },
  {
    id: '4',
    type: 'size',
    value: 'Medium (12-18 inches)',
    price: 14999,
    stock: 45
  },
  {
    id: '5',
    type: 'variety',
    value: 'Basic (5 herbs)',
    price: 19999,
    stock: 5
  },
  {
    id: '6',
    type: 'variety',
    value: 'Premium (10 herbs)',
    price: 29999,
    stock: 12
  }
]; 