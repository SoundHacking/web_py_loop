let queue = []
let started = false

class Microphone{
    constructor(){
        started = false
    }
    direct_push(event){
        queue.push(event.data);
        console.log(event.data);
        console.log(`Blob type = ${event.data.type} size = ${event.data.size}`);
    }
    async start(){
        if(started){
            console.log('microphone alread started')
            return
        }
        started = true
        console.log('microphone starting')
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        let recorder = new MediaRecorder(stream,{ mimeType: 'audio/webm;codecs=opus' })
        recorder.ondataavailable = this.direct_push
        recorder.onstop = this.mediarecorder_stop
        recorder.start()
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
