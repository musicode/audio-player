package com.musicode.audio {

    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.events.IOErrorEvent;
    import flash.events.ProgressEvent;
    import flash.display.Sprite;
    import flash.media.Sound;
    import flash.media.SoundChannel;
    import flash.net.URLRequest;
    import flash.system.Security;
    import flash.utils.setTimeout;

    public class Player extends Sprite {

        private var externalCall: ExternalCall;

        // url -> sound 的映射表
        private var url2Sound: Object = { };

        // sound 是否已经加载完成
        private var urlLoaded: Object = { };

        // 当前正在加载的 URL
        private var loadingUrl: String;

        // 当前音频的播放进度
        private var position: Number;

        // 当前音频的实例
        private var sound: Sound;

        // 当前音频的声道
        private var soundChannel: SoundChannel;

        public function Player() {

            initEnv();
            initExternal();

            externalCall.swfReady();

        }

        private function initEnv(): void {
            Security.allowDomain('*');
            Security.allowInsecureDomain('*');
        }

        private function initExternal(): void {

            var params: Object = stage.loaderInfo.parameters;

            externalCall = new ExternalCall(params.movieName);
            externalCall.addCallback('doAction', doAction);

        }

        // IE 最好只暴露一个方法，不然容易报错
        public function doAction(name: String, url: String = ''): void {
            switch(name) {
                case 'load':
                    load.call(this, url);
                    break;
                case 'play':
                    play.call(this, url);
                    break;
                case 'pause':
                    pause.call(this);
                    break;
                case 'stop':
                    stop.call(this);
                    break;
            }
        }

        public function load(url: String): Sound {

            if (url2Sound[url]) {
                return url2Sound[url];
            }

            var sound: Sound = new Sound();

            sound.addEventListener(Event.OPEN, loadStartHandler);
            sound.addEventListener(ProgressEvent.PROGRESS, loadProgressHandler);
            sound.addEventListener(Event.COMPLETE, loadCompleteHandler);
            sound.addEventListener(IOErrorEvent.IO_ERROR, loadErrorHandler);

            sound.load(
                new URLRequest(url)
            );

            url2Sound[url] = sound;

            loadingUrl = url;

            return sound;

        }

        public function play(url: String): void {

            stop();

            sound = load(url);

            var playHandler = function () {
                if (urlLoaded[url]) {
                    soundChannel = sound.play();
                    if (soundChannel) {
                        soundChannel.addEventListener(Event.SOUND_COMPLETE, playCompleteHandler);
                        stage.addEventListener(Event.ENTER_FRAME, playProgressHandler);
                    }
                }
                else {
                    setTimeout(
                        playHandler,
                        100
                    );
                }
            };

            playHandler();

        }

        public function pause(): void {
            if (soundChannel) {

                position = soundChannel.position;
                soundChannel.stop();
                soundChannel = null;

                if (stage.hasEventListener(Event.ENTER_FRAME)) {
                    stage.removeEventListener(Event.ENTER_FRAME, playProgressHandler);
                }

            }
        }

        public function stop(): void {
            pause();
            position = 0;
        }

        private function getSoundInfo(sound: Sound): Object {
            return {
                url: sound.url,
                duration: Math.floor(sound.length)
            };
        }

        private function loadStartHandler(e: Event): void {

            var sound: Sound = e.target as Sound;

            sound.removeEventListener(Event.OPEN, loadStartHandler);

            externalCall.loadStart(
                getSoundInfo(sound)
            );

        }

        private function loadProgressHandler(e: ProgressEvent): void {

            var sound: Sound = e.target as Sound;

            var data: Object = getSoundInfo(sound);
            data.loaded = e.bytesLoaded;
            data.total = e.bytesTotal;

            externalCall.loadProgress(data);

        }

        private function loadCompleteHandler(e: Event): void {

            var sound: Sound = e.target as Sound;

            sound.removeEventListener(ProgressEvent.PROGRESS, loadProgressHandler);
            sound.removeEventListener(Event.COMPLETE, loadCompleteHandler);
            sound.removeEventListener(IOErrorEvent.IO_ERROR, loadErrorHandler);

            // 传入的 url 和 sound.url 有可能不相同，因此用 loadingUrl 来纠正
            if (loadingUrl) {
                urlLoaded[loadingUrl] = true;
            }

            externalCall.loadComplete(
                getSoundInfo(sound)
            );
        }

        private function loadErrorHandler(e: IOErrorEvent): void {


            var sound: Sound = e.target as Sound;

            sound.removeEventListener(ProgressEvent.PROGRESS, loadProgressHandler);
            sound.removeEventListener(Event.COMPLETE, loadCompleteHandler);
            sound.removeEventListener(IOErrorEvent.IO_ERROR, loadErrorHandler);

            var data: Object = getSoundInfo(sound);
            data.error = e.text;

            externalCall.loadError(data);

        }

        private function playProgressHandler(e: Event): void {

            var data: Object = getSoundInfo(sound);
            data.played = Math.floor(soundChannel.position);
            data.total = Math.floor(sound.length);

            externalCall.playProgress(data);

        }

        private function playCompleteHandler(e: Event): void {

            soundChannel.removeEventListener(Event.SOUND_COMPLETE, playCompleteHandler);
            stage.removeEventListener(Event.ENTER_FRAME, playProgressHandler);

            externalCall.playComplete();
        }

    }

}