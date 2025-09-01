
export interface IConfigs {
    key: string
    value: string | unknown
    description: string
}

export interface IApiResult {
    data: any
    exception?: any
}