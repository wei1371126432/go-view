import axios, { AxiosResponse, AxiosRequestConfig, Axios, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { RequestHttpHeaderEnum, ResultEnum, ModuleTypeEnum } from '@/enums/httpEnum'
import { PageEnum, ErrorPageNameMap } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { axiosPre } from '@/settings/httpSetting'
import { SystemStoreEnum, SystemStoreUserInfoEnum } from '@/store/modules/systemStore/systemStore.d'
import { redirectErrorPage, getLocalStorage, setLocalStorage,clearLocalStorage, routerTurnByName, isPreview, getCookie } from '@/utils'
import { fetchAllowList } from './axios.config'
import includes from 'lodash/includes'

export interface MyResponseType<T> {
  code: ResultEnum
  data: T
  message: string
}

export interface MyRequestInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): Promise<MyResponseType<T>>
}

const axiosInstance = axios.create({
  baseURL: `${axiosPre}`,
  timeout: ResultEnum.TIMEOUT
}) as unknown as MyRequestInstance

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let fhToken = getLocalStorage('FH-Token')
    let urlFhToken = ''

    // 先从hash中获取token
    const hashPart = window.location.hash
    const queryIndex = hashPart.indexOf('?')
    if (queryIndex !== -1) {
      const queryString = hashPart.substring(queryIndex + 1)
      const hashParams = new URLSearchParams(queryString)
      const hashFhToken = hashParams.get('FH-Token')
      if (hashFhToken) {
        urlFhToken = decodeURIComponent(hashFhToken)
      }
    }

    // 如果hash没有，再从search中获取
    if (!urlFhToken && window.location.search) {
      const searchParams = new URLSearchParams(window.location.search)
      const searchFhToken = searchParams.get('FH-Token')
      if (searchFhToken) {
        urlFhToken = decodeURIComponent(searchFhToken)
      }
    }

    // 如果url上有token，且和本地不一样，则用url上的并覆盖本地
    if (urlFhToken) {
      if (fhToken !== urlFhToken) {
        fhToken = urlFhToken
        setLocalStorage('FH-Token', fhToken)
        console.log('从URL获取并覆盖本地FH-Token:', fhToken)
      }
    }

    if (fhToken) {
      config.headers['FH-Token'] = fhToken
    }
    if (includes(fetchAllowList, config.url)) return config
    // 获取 token
    const info = getLocalStorage(StorageEnum.GO_SYSTEM_STORE)
    // 重新登录
    if (!info) {
      routerTurnByName(PageEnum.BASE_LOGIN_NAME)
      return config
    }
    const userInfo = info[SystemStoreEnum.USER_INFO]
    config.headers[userInfo[SystemStoreUserInfoEnum.TOKEN_NAME] || 'token'] =  userInfo[SystemStoreUserInfoEnum.USER_TOKEN] || ''
    return config
  },
  (err: AxiosError) => {
    Promise.reject(err)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    // 预览页面错误不进行处理
    if (isPreview()) {
      return Promise.resolve(res.data)
    }
    const { code } = res.data as { code: number }

    if (code === undefined || code === null) return Promise.resolve(res.data)

    // 成功
    if (code === ResultEnum.SUCCESS) {
      return Promise.resolve(res.data)
    }

    // 登录过期
    if (code === ResultEnum.TOKEN_OVERDUE) {
      window['$message'].error(window['$t']('http.token_overdue_message'))
      routerTurnByName(PageEnum.BASE_LOGIN_NAME)
      return Promise.resolve(res.data)
    }

    // 固定错误码重定向
    if (ErrorPageNameMap.get(code)) {
      redirectErrorPage(code)
      return Promise.resolve(res.data)
    }

    // 提示错误
    window['$message'].error(window['$t']((res.data as any).msg))
    return Promise.resolve(res.data)
  },
  (err: AxiosError) => {
    const status = err.response?.status
    switch (status) {
      case 401:
        routerTurnByName(PageEnum.BASE_LOGIN_NAME)
        Promise.reject(err)
        break

      default:
        Promise.reject(err)
        break
    }
  }
)

export default axiosInstance
