# douban-spider

## 简介

这是一个使用 NodeJs & Typescript & Cheerio 编写的豆瓣爬虫

## 功能

本工具开发的初衷是为我的个人博客 [Marco's Blog](https://github.com/justJokee/vue-ssr-blog) 收集我的观影历史及感兴趣的影视资料等，目前实现的功能有：

- 获取用户正在看的影视（目前仅电视剧支持标记”在看“）
- 获取用户看过的影视
- 获取用户想看的影视

## 下载

### github

```shell
git clone https://github.com/justJokee/douban-spider.git

cd douban-spider

npm i
```

### npm

```
npm i douban-spider-v --save-dev
```

## Usage

```javascript
// typescript
import doubanSpider from 'douban-spider-v'
// js
const doubanSpider = require('douban-spider-v')

const spider = new doubanSpider({
  uid: 'your id'
})
// 获取看过的影视
// assume use async syntax
const { data, page } = await spider.getMovieWish()

console.log('影视资源列表（第一页）：', data)

console.log('分页数据：', page)
```

## API

- 类 doubanSpider(userOptions[,doubanOptions])

  - `userOptions` \<Object\> 用户信息配置
    - `uid` 豆瓣用户“uid”
  - `doubanOptions` \<Object\> 可选，豆瓣页面配置
    - `urls` \<Object\> url 配置
      - `movie_do` \<String\> 在看的影视
      - `movie_wish` \<String\> 想看的影视
      - `movie_collect` \<String\> 看过的影视

- 方法

  - getMovieDo(page: number = 1): Promise\<retMovieType\> 获取在看的影视
  - getMovieWish(page: number = 1): Promise\<retMovieType\> 获取想看的影视
  - getMovieCollect(page: number = 1): Promise\<retMovieType\> 获取看过的影视

## Interface

```typescript
interface retMovieType<T = retMovieDataType> {
  data: Array<T>
  page: {
    currentPage: number
    totalPage: number
  }
}

interface retMovieDataType {
  // 封面图
  pic: string | undefined
  // 影视的豆瓣链接
  href: string | undefined
  // 影视标题信息
  title: {
    // 影视名称
    name: string
  }
  // 影视简介
  intro: string
  // '我'对此电影的评论
  comment: string | undefined
  rating: {
    // 你的评分
    star: number
    // 你标记📌时的时间
    date: string
  }
}
```

## Others

1. 当在实例化爬虫时，支持传入第二个参数 doubanOptions,如果豆瓣的 url 规则在本工具开发后未经变更，你通常不需要配置此参数，举个栗子：

默认的,想看的影视资源 url：
`doubanOptions.urls.movie_wish = 'https://movie.douban.com/people/${uid}/wish?start=0&sort=time&rating=all&filter=all&mode=grid'`

注意，上述 `${uid}`将在运行时替换为实例化时传入的参数

假如豆瓣只是简单替换了页面的访问 url（内部结构和分页模式保持不变），例如加了一层路径,那么在实例化爬虫时将对应的、新的 url 填入即可：

`doubanOptions.urls.movie_wish = https://movie.douban.com/people/${uid}/hi-look-this-fake-path/wish?start=0&sort=time&rating=all&filter=all&mode=grid`

2. 由于豆瓣的反爬虫机制，强烈建议在爬取所有数据时，每一页的间隔最好在 30s 左右，间隔太短 IP 极大可能被 ban,你可以在 [这里](https://github.com/justJokee/vue-ssr-blog/blob/master/server/utils/schedule.js) 查看一个使用的例子。
3. 如果喜欢这个小工具，不妨 star 鼓励一下~
4. 本工具仅用作学习交流，请勿恶意使用
