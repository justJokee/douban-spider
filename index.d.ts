/// <reference types="node" />
import http from './src/utils/http'

export interface userOptionsType {
  uid: string
}

export interface doubanOptionsType {
  urls: {
    // 想看的电影
    movie_wish: string
    // 看过的电影
    movie_collect: string
  }
}

export interface retMovieDataType {
  pic: string | undefined
  href: string | undefined
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

export default class doubanSpiderType {
  constructor(options?: userOptionsType)
  getMovieWish(): Promise
  getMovieCollect(): Promise
  userOptions: userOptionsType
  doubanOptions: doubanOptionsType
  http: http
}

// declare const doubanSpider: doubanSpiderType
