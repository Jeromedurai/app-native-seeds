import Axios, { AxiosRequestConfig } from 'axios'
import {
    EXPIRE_TIME,
    TIME_CONVERTION_UNIT,
    URL_CONSTANTS,
    browserCacheKeyConstants
} from '../util/constant'
import { getBrowserCache, setBrowserCache } from '../util/functions'

class AxiosClient {
    tenantApiConfig: AxiosRequestConfig = {}
    systemApiConfig: AxiosRequestConfig = {}
    baseAppUrl = localStorage.getItem('ApiBaseUrl')
        ? localStorage.getItem('ApiBaseUrl')
        : ''
    defaultTokenKey = browserCacheKeyConstants.defaultTokenKey
    defaultTokenExpiry = browserCacheKeyConstants.defaultTokenExpiry
    systemTokenExpiry = browserCacheKeyConstants.systemTokenExpiry
    systemTokenKey = browserCacheKeyConstants.systemTokenKey

    constructor() {
        this.setDefaults()
    }

    /**
     * To call tenant based get api's
     * @param url base + api url
     * @returns response in promise
     */
    async tenantGet<T = any>(url: string): Promise<any> {
        if (this.hasTenantTokenExpired()) {
            const response = await this.getWeb(
                `${this.baseAppUrl}${URL_CONSTANTS.UserTokenControllerUrl}`
            )
            this.setTenantToken(response.data)
            this.setDefaults()
            return Axios.get<T>(`${url}`, this.tenantApiConfig)
        }
        return Axios.get<T>(`${url}`, this.tenantApiConfig)
    }

    /**
     * To call tenant based get api's
     * @param url base + api url
     * @returns response in promise
     */
    async tenantPatch<T = any>(url: string, data?: any): Promise<any> {
        if (this.hasTenantTokenExpired()) {
            const response = await this.getWeb(
                `${this.baseAppUrl}${URL_CONSTANTS.UserTokenControllerUrl}`
            )
            this.setTenantToken(response.data)
            this.setDefaults()
            return Axios.patch<T>(`${url}`, data, this.tenantApiConfig)
        }
        return Axios.patch<T>(`${url}`, data, this.tenantApiConfig)
    }

    /**
     * To call tenant based Delete api's
     * @param url base + api url
     * @returns response in promise
     */
    async tenantDelete<T = any>(url: string): Promise<any> {
        let apiRes = null
        try {
            if (this.hasTenantTokenExpired()) {
                const response = await this.getWeb(
                    `${this.baseAppUrl}${URL_CONSTANTS.UserTokenControllerUrl}`
                )
                this.setTenantToken(response.data)
                this.setDefaults()
                return Axios.delete<T>(`${url}`, this.tenantApiConfig)
            }
        } catch (err: any) {
            apiRes = err.response
            if (apiRes.status === HTTPStatusCode.BadRequest) {
                throw apiRes.data
            }
            throw apiRes
        }
        return Axios.delete<T>(`${url}`, this.tenantApiConfig)
    }

    /**
     * To call tenant based post api's
     * @param url  base + api url
     * @param data payload for post
     * @returns response in promise
     */
    async tenantPost<T = any>(url: string, data?: any): Promise<any> {
        let apiRes = null
        try {
            if (this.hasTenantTokenExpired()) {
                const response = await this.getWeb(
                    `${this.baseAppUrl}${URL_CONSTANTS.UserTokenControllerUrl}`
                )
                this.setTenantToken(response.data)
                this.setDefaults()
                apiRes = await Axios.post<T>(`${url}`, data, this.tenantApiConfig)
            } else {
                apiRes = await Axios.post<T>(`${url}`, data, this.tenantApiConfig)
            }
        } catch (err: any) {
            apiRes = err.response
            if (apiRes.status === HTTPStatusCode.NotFound) {
                throw apiRes.data
            }
            throw apiRes
        }
        return apiRes
    }

    /**
     * To call tenant based post api's
     * @param url  base + api url
     * @param data payload for post
     * @returns response in promise
     */
    async systemPost<T = any>(url: string, data?: any): Promise<any> {
        let apiRes = null
        try {
            if (this.hasSystemTokenExpired()) {
                const response = await this.getWeb(
                    `${this.baseAppUrl}${URL_CONSTANTS.UserTokenControllerUrl}`
                )
                this.setSystemToken(response.data)
                this.setDefaults()
                apiRes = await Axios.post<T>(`${url}`, data, this.systemApiConfig)
            } else {
                apiRes = await Axios.post<T>(`${url}`, data, this.systemApiConfig)
            }
        } catch (err: any) {
            apiRes = err.response
            if (apiRes.status === HTTPStatusCode.NotFound) {
                throw apiRes.data
            }
            throw apiRes
        }
        return apiRes
    }
    async systemGet<T = any>(url: string) {
        if (this.hasTenantTokenExpired()) {
            const response = await this.getWeb(
                `${this.baseAppUrl}${URL_CONSTANTS.UserTokenControllerUrl}`
            )
            this.setTenantToken(response.data)
            this.setDefaults()
            return Axios.get<T>(`${url}`, this.systemApiConfig)
        }
        return Axios.get<T>(`${url}`, this.systemApiConfig)
    }

    // MVC call
    async getWeb<T = any>(url: string) {
        return Axios.get<T>(url)
    }
    async postWeb<T = any>(url: string, payload: any) {
        return Axios.post<T>(url, payload)
    }
    async patchWeb<T = any>(url: string, payload: any) {
        return Axios.patch<T>(url, payload)
    }
    // set the api configs - token and base url from cache
    private setDefaults() {
        const tenantToken = getBrowserCache('ApiToken') || ''
        this.baseAppUrl = getBrowserCache('AppBaseUrl') || ''
        const BASE_CONTAINER_URL = getBrowserCache('ContainerApiBaseUrl') || ''
        this.tenantApiConfig = {
            baseURL: BASE_CONTAINER_URL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tenantToken}`
            }
        }

        const systemToken = getBrowserCache('SystemApiToken') || ''

        this.systemApiConfig = {
            baseURL: BASE_CONTAINER_URL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${systemToken}`
            }
        }
    }

    /**
     * check whether the token expiry Epoch time is about to expire in 300 ms
     * @returns is Expired or not
     */
    private hasTenantTokenExpired(
        key = browserCacheKeyConstants.defaultTokenExpiry
    ): boolean {
        let isExpired = true
        const tenantTokenExpiry = Number(getBrowserCache(key))
        if (tenantTokenExpiry) {
            const currentEpochtime = Math.round(
                new Date().getTime() / TIME_CONVERTION_UNIT
            )
            const differenceofSeconds = tenantTokenExpiry - currentEpochtime
            isExpired = differenceofSeconds < EXPIRE_TIME ? true : false
        }
        return isExpired
    }

    /**
     * check whether the token expiry Epoch time is about to expire in 300 ms
     * @returns is Expired or not
     */
    private hasSystemTokenExpired(
        key = browserCacheKeyConstants.systemTokenExpiry
    ): boolean {
        let isExpired = true
        const systemTokenExpiry = Number(getBrowserCache(key))
        if (systemTokenExpiry) {
            const currentEpochtime = Math.round(
                new Date().getTime() / TIME_CONVERTION_UNIT
            )
            const differenceofSeconds = systemTokenExpiry - currentEpochtime
            isExpired = differenceofSeconds < EXPIRE_TIME ? true : false
        }
        return isExpired
    }

    /**
     * set it in local Storage
     * @param data Response data from MVC Controller
     */
    private setTenantToken(data: any) {
        // add to cache
        setBrowserCache(this.defaultTokenKey, data.tokenDetails.token)
        setBrowserCache(this.defaultTokenExpiry, data.tokenDetails.exp)
    }

    /**
     * set it in local Storage
     * @param data Response data from MVC Controller
     */
    private setSystemToken(data: any) {
        // add to cache
        setBrowserCache(this.systemTokenKey, data.tokenDetails.token)
        setBrowserCache(this.systemTokenExpiry, data.tokenDetails.exp)
    }
}

const RESTClient = new AxiosClient()

export default RESTClient

export const enum HTTPStatusCode {
    OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    Found = 302,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    RequestTimeout = 408,
    Locked = 423,
    FailedDependency = 424,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    UnavailableForLegalReasons = 451,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    InsufficientStorage = 507
}
