new Vue({
    el: '#app',
    data: {
        volume: null,
        whistles: [],
        whistleTime: null,
    },

    created() {
        this.initMic();
    },

    mounted() { },

    methods: {

        initMic() {
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    audio: true
                }, this.handleStream,
                    (err) => console.log("The following error occured: " + err.name));
            } else console.log("getUserMedia not supported");
        },

        handleStream(stream) {
            let audioContext = new AudioContext();
            let analyser = audioContext.createAnalyser();
            let microphone = audioContext.createMediaStreamSource(stream);
            let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = () => {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var values = 0;
                var length = array.length;
                for (var i = 0; i < length; i++) values += (array[i]);
                this.volume = Math.ceil(values / length);
            }
        },

        addWhistles() {
            this.whistles.push()
        }
    }
})

Vue.component('whistle-meter', {
    props: {
        volume: {
            type: Number,
            default: 0
        }
    },
    template: `
    <div class="whistle-meter d-flex">
        <h1 class="align-self-center mb-0 pr-2">{{volume}}</h1>
        <div class="meter-cover align-self-center">
            <div class="threshold"> <span> Whistle Point </span> </div>
            <div class="gas" :style="'width:' + volume + 'px'"></div>
        </div>
    </div>
    `
})