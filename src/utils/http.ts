import https from 'https'

class http<T extends https.RequestOptions> {
  constructor() {}
  async get(url: string, options: T = {} as T): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        https.get(url, options, (res: any) => {
          const { statusCode } = res
          // 请求失败
          if (statusCode !== 200) {
            reject(`请求失败：${statusCode}`)
          } else {
            let raw: string = ''
            res.on('data', (chunk: string) => (raw += chunk))
            res.on('end', () => resolve(raw))
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default http
