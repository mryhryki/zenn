/* eslint-disable arrow-parens */
class LocalStream {
  start(successCallback = null, errorCallback = null) {
    this.stream = null;
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.stream = stream;
        if (successCallback) successCallback(stream);
      })
      .catch((error) => {
        console.error(error);
        if (errorCallback) errorCallback(error);
      });
  }

  close() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  getStream() {
    return this.stream || null;
  }

  enableVideo(enabled) {
    const videoTracks = this.getVideoTracks();
    if (videoTracks) {
      // eslint-disable-next-line no-param-reassign, no-return-assign
      videoTracks.forEach(track => track.enabled = enabled);
      return true;
    }
    return false;
  }

  enableAudio(enabled) {
    const audioTracks = this.getAudioTracks();
    if (audioTracks) {
      // eslint-disable-next-line no-param-reassign, no-return-assign
      audioTracks.forEach(track => track.enabled = enabled);
      return true;
    }
    return false;
  }

  getAudioTracks() {
    if (!this.stream) return null;
    return this.stream.getAudioTracks();
  }

  getVideoTracks() {
    if (!this.stream) return null;
    return this.stream.getVideoTracks();
  }
}

export default LocalStream;
