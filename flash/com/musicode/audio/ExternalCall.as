/**
 * @file 外部接口文件, 方便查看对外暴露的接口
 * @author musicode
 */
package com.musicode.audio {

    import flash.external.ExternalInterface;

    public class ExternalCall {

        private var movieName: String;

        public function ExternalCall(movieName: String = '') {
            this.movieName = movieName;
        }

        public function swfReady(): void {
            call('onSwfReady');
        }

        /**
         * 开始加载音频时调用
         */
        public function loadStart(data: Object): void {
            call('onLoadStart', data);
        }

        /**
         * 音频加载过程中调用
         *
         * @param {uint} bytesLoaded
         * @param {uint} bytesTotal
         */
        public function loadProgress(data: Object): void {
            call('onLoadProgress', data);
        }

        /**
         * 音频加载错误调用
         *
         * @param {Object} data
         */
        public function loadError(data: Object): void {
            call('onLoadError', data);
        }

        /**
         * 音频加载完成时调用
         */
        public function loadComplete(data: Object): void {
            call('onLoadComplete', data);
            call('onPlayStart');
        }

        /**
         * 音频播放过程中调用
         */
        public function playProgress(data: Object): void {
            call('onPlayProgress', data);
        }

        /**
         * 音频播放完成时调用
         */
        public function playComplete(): void {
            call('onPlayComplete');
        }

        private function call(name: String, data: Object = null): void {
            var prefix: String = 'AudioPlayer.instances["' + movieName + '"].';
            ExternalInterface.call(prefix + name, data);
        }

        public function addCallback(name: String, fn: Function): void {
            ExternalInterface.addCallback(name, fn);
        }

    }
}
