
# weixinSurvey

> weixinSurvey


### Usage    

1. 配置 postcss,通过根目录的`.postssrc.json` ,详见 [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config#postcssrc)
2. 环境变量位于 `build/config.js`,请根据项目需求进行配置. 

``` 
# 安装依赖
npm install 

# 开发环境
npm run dev

# 生产环境
npm run build

### Note   


### 初始化完成


1. 关于图片的问题,公共的图片放到images文件夹中,个人模块的图片放到个人的文件夹中  
2. vue-touch官方目前没有正式支持vue2.0@next,最新文档见 [vue-touch](https://github.com/vuejs/vue-touch/tree/next)
3. 如果需要真机测试,可以在`run`命令添加`--host`: `npm run dev -- --host=yourIp --port=8080`