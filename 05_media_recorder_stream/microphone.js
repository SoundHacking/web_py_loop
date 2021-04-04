
//min period is 50 ~ 60 ms, if set below, the browser won't execute any faster
//for 100 ms the period is very approximate
const period_ms = 100

let socket = null
let queue = []
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
        queue.push(event.data)
        console.log(`rx:${event.data.size}`)
    }
    async start(arg_socket){
        socket = arg_socket
        if(started){
            console.log('microphone alread started')
            return
        }
        started = true
        console.log('microphone starting')
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        let recorder = new MediaRecorder(stream,{ mimeType: 'audio/webm;codecs=opus' })
        recorder.ondataavailable = this.sender
        recorder.onstop = this.mediarecorder_stop
        
        recorder.start(period_ms)
        console.log(recorder.state)
        this.recorder = recorder

    }
    mediarecorder_stop(event){
        const audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.controls = true;
        document.body.appendChild(audio)

        console.log(`queue length = ${queue.length}`)
        const blob = new Blob(queue, { 'type' : 'audio/webm; codecs=opus' });
        console.log(`blob size = ${blob.size}`)
        queue = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
    }
    stop(){
        this.recorder.stop()
        started = false

    }
}

export{
    Microphone
}
