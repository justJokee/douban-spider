import cheerio from 'cheerio'
import http from './utils/http'
import { doubanOptionsType, userOptionsType, retMovieType, retMovieDataType } from '../index'
const userOptions: userOptionsType = {
  // uid: '173712770'
  uid: 'tan-mu'
}
const doubanOptions: doubanOptionsType = {
  urls: {
    movie_wish: 'https://wish',
    movie_collect: 'https://movie.douban.com/people/${uid}/collect?start=0&sort=time&rating=all&filter=all&mode=grid'
  }
}
class doubanSpider {
  userOptions: userOptionsType
  public doubanOptions: doubanOptionsType
  public http
  // public cheerio
  constructor(options: userOptionsType = userOptions) {
    this.userOptions = Object.assign(userOptions, options)
    this.doubanOptions = doubanOptions
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
  // 获取想看的电影
  async getMovieWish() {}
  // 获取看过的电影
  async getMovieCollect(page: number = 1): Promise<retMovieType> {
    const start = (page - 1) * 15
    const url = this.doubanOptions.urls.movie_collect
      .replace('${uid}', this.userOptions.uid)
      .replace('start=0', `start=${start}`)

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
      // 电影基本信息
      item.intro = $('.info .intro', element).text()
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
        totalPage: parseInt(totalPage)
      }
    }
  }
}

export default doubanSpider
