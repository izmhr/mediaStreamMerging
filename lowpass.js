var audioCtx = null;

$(function(){
  audioCtx = new AudioContext();
  console.log("audioCtx init");
});

var Lowpass = {
  FREQ_MUL: 7000,
  QUAL_MUL: 30,
};

Lowpass.setup = function() {
  // WebAudio API 関係の初期化
  console.log("lowpass setup");
  this.output = audioCtx.createMediaStreamDestination();
  this.lowpassNode = audioCtx.createBiquadFilter();
  this.lowpassNode.type = 0;
  this.lowpassNode.frequency.value = 440;
}

Lowpass.setupFilter = function(audioStream) {
  this.mic = audioCtx.createMediaStreamSource(audioStream);
  // エフェクトを掛けて(ローパス)
  this.mic.connect(this.lowpassNode);
  this.lowpassNode.connect(this.output);
}

Lowpass.toggleFilter = function(element) {
  this.mic.disconnect(0);
  this.lowpassNode.disconnect(0);
  if(element.checked) {
    this.mic.connect(this.lowpassNode);
    this.lowpassNode.connect(this.output);
  } else {
    this.mic.connect(this.output);
  }
}

Lowpass.changeFrequency = function(element) {
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = audioCtx.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * (element.value - 1.0));
  // Get back to the frequency value between min and max.
  this.lowpassNode.frequency.value = maxValue * multiplier;
};

Lowpass.changeQuality = function(element) {
  this.lowpassNode.Q.value = element.value * this.QUAL_MUL;
}