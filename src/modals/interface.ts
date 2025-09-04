
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