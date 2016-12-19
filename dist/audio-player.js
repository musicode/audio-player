(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.AudioPlayer = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var HtmlPlayer = function () {
  function HtmlPlayer(options) {
    classCallCheck(this, HtmlPlayer);
    var element = options.element;

    element.innerHTML = '<audio></audio>';

    var parentNode = element.parentNode,
        firstChild = element.firstChild;

    parentNode.replaceChild(firstChild, element);

    var me = this;
    me.audio = firstChild;

    firstChild.onloadstart = function () {
      if (options.onLoadStart) {
        options.onLoadStart();
      }
    };
    firstChild.onprogress = function () {
      if (options.onLoadProgress) {
        options.onLoadProgress({
          loaded: 0,
          total: 0
        });
      }
    };
    firstChild.oncanplaythrough = function () {
      if (options.onLoadComplete) {
        options.onLoadComplete({
          url: firstChild.src,
          duration: firstChild.duration
        });
      }
    };

    firstChild.onplaying = function () {
      if (options.onPlayStart) {
        options.onPlayStart();
      }
    };
    firstChild.ontimeupdate = function () {
      var currentTime = firstChild.currentTime,
          duration = firstChild.duration;

      if (options.onPlayProgress) {
        options.onPlayProgress({
          played: currentTime,
          total: duration
        });
      }
      if (currentTime > 0 && currentTime === duration && options.onPlayComplete) {
        options.onPlayComplete();
      }
    };
  }

  createClass(HtmlPlayer, [{
    key: 'load',
    value: function load(url) {
      var audio = this.audio;

      audio.src = url;
      audio.load();
    }
  }, {
    key: 'play',
    value: function play(url) {
      var audio = this.audio;

      audio.src = url;
      audio.play();
    }
  }, {
    key: 'stop',
    value: function stop() {
      var audio = this.audio;

      audio.pause();
      audio.currentTime = 0;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      var audio = this.audio;


      this.audio = audio.onloadstart = audio.onprogress = audio.oncanplaythrough = audio.onplaying = audio.ontimeupdate = null;

      var parentNode = audio.parentNode;

      parentNode.removeChild(audio);
    }
  }]);
  return HtmlPlayer;
}();

var FlashPlayer = function () {
  function FlashPlayer(options) {
    classCallCheck(this, FlashPlayer);


    var name = '_AudioPlayer_' + guid++;

    var element = options.element,
        swfUrl = options.swfUrl;

    element.innerHTML = getFlashHTML(swfUrl, name);

    var parentNode = element.parentNode,
        firstChild = element.firstChild;

    parentNode.replaceChild(firstChild, element);

    var me = this;
    me.swf = firstChild;
    me.name = name;

    for (var key in options) {
      if (key.indexOf('on') === 0) {
        me[key] = options[key];
      }
    }

    window[name] = document[name] = FlashPlayer.instances[name] = me;
  }

  createClass(FlashPlayer, [{
    key: 'load',
    value: function load(url) {
      var swf = this.swf;

      if (swf.doAction) {
        swf.doAction('load', url);
      }
    }
  }, {
    key: 'play',
    value: function play(url) {
      var swf = this.swf;

      if (swf.doAction) {
        swf.doAction('play', url);
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      var swf = this.swf;

      if (swf.doAction) {
        swf.doAction('stop');
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      var swf = this.swf,
          name = this.name;

      if (swf.dispose) {
        swf.dispose();
      }

      this.swf = window[name] = document[name] = AudioPlayer.instances[name] = null;
    }
  }]);
  return FlashPlayer;
}();

FlashPlayer.instances = {};

var guid = 0;

function getFlashHTML(swfUrl, movieName) {
  return '\n    <object id="' + movieName + '" class="audio-player" type="application/x-shockwave-flash" data="' + swfUrl + '" width="1px" height="1px">,\n        <param name="wmode" value="transparent" />\n        <param name="movie" value="' + swfUrl + '" />\n        <param name="quality" value="high" />\n        <param name="menu" value="false" />\n        <param name="allowScriptAccess" value="always" />\n        <param name="flashvars" value="movieName=' + movieName + '" />\n    </object>\n  ';
}

window.AudioPlayer = FlashPlayer;

var AudioPlayer$1 = FlashPlayer;

var element = document.createElement('audio');
if (element && element.canPlayType) {
  if (element.canPlayType('audio/mp3') === 'probably') {
    AudioPlayer$1 = HtmlPlayer;
  }
}

AudioPlayer$1.version = '0.0.1';

var AudioPlayer$2 = AudioPlayer$1;

return AudioPlayer$2;

})));
