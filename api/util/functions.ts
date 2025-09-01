/**
 * helper Function to get the localStorage value
 * @param key The key to get value in localStorage
 * @returns parsed storage value if there is no key/Value returns null
 */
export function getBrowserCache(key: string) {
    return window.localStorage.getItem(key)
}

/**
 * helper Function to stringify and set the value in localStorage
 * @param key The key to set in localStorage for this value
 * @param value The value to set in LocalStorage for this key
 */
export function setBrowserCache(key: string, value: any) {
    window.localStorage.setItem(key, value)
}