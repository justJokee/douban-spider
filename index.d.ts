/// <reference types="node" />

// 豆瓣用户 'uid'
export interface userOptionsType {
  uid: string
}

export interface doubanOptionsType {
  urls: {
    // 在看的电视
    movie_do: string
    // 想看的电影
    movie_wish: string
    // 看过的电影
    movie_collect: string
  }
}

export interface retMovieDataType {
  pic: string | undefined
  href: string | undefined
  comment: string | undefined
  title: {
    name: string
  }
  intro: string
  rating: {
    star: number
    date: string
  }
}

export interface retMovieType<T = retMovieDataType> {
  data: Array<T>
  page: {
    currentPage: number
    totalPage: number
  }
}
interface methods {
  get: string
  post: string
}

export default class doubanSpiderType {
  constructor(userOptions?: userOptionsType, doubanOptions?: doubanOptionsType)
  getMovieDo(page: number = 1): Promise<retMovieType>
  getMovieWish(page: number = 1): Promise<retMovieType>
  getMovieCollect(page: number = 1): Promise<retMovieType>
  fetch(method: keyof methods): Promise<string>
  userOptions: userOptionsType
  doubanOptions: doubanOptionsType
}

// declare const doubanSpider: doubanSpiderType
