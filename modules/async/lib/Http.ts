import Axios from 'axios'

const apiUrl = (path: string) => {
    return `/api/${path}`
}

class Http {
    
    public static async get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
        return (await Axios.get(apiUrl(url), { params })).data
    }

    public static async post<T = void>(url: string, body?: any, params: Record<string, any> = {}): Promise<T> {
        return (await Axios.post(apiUrl(url), body, { params })).data
    }

    public static async put<T = void>(url: string, body?: any, params: Record<string, any> = {}): Promise<T> {
        return (await Axios.put(apiUrl(url), body, { params })).data
    }

    public static async delete<T = void>(url: string, params: Record<string, any> = {}): Promise<T> {
        return (await Axios.post(apiUrl(url), { params })).data
    }
}

export default Http