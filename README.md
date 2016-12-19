# audio-player

仅支持 mp3 格式，优先使用 HTML5 audio，若不支持，降级使用 flash。

```js
var player = new AudioPlayer({
    element: document.getElementById('.player'),
    swfUrl: 'http://xxx/AudioPlayer.swf',
    onLoadStart: function () {

    },
    onLoadProgress: function () {

    },
    onLoadComplete: function () {

    },
    onPlayStart: function () {

    },
    onPlayProgress: function () {

    },
    onPlayComplete: function () {

    }
});
// 播放音频
player.play(url);

// 停止播放
player.stop();

// 销毁
player.dispose();
```