## HTML5-Music-Player
jQuery+HTML5音乐播放器，一直都想试着写一个音乐播放器，自己也比较喜欢听歌，第一次用HTML5 Audio API 感觉还挺方便的。后续功能待完善，如果大家有好的建议还请提出，大家共同学习交流~ demo在这里（接口地址跨域了,随便看个大概吧！:joy:）[DEMO](http://htmlpreview.github.io/?https://github.com/yuuk/HTML5-Music-Player/blob/master/index.html)
## 界面预览
![界面截图](https://raw.githubusercontent.com/yuuk/HTML5-Music-Player/master/dist/images/screenshot.png)

## 主要功能
暂停/播放歌曲、上一曲、下一曲、歌曲轮播、歌曲时间进度条、缓冲进度条、歌曲倒计时、播放列表。

## 调用方法
```javascript
  new musicPlayer({
    url: 'js/music.json'
  });
```
## 运行方法
````
1、git clone https://github.com/yuuk/HTML5-Music-Player.git
2、cd HTML5-Music-Player
3、npm install
4、gulp
````
## 2017-03-18更新
- 加入gulp构建工具
- 新增歌曲播放列表
- 优化之前的小问题
