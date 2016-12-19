
import HtmlPlayer from './HtmlPlayer'
import FlashPlayer from './FlashPlayer'

let AudioPlayer = FlashPlayer

let element = document.createElement('audio')
if (element && element.canPlayType) {
  if (element.canPlayType('audio/mp3') === 'probably') {
    AudioPlayer = HtmlPlayer
  }
}

AudioPlayer.version = '0.0.1'

export default AudioPlayer

