
export default class FlashPlayer {

  /**
   * 音频播放器
   *
   * @constructor
   * @param {Object} options
   * @property {string} options.swfUrl swf 文件的 url
   * @property {HTMLElement} options.element 生成 flash 的占位符元素
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

    let name = `_AudioPlayer_${guid++}`

    let { element, swfUrl } = options
    element.innerHTML = getFlashHTML(swfUrl, name)

    let { parentNode, firstChild } = element
    parentNode.replaceChild(firstChild, element);

    let me = this
    me.swf = firstChild
    me.name = name;

    for (let key in options) {
      if (key.indexOf('on') === 0) {
        me[key] = options[key]
      }
    }

    window[name] =
    document[name] =
    FlashPlayer.instances[name] = me

  }

  /**
   * 加载音频 url（不播放）
   *
   * @param {string} url
   */
  load(url) {
    let { swf } = this
    if (swf.doAction) {
      swf.doAction('load', url)
    }
  }

  /**
   * 播放音频 url
   *
   * @param {string} url
   */
  play(url) {
    let { swf } = this
    if (swf.doAction) {
      swf.doAction('play', url)
    }
  }

  /**
   * 停止播放当前音频
   */
  stop() {
    let { swf } = this
    if (swf.doAction) {
      swf.doAction('stop')
    }
  }

  /**
   * 销毁
   */
  dispose() {

    let { swf, name } = this
    if (swf.dispose) {
      swf.dispose()
    }

    this.swf =
    window[name] =
    document[name] =
    AudioPlayer.instances[name] = null

  }

}

FlashPlayer.instances = { }

/**
 * 计数器，用于生成 ID
 *
 * @inner
 * @type {number}
 */
let guid = 0

/**
 * 创建 swf 元素
 *
 * @inner
 * @param {string} swfUrl
 * @param {string} movieName
 * @return {string}
 */
function getFlashHTML(swfUrl, movieName) {
  return `
    <object id="${movieName}" class="audio-player" type="application/x-shockwave-flash" data="${swfUrl}" width="1px" height="1px">,
        <param name="wmode" value="transparent" />
        <param name="movie" value="${swfUrl}" />
        <param name="quality" value="high" />
        <param name="menu" value="false" />
        <param name="allowScriptAccess" value="always" />
        <param name="flashvars" value="movieName=${movieName}" />
    </object>
  `
}

// flash 需要全局引用
window.AudioPlayer = FlashPlayer

