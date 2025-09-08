
export interface IConfigs {
    key: string
    value: string | unknown
    description: string
}

export interface IApiResult<T = any> {
    data: T
    exception?: any
}

export interface ILoginRequest {
    emailOrPhone: string
    password: string
    rememberMe: boolean
}

export interface IUserRole {
    id: number
    name: string
    description?: string
}

export interface ILoginResponseData {
    userId: number
    firstName: string
    lastName: string
    email: string
    phone: string
    active: boolean
    tenantId: number
    lastLogin: string
    rememberMe: boolean
    roles: IUserRole[]
    token: string | null
    tokenExpiration: string | null
}

export interface ILoginResponse extends IApiResult<ILoginResponseData> {}

export interface ILogoutRequest {
  userId: number
  token: string
  refreshToken?: string
}

export interface ILogoutResponse extends IApiResult<string> {}

// Menu-related interfaces
export interface IMenuCategory {
    categoryId: number
    category: string
    active: boolean
    orderBy: number
    icon: string
    description: string
}

export interface IMenuItem {
    menuId: number
    menuName: string
    orderBy: number
    active: boolean
    image: string
    subMenu: boolean
    tenantId: number
    created: string
    modified: string
    category: IMenuCategory[]
}

export interface IMenuMasterData {
    menuMaster: IMenuItem[]
}

export interface IMenuMasterResponse extends IApiResult<IMenuMasterData> {}

// Product Search Interfaces
export interface IProductSearchRequest {
    page: number
    limit: number
    search: string
    category?: number
    minPrice: number
    maxPrice: number
    rating?: string
    inStock?: string
    bestSeller?: string
    hasOffer?: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
}

export interface IProductImage {
    imageId?: number
    productId?: number
    poster: string
    main: boolean
    active: boolean
    orderBy?: number
}

export interface IProduct {
    productId: number
    tenantId: number
    productName: string
    productDescription: string
    productCode: string
    fullDescription: string
    specification: string
    story: string
    packQuantity: number
    quantity: number
    total: number
    price: number
    category: number
    rating: number
    active: boolean
    trending: number
    userBuyCount: number
    return: number
    created: string
    modified: string
    inStock: boolean
    bestSeller: boolean
    deliveryDate: number
    offer: string
    orderBy: number
    userId: number
    overview: string
    longDescription: string
    images: IProductImage[]
}

export interface IPagination {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

export interface IProductSearchData {
    products: IProduct[]
    pagination: IPagination
}

export interface IProductSearchResponse extends IApiResult<IProductSearchData> {}

// Product CRUD Interfaces
export interface IAddProductRequest {
    productName: string
    productDescription: string
    productCode: string
    price: number
    category: number
    quantity: number
    total: number
    userId: number
}

export interface IUpdateProductRequest {
    productId: number
    productName: string
    productDescription: string
    productCode: string
    price: number
    category: number
    quantity: number
    total: number
    userId: number
}

export interface IProductCrudResponse extends IApiResult<string> {}

// User Authentication Interfaces
export interface IRegisterRequest {
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
}

export interface IUserRole {
    roleId: number
    roleName: string
    roleDescription: string
}

export interface IUserData {
    userId: number
    firstName: string
    lastName: string
    email: string
    phone: string
    active: boolean
    tenantId: number
    emailVerified: boolean
    phoneVerified: boolean
    createdAt: string
    roles: IUserRole[]
}

export interface IAuthTokenData {
    user: IUserData
    token: string
    refreshToken: string
    expiresIn: number
    tokenExpiration: string
}

export interface IRegisterResponse extends IApiResult<IAuthTokenData> {}

// User Profile Interfaces
export interface IUserStatistics {
    loginCount: number
    daysSinceLastActivity: number
    profileCompletion: number
}

export interface IUserProfile {
    userId: number
    firstName: string
    lastName: string
    fullName: string
    email: string
    phone: string
    active: boolean
    tenantId: number
    emailVerified: boolean
    phoneVerified: boolean
    createdAt: string
    updatedAt: string
    lastLogin: string
    lastLogout: string
    profilePicture: string
    dateOfBirth: string
    gender: string
    timezone: string
    language: string
    country: string
    city: string
    state: string
    postalCode: string
    bio: string
    website: string
    companyName: string
    jobTitle: string
    preferredContactMethod: string
    notificationSettings: string
    privacySettings: string
    roles: IUserRole[]
    addresses: any[]
    preferences: any[]
    statistics: IUserStatistics
}

export interface IProfileData {
    data: IUserProfile
}

export interface IGetProfileResponse extends IApiResult<IProfileData> {}

export interface IUpdateProfileRequest {
    userId: number
    name: string
    phone: string
    bio: string
    website: string
}

export interface IUpdateProfileResponse extends IApiResult<string> {}

export interface IResetPasswordRequest {
    resetToken: string
    newPassword: string
    confirmPassword: string
}

export interface IResetPasswordResponse extends IApiResult<string> {}