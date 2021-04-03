
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
        console.log(event.data)
        //console.log(`tx:${typeof(event.data)}`)
        if (event.data && event.data.size > 0) {
            socket.send(event.data)
        }
    }
    receiver(event){
        //queue.push(streamData)
        console.log(event.data)
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
        let recorder = new MediaRecorder(stream,{ mimeType: 'audio/webm;codecs=opus' })
        recorder.ondataavailable = this.sender

        recorder.start(100)
        this.recorder = recorder
    }
    stop(){
        this.recorder.stop()
        started = false
    }
}

export{
    Microphone
}
