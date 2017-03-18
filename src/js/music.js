/*
 * @Author: yuuk
 * @Date:   2016-12-19 15:04:56
 * @Email: yuuk520@gmail.com
 */

(function(win) {
    var AUDIO = new Audio();
    //获取剩余时间
    function formatTime(currentTime, totalTime) {
        if (isNaN(totalTime)) {
            totalTime = 0;
        }
        currentTime = Math.floor(currentTime);
        totalTime = Math.floor(totalTime);
        var leftTime = totalTime - currentTime,
            min,
            sec,
            time;
        min = parseInt(leftTime / 60);
        sec = (leftTime % 60) >= 10 ? (leftTime % 60) : '0' + (leftTime % 60);
        time = '-' + min + ':' + sec;
        return time;
    }
    //获取进度
    function getProgress(currentTime, totalTime) {
        currentTime = Math.floor(currentTime);
        totalTime = Math.floor(totalTime);
        return (currentTime / totalTime * 100).toFixed(2);
    }
    //播放器
    function musicPlayer(opts) {
        opts = opts || {};
        this.url = opts.url || '';
        this.playIndex = opts.playIndex || 1;
        this.playFlag = false;
        this.list = [];
        this.elements = {
            list: '.js-playlist',
            cover: '.js-cover',
            play: '.js-play',
            prev: '.js-prev',
            next: '.js-next',
            name: '.js-name',
            author: '.js-author',
            time: '.js-time',
            progress: '.js-progress'
        };
        this.init();
    }
    musicPlayer.prototype = {
        init: function() {
            var _this = this;
            //获取播放列表
            this.getPlayList(function() {
                _this.swich(); //切到第一首
                _this.play(); //开始播放
                _this.bindEvent();
            });

        },
        // 请求播放数据
        getPlayList: function(callback) {
            var _this = this;
            callback = callback || $.noop;
            $.ajax({
                url: this.url,
                type: 'GET',
                cache: false,
                dataType: 'json'
            }).done(function(data) {
                _this.list = data;
                _this.renderPlayList(data);
                callback(data);
            }).fail(function(err) {
                console.log(err);
                alert('网络错误！');
            });
        },
        // 获取播放列表数据
        renderPlayList: function(data) {
            var _this = this,
                $list = $(this.elements.list),
                tpl = [];
            data.forEach(function(item, index) {
                tpl.push('<li><span>' + item.name + ' - ' + item.author + '</span><time>' + item.duration + '</time></li>');
            });
            $list.html(tpl.join(''));
        },
        //设置播放信息
        setPlayInfo: function(index) {
            index = index - 1;
            var _this = this,
                music = this.list[index];
            //保存默认封面图片
            this.defaultCover = $(this.elements.cover).attr('src');
            //设置音乐路径
            AUDIO.src = music.url;
            //设置信息
            $(this.elements.name).text(music.name);
            $(this.elements.author).text(music.author);
            // 更新列表状态
            $(this.elements.list).find('li').removeClass('play').eq(index).addClass('play');
            // 封面图片加载(防止封面图片加载慢导致显示上一曲的封面图)
            var cover = new Image();
            cover.onload = function() {
            	$(_this.elements.cover).attr('src', music.cover);
            };
            cover.src = music.cover;
            //监听播放信息
            this.watchPlayInfo();
            return this;
        },
        //监听播放信息
        watchPlayInfo: function() {
            var _this = this;
            //ontimeupdate事件
            AUDIO.ontimeupdate = function() {
                //显示时间
                var leftTime = formatTime(AUDIO.currentTime, AUDIO.duration);
                $(_this.elements.time).text(leftTime);

                //显示进度条
                var progress = getProgress(AUDIO.currentTime, AUDIO.duration);
                $(_this.elements.progress).find('span').css('width', progress + '%');

                //判断音乐否结束(结束就播放下一曲,循环播放)
                if (AUDIO.ended) {
                    _this.resetPlayInfo();
                    $(_this.elements.next).trigger('click');
                }
            };
            //缓冲进度条
            AUDIO.onprogress = function() {
                var range = 0;
                var buffer = this.buffered;
                var time = this.currentTime;
                if (buffer.length > 0) {
                    while (!(buffer.start(range) <= time && time <= buffer.end(range))) {
                        range += 1;
                    }
                    var loadStartPercentage = buffer.start(range) / this.duration;
                    var loadEndPercentage = buffer.end(range) / this.duration;
                    var loadPercentage = (loadEndPercentage - loadStartPercentage) * 100;
                    $(_this.elements.progress).find('i').css('width', loadPercentage + '%');
                }
            };
        },
        //重置播放信息
        resetPlayInfo: function() {
            this.pause();
            $(this.elements.cover).attr('src', this.defaultCover);
            $(this.elements.name).text('Music Player By Yuuk');
            $(this.elements.author).text('Yuuk');
            $(this.elements.progress).html('<i></i><span></span>');
            $(this.elements.time).text('0:00');
            return this;
        },
        //切歌
        swich: function(index) {
            index = index || this.playIndex;
            this.setPlayInfo(index);
            this.play();
            return this;
        },
        //播放音乐
        play: function() {
            AUDIO.play();
            $(this.elements.play).addClass('pause').removeClass('play');
            $(this.elements.cover).addClass('play');
            return this;
        },
        //暂停音乐
        pause: function() {
            AUDIO.pause();
            $(this.elements.play).addClass('play').removeClass('pause');
            $(this.elements.cover).removeClass('play');
            return this;
        },
        //事件绑定
        bindEvent: function() {
            var _this = this,
            	timer = 1000;
            //暂停/播放
            $(this.elements.play).on('click', function() {
                if (AUDIO.paused) {
                    _this.play();
                } else {
                    _this.pause();
                }
            });

            //上一曲
            $(this.elements.prev).on('click', function() {
                if (_this.playIndex > 1) {
                    _this.playIndex -= 1;
                } else {
                    _this.playIndex = _this.list.length;
                }
                _this.resetPlayInfo().swich();
            });

            //下一曲
            $(this.elements.next).on('click', function() {
                if (_this.playIndex < _this.list.length) {
                    _this.playIndex += 1;
                } else {
                    _this.playIndex = 1;
                }
                _this.resetPlayInfo().swich();
            });

            //列表歌曲切换
            $(this.elements.list).on('click', 'li', function() {
                var $this = $(this),
                    index = $this.index();
                if (!$this.hasClass('play')) {
                    _this.playIndex = index + 1;
                    _this.resetPlayInfo().swich();
                }
            });

            //进度条控制
            $(this.elements.progress).on('click', function(e) {
                var $this = $(this),
                    scale = (e.pageX - $this.offset().left) / $this.width(),
                    duration = AUDIO.duration;
                AUDIO.currentTime = duration * scale;
            });
        }
    };
    win.musicPlayer = musicPlayer;
})(window);
