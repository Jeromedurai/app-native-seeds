import { ILoginRequest, ILoginResponse, ILogoutRequest, ILogoutResponse, IMenuMasterResponse, IProductSearchRequest, IProductSearchResponse, IAddProductRequest, IUpdateProductRequest, IProductCrudResponse, IRegisterRequest, IRegisterResponse, IGetProfileResponse, IUpdateProfileRequest, IUpdateProfileResponse, IResetPasswordRequest, IResetPasswordResponse } from "../../modals/interface"
import RESTClient from "../rest_client/rest_client"
import { URL_CONSTANTS } from "../util/constant"
import { getBrowserCache } from "../util/functions"
// import * as Sentry from '@sentry/browser'

// interface IApiResult<T> {
//   data: T
//   exception?: any
// }

let tenantId = ''
let BASE_CONTAINER_URL = 'https://localhost:5002/'

class EndPoints {

  constructor() {
    this.initializeFromCache()
  }

  private initializeFromCache(): void {
    BASE_CONTAINER_URL = getBrowserCache('ContainerApiBaseUrl') || 'https://localhost:5002/'
    try {
      const cache = localStorage.getItem('xcCache')
      if (cache) {
        const parsedCache = JSON.parse(cache)
        if (parsedCache) {
          tenantId = parsedCache.tenant?.id || ''
        }
      }
    } catch (error) {
      console.warn('Failed to parse cache:', error)
    }
  }

  /**
   * Authenticate user with email/phone and password
   * @param payload Login credentials
   * @returns Promise with login response
   */
  async login(payload: ILoginRequest): Promise<ILoginResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}${URL_CONSTANTS.userAuth}`,
        payload
      )
    )
    return response.data
  }

   /**
   * Logout user from the system
   * @param payload Logout request with userId and token
   * @returns Promise with logout response
   */
   async logout(payload: ILogoutRequest): Promise<ILogoutResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}${URL_CONSTANTS.userLogout}`,
        payload
      )
    )
    return response.data
  }

  /**
   * Get menu master data from API
   * @returns Promise with menu master response
   */
  async getMenuMaster(): Promise<IMenuMasterResponse> {
    const response = await execute(() =>
      RESTClient.getWeb(
        `${BASE_CONTAINER_URL}api/1.0/products/menu/master`
      )
    )
    return response.data
  }

  /**
   * Search products with filters and pagination
   * @param payload Search parameters
   * @returns Promise with product search response
   */
  async searchProducts(payload: IProductSearchRequest): Promise<IProductSearchResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}api/1.0/products/tenants/1/search-products`,
        payload
      )
    )
    return response.data
  }

  /**
   * Add a new product
   * @param payload Product data
   * @returns Promise with add product response
   */
  async addProduct(payload: IAddProductRequest): Promise<IProductCrudResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}api/1.0/products/tenants/1`,
        payload
      )
    )
    return response.data
  }

  /**
   * Update an existing product
   * @param payload Product update data
   * @returns Promise with update product response
   */
  async updateProduct(payload: IUpdateProductRequest): Promise<IProductCrudResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}api/1.0/products/tenants/1/update-product`,
        payload
      )
    )
    return response.data
  }

  /**
   * Delete a product
   * @param productId Product ID to delete
   * @returns Promise with delete product response
   */
  async deleteProduct(productId: number): Promise<IProductCrudResponse> {
    const response = await execute(() =>
      RESTClient.tenantDelete(
        `${BASE_CONTAINER_URL}api/1.0/products/tenants/1/${productId}`
      )
    )
    return response.data
  }

  /**
   * Register a new user
   * @param payload User registration data
   * @returns Promise with registration response
   */
  async registerUser(payload: IRegisterRequest): Promise<IRegisterResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}api/user/auth/register`,
        payload
      )
    )
    return response.data
  }

  /**
   * Get user profile
   * @param userId User ID
   * @param tenantId Tenant ID
   * @returns Promise with profile response
   */
  async getUserProfile(userId: number, tenantId: number): Promise<IGetProfileResponse> {
    const response = await execute(() =>
      RESTClient.getWeb(
        `${BASE_CONTAINER_URL}api/user/auth/profile?userId=${userId}&tenantId=${tenantId}`
      )
    )
    return response.data
  }

  /**
   * Update user profile
   * @param payload Profile update data
   * @returns Promise with update response
   */
  async updateUserProfile(payload: IUpdateProfileRequest): Promise<IUpdateProfileResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}api/user/auth/update-profile`,
        payload
      )
    )
    return response.data
  }

  /**
   * Reset user password
   * @param payload Password reset data
   * @returns Promise with reset response
   */
  async resetPassword(payload: IResetPasswordRequest): Promise<IResetPasswordResponse> {
    const response = await execute(() =>
      RESTClient.postWeb(
        `${BASE_CONTAINER_URL}api/user/auth/reset-password`,
        payload
      )
    )
    return response.data
  }

  async placeOrder(
    payload: any,
    isResync: any
  ): Promise<any> {
    const response = await execute(() =>
      RESTClient.tenantPost(
        `${BASE_CONTAINER_URL}${URL_CONSTANTS.payrollCommand}payrolls/tenants/${tenantId}/locations/resync-payroll?isPayrollConfig=false&isResync=${isResync}`,
        payload
      )
    )
    return response.data
  }
}

async function execute<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action()
  } catch (ex) {
    // Sentry.captureException(ex)
    throw ex
  }
}

const endpoints = new EndPoints()

export default endpoints