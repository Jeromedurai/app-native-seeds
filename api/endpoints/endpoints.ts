import { IApiResult } from "../../modals/interface"
import RESTClient from "../rest_client/rest_client"
import { URL_CONSTANTS } from "../util/constant"
import { getBrowserCache } from "../util/functions"
import * as Sentry from '@sentry/browser'

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

  // constructor() {
  //   BASE_CONTAINER_URL = getBrowserCache('ContainerApiBaseUrl') || ''
  //   const cache = JSON.parse(localStorage.getItem('xcCache') || '')
  //   if (cache !== null || cache !== '') {
  //     const newLocal = tenantId = cache.tenant.id
  //     userRole = cache.role.id
  //     userId = cache.user.id
  //     displayName = cache.user.displayName
  //   }
  // }


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
    Sentry.captureException(ex)
    throw ex
  }
}

const endpoints = new EndPoints()

export default endpoints