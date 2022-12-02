```html
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="mu-music-upload relative">
    <div ref="progress" class="progress"></div>
    <div
      class="real-show flex items-center content-between absolute">
      <p class="color-fff flex items-center font-t6 font-mS color-000">
        {{ fileName || placeHolder }}
      </p>
    </div>
    <div>
      <input
        type="file"
        id="ipt"
        class="music-file"
        @change="handleFileChange"
      />
      <audio src="" id="muAudioUploaderPlayer" @pause="isPlaying = false" class="absolute player"></audio>
    </div>
    <div
      @click="playMusic"
      class="absolute play-button"
      v-if="fileName && loaded"
    >
      <img
        src="@/assets/imgs/icons/icon_stop.png"
        class="icon-size"
        v-show="isPlaying"
        alt=""
      />
      <img
        src="@/assets/imgs/icons/icon_play.png"
        v-show="!isPlaying"
        class="icon-size"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import {
  getNewArrayBuffer,
  bufferToWave,
  checkIsMusicFile,
  getNameFromUrl,
} from "./utils";

export default {
  name: "mu-music-upload",
  props: {
    placeHolder: {
      type: String,
      default() {
        return "Select the MP3 File ...";
      },
    },
    initUrl: {
      type: String,
    },
  },
  data() {
    return {
      audioEle: null,
      fileEle: null,
      isPlaying: false,
      fileName: "",
      loaded: false,
    };
  },
  methods: {
    clearProgress() {
      this.$refs.progress ? this.$refs.progress.style.width = '0px' : '';
    },
    setProgress() {
      const curTime = this.audioEle.currentTime;
      const endTime = this.audioEle.duration;
      this.$refs.progress ? this.$refs.progress.style.width = `calc(100% / ${endTime} * ${curTime})` : '';
      if (this.isPlaying) {
        curTime < endTime ? requestAnimationFrame(this.setProgress) : this.clearProgress()
      } else {
        this.isPlaying = false;
      }
    },
    playMusic() {
      const { audioEle } = this;
      if (this.isPlaying) {
        audioEle.pause();
      } else {
        audioEle.play();
        requestAnimationFrame(this.setProgress)
      }
      this.isPlaying = !this.isPlaying;
    },
    handleFileChange(e) {
      const _this = this;
      const file = e.target.files[0];
      const fileName = file.name;
      if (!checkIsMusicFile(fileName)) {
        this.$toast.error("Only .mp3 accepted");
        return;
      }
      this.fileName = "loading...";
      this.loaded = false
      // 暂停播放
      if (this.isPlaying) this.playMusic();
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target.result;
        const audioCtx = new AudioContext();
        audioCtx.decodeAudioData(res, function (audioBuffer) {
          const { newAudioBuffer, frameCount } = getNewArrayBuffer(
            audioBuffer,
            audioCtx
          );
          // 给页面元素设置src
          const blob = bufferToWave(newAudioBuffer, frameCount);
          const audioEle = document.getElementById("muAudioUploaderPlayer");
          audioEle.src = window.URL.createObjectURL(blob);
          _this.fileName = fileName;
          _this.loaded = true;
        });
      };

      reader.readAsArrayBuffer(file);
    },
  },
  mounted() {
    this.fileEle = document.getElementById("ipt");
    this.audioEle = document.getElementById("muAudioUploaderPlayer");

    if (this.initUrl) {
      this.audioEle.src = this.initUrl;
      this.fileName = getNameFromUrl(this.initUrl);
      this.loaded = true;
    }
  },
};
</script>

<style lang="less">
.mu-music-upload {
  .player {
    opacity: 0;
    top: 0;
  }

  .music-file {
    opacity: 0;
  }

  .play-button {
    z-index: 9;
    top: 0.6rem;
    right: 1rem;
  }

  .progress {
    position: absolute;
    height: 100%;
    z-index: -1;
    opacity: .4;
    border-radius: 0;
    transform: rotate(0);
    background-color: var(--color-green);
  }

  .real-show {
    top: 0;
    z-index: -2;
    padding: 0 1rem;
    border-radius: 12px;
    background-color: var(--color-green);
    transition: all 0.5s;
    &.bg-fff {
      background-color: var(--color-gray-200);
    }
  }

  .real-show {
    height: 60px;
    width: 100%;
  }

  .music-file {
    width: 80%;
    height: 60px;
  }
}
</style>

```

utils

```js
export function getNewArrayBuffer(audioBuffer) {
  // 声道数量和采样率
  const channels = audioBuffer.numberOfChannels;
  const rate = audioBuffer.sampleRate;

  // 截取前5秒
  const startOffset = 0;
  const endOffset = audioBuffer.length;
  // 5秒对应的帧数
  const frameCount = endOffset - startOffset;
  // 创建同样采用率、同样声道数量，长度是前3秒的空的AudioBuffer
  const newAudioBuffer = new AudioContext().createBuffer(
    channels,
    endOffset - startOffset,
    rate
  );
  // 创建临时的Array存放复制的buffer数据
  const anotherArray = new Float32Array(frameCount);
  // 声道的数据的复制和写入
  const offset = 0;
  for (let channel = 0; channel < channels; channel++) {
    audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
    newAudioBuffer.copyToChannel(anotherArray, channel, offset);
  }
  // newAudioBuffer就是全新的复制的5秒长度的AudioBuffer对象
  return {
    newAudioBuffer,
    frameCount,
  };
}

export function bufferToWave(abuffer, len) {
  const numOfChan = abuffer.numberOfChannels,
    length = len * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [];

  let i,
    sample,
    offset = 0,
    pos = 0;

  // write WAVE header
  // "RIFF"
  setUint32(0x46464952);
  // file length - 8
  setUint32(length - 8);
  // "WAVE"
  setUint32(0x45564157);
  // "fmt " chunk
  setUint32(0x20746d66);
  // length = 16
  setUint32(16);
  // PCM (uncompressed)
  setUint16(1);
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  // avg. bytes/sec
  setUint32(abuffer.sampleRate * 2 * numOfChan);
  // block-align
  setUint16(numOfChan * 2);
  // 16-bit (hardcoded in this demo)
  setUint16(16);
  // "data" - chunk
  setUint32(0x61746164);
  // chunk length
  setUint32(length - pos - 4);

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));
  while (pos < length) {
    // interleave channels
    for (i = 0; i < numOfChan; i++) {
      // clamp
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      // scale to 16-bit signed int
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      // write 16-bit sample
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    // next source sample
    offset++;
  }
  // create Blob
  return new Blob([buffer], { type: "audio/wav" });
  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}


export function checkIsMusicFile(fileName) {
  const reg = /\.(mp3|wma)/
  return reg.test(fileName)
}

export function getNameFromUrl(url) {
  return url.split('/').at(-1)
}
```