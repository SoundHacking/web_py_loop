
//min period is 50 ~ 60 ms, if set below, the browser won't execute any faster
//for 100 ms the period is very approximate
const period_ms = 100

let socket = null
let sourceBuffer
let started = false

class Microphone{
    constructor(){
        started = false
    }
    sender(event){
        if(!started){
            return
        }
        //console.log(`tx:${event.data.size}`)
        if (event.data && event.data.size > 0) {
            socket.send(event.data)
        }
    }
    receiver(event){
        if (event.data instanceof ArrayBuffer) {
            console.log(`rx:${event.data.byteLength} bytes`)
            sourceBuffer.appendBuffer(event.data)
        }
    }
    async start(arg_socket){
        if(started){
            console.log('microphone alread started')
            return
        }
        started = true
        socket = arg_socket
        socket.binaryType = 'arraybuffer';


        //https://developer.mozilla.org/en-US/docs/Web/API/MediaSource
        let mediaSource = new MediaSource();
        //"audio.srcObject = mediaSource" => not possible, only allowed for WebRTC MediaStream
        //https://stackoverflow.com/questions/51843518/mediasource-vs-mediastream-in-javascript/51860280
        const audioURL = window.URL.createObjectURL(mediaSource);
        const audio = document.getElementById('audio');
        audio.src = audioURL;

        mediaSource.onsourceopen = (()=>{
            console.log("MediaSource> open")
            sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus');
            console.log(`source buffer mode = ${sourceBuffer.mode}`)
        })
        mediaSource.onstop = (()=>{console.log("MediaSource> stop")})
        mediaSource.onsourceended = (()=>{console.log("MediaSource> ended")})

        //-----------------------------------------------------------------------------
        console.log('MediaRecorder> starting')
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        let recorder = new MediaRecorder(stream,{ mimeType: 'audio/webm;codecs=opus' })
        recorder.ondataavailable = this.sender
        recorder.onstop = this.mediarecorder_stop
        recorder.start(period_ms)
        console.log('MediaRecorder> started')
        console.log(recorder.state)
        this.recorder = recorder
    }
    mediarecorder_stop(event){
        console.log("MediaRecorder> stop")
    }
    stop(){
        this.recorder.stop()
        started = false
    }
}

export{
    Microphone
}
