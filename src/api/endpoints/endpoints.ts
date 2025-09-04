import { IApiResult, ILoginRequest, ILoginResponse, ILogoutRequest, ILogoutResponse } from "../../modals/interface"
import RESTClient from "../rest_client/rest_client"
import { URL_CONSTANTS } from "../util/constant"
import { getBrowserCache } from "../util/functions"
// import * as Sentry from '@sentry/browser'

// interface IApiResult<T> {
//   data: T
//   exception?: any
// }

let tenantId = ''
let userRole = ''
let userId = ''
let displayName = ''
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
          userRole = parsedCache.role?.id || ''
          userId = parsedCache.user?.id || ''
          displayName = parsedCache.user?.displayName || ''
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