import doubanSpider from '../index'
const spider = new doubanSpider()

spider.getMovieCollect(5).then((res) => {
  console.log('爬取结果===>>>>', JSON.stringify(res, null, '\t'))
})
