import doubanSpider from '../index'
const spider = new doubanSpider()

spider.getMovieCollect().then((res) => {
  console.log('爬取结果===>>>>', res)
})
