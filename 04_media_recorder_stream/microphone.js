
//48 KHz : 4096 => 85.33 ms :  12 pps
//48 KHz :  256 =>  5.33 ms : 187 pps
let buffersize = 256

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
        //event.data.type = 'audio/webm;codecs=opus'
        console.log(event.data.type)
        console.log(`tx:${typeof(event.data)}`)
        if (event.data && event.data.size > 0) {
            socket.send(event.data)
        }
        queue.push(event.data)
    }
    receiver(event){
        //queue.push(event.data)
        console.log(event.data.type)
    }
    async start(arg_socket){
        socket = arg_socket
        //socket.binaryType = 'arraybuffer';
        if(started){
            console.log('microphone alread started')
            return
        }
        started = true
        console.log('microphone starting')
        let audioContext = new(window.AudioContext || window.webkitAudioContext)()
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        const capabilities = stream.getAudioTracks()[0].getCapabilities();
        console.log(capabilities)
        //let recorder = new MediaRecorder(stream,{ mimeType: 'audio/webm;codecs=opus' })
        let recorder = new MediaRecorder(stream)
        recorder.ondataavailable = function(e) {
           queue.push(e.data);
           console.log(e.data.type);
        }
        recorder.onstop = this.mediarecorder_stop

        console.log(recorder.state)
        this.recorder = recorder

    }
    mediarecorder_stop(event){
        const audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.controls = true;
        document.body.appendChild(audio)
        //const blob = new Blob(queue, { 'type' : 'audio/ogg; codecs=opus' });
        //queue = [];
        //const audioURL = URL.createObjectURL(blob);
        //audio.src = audioURL;

        const blob = new Blob(queue, { 'type' : 'audio/webm; codecs=opus' });
        //queue = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
        //audio.srcObject = blob;
    }
    stop(){
        this.recorder.stop()
        started = false

    }
}

export{
    Microphone
}
