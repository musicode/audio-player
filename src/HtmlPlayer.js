
export default class HtmlPlayer {

  /**
   * 音频播放器
   *
   * @constructor
   * @param {Object} options
   * @property {HTMLElement} options.element 生成 audio 标签的占位符元素
   * @property {?Function} options.onLoadStart 音频开始加载时触发
   * @property {?Function} options.onLoadProgress 音频加载过程中触发
   * @argument {Object} options.onLoadProgress.data
   * @property {Object} options.onLoadProgress.data.loaded 已加载字节
   * @property {Object} options.onLoadProgress.data.total 总字节
   * @property {?Function} options.onLoadComplete 音频加载完成触发
   * @argument {Object} options.onLoadComplete.data
   * @property {Object} options.onLoadComplete.data.url 音频 url
   * @property {Object} options.onLoadComplete.data.duration 音频时长，单位为毫秒
   * @property {?Function} options.onPlayStart 音频开始播放时中触发
   * @property {?Function} options.onPlayProgress 音频播放过程中触发
   * @argument {Object} options.onPlayProgress.data
   * @property {Object} options.onPlayProgress.data.played 当前播放位置，单位为毫秒
   * @property {Object} options.onPlayProgress.data.total 音频总时长
   * @property {?Function} options.onPlayComplete 音频播放结束触发
   */
  constructor(options) {

    let { element } = options
    element.innerHTML = '<audio></audio>'

    let { parentNode, firstChild } = element
    parentNode.replaceChild(firstChild, element);

    let me = this
    me.audio = firstChild

    firstChild.onloadstart = function () {
      if (options.onLoadStart) {
        options.onLoadStart()
      }
    }
    firstChild.onprogress = function () {
      if (options.onLoadProgress) {
        options.onLoadProgress({
          loaded: 0,
          total: 0,
        })
      }
    }
    firstChild.oncanplaythrough = function () {
      if (options.onLoadComplete) {
        options.onLoadComplete({
          url: firstChild.src,
          duration: firstChild.duration,
        })
      }
    }

    firstChild.onplaying = function () {
      if (options.onPlayStart) {
        options.onPlayStart()
      }
    }
    firstChild.ontimeupdate = function () {
      let { currentTime, duration } = firstChild
      if (options.onPlayProgress) {
        options.onPlayProgress({
          played: currentTime,
          total: duration,
        })
      }
      if (currentTime > 0
        && currentTime === duration
        && options.onPlayComplete
      ) {
        options.onPlayComplete()
      }
    }

  }

  /**
   * 加载音频 url（不播放）
   *
   * @param {string} url
   */
  load(url) {
    let { audio } = this
    audio.src = url
    audio.load()
  }

  /**
   * 播放音频 url
   *
   * @param {string} url
   */
  play(url) {
    let { audio } = this
    audio.src = url
    audio.play()
  }

  /**
   * 暂停播放当前音频
   */
  stop() {
    let { audio } = this
    audio.pause();
  }

  /**
   * 停止播放当前音频
   */
  stop() {
    let { audio } = this
    audio.pause();
    audio.currentTime = 0;
  }

  /**
   * 销毁
   */
  dispose() {

    let { audio } = this

    this.audio =
    audio.onloadstart =
    audio.onprogress =
    audio.oncanplaythrough =
    audio.onplaying =
    audio.ontimeupdate = null

    let { parentNode } = audio
    parentNode.removeChild(audio)

  }

}

