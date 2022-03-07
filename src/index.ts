import cheerio from 'cheerio'
import http from './utils/http'
import { doubanOptionsType, userOptionsType, retMovieType, retMovieDataType } from '../index'
const userPrivate: userOptionsType = {
  uid: 'tan-mu'
}
const doubanPrivate: doubanOptionsType = {
  urls: {
    movie_do: 'https://movie.douban.com/people/${uid}/do?start=0&sort=time&rating=all&filter=all&mode=grid',
    movie_wish: 'https://movie.douban.com/people/${uid}/wish?start=0&sort=time&rating=all&filter=all&mode=grid',
    movie_collect: 'https://movie.douban.com/people/${uid}/collect?start=0&sort=time&rating=all&filter=all&mode=grid'
  }
}
class doubanSpider {
  public userOptions: userOptionsType
  public doubanOptions: doubanOptionsType
  private http
  // public cheerio
  constructor(userOptions: userOptionsType = userPrivate, doubanOptions: doubanOptionsType = doubanPrivate) {
    this.userOptions = Object.assign(userPrivate, userOptions)
    this.doubanOptions = Object.assign(doubanPrivate, doubanOptions)
    this.http = new http()
    // this.cheerio = cheerio
  }
  async fetch(url: string): Promise<string> {
    const res = await this.http.get(url, {
      headers: {
        cookies: 'uid=456'
      }
    })
    return res
  }
  // 获取在看的电视
  async getMovieDo(page: number = 1) {
    const start = (page - 1) * 15
    const url = this.doubanOptions.urls.movie_do
      .replace('${uid}', this.userOptions.uid)
      .replace('start=0', `start=${start}`)
    const res = this.getMovieCommon(url, page)
    return res
  }
  // 获取想看的电影
  async getMovieWish(page: number = 1) {
    const start = (page - 1) * 15
    const url = this.doubanOptions.urls.movie_wish
      .replace('${uid}', this.userOptions.uid)
      .replace('start=0', `start=${start}`)
    const res = this.getMovieCommon(url, page)
    return res
  }
  // 获取看过的电影
  async getMovieCollect(page: number = 1) {
    const start = (page - 1) * 15
    const url = this.doubanOptions.urls.movie_collect
      .replace('${uid}', this.userOptions.uid)
      .replace('start=0', `start=${start}`)
    const res = this.getMovieCommon(url, page)
    return res
  }
  // 获取 在看/想看/已看 电视剧、电影数据
  // TODO: 增加评论字段
  async getMovieCommon(url: string, page: number): Promise<retMovieType> {
    const html = await this.fetch(url)
    const $ = cheerio.load(html)
    const view = $('.article .grid-view').children()
    const data: retMovieDataType[] = []
    view.each((index, element) => {
      const item = {} as retMovieDataType
      // 电影封面图
      item.pic = $('.pic a img', element).attr('src')
      // 电影名称
      item.title = {
        name: $('.info .title a', element).text().replace(/\s+/g, ' ').trim()
      }
      // 豆瓣链接
      item.href = $('.info .title a', element).attr('href')
      // 电影基本信息
      item.intro = $('.info .intro', element).text()
      // ‘我’对电影的评论
      item.comment = $('.info .comment', element).text()
      // 电影评分及’看过‘的时间
      const ratingReg = /rating(\d+)-t/
      const isStar = ratingReg.test($('.info .date', element).parent().html() as string)
      let star: any = 0
      if (isStar) star = ratingReg.exec($('.info .date', element).prev().attr('class') as string)
      if (star) star = parseInt(star[1])
      item.rating = {
        star,
        date: $('.info .date', element).text()
      }
      data.push(item)
    })
    const totalPage = $('.paginator > .next').prev().text()

    return {
      data,
      page: {
        currentPage: page,
        totalPage: totalPage ? parseInt(totalPage) : 1
      }
    }
  }
}

export default doubanSpider
