
let buffersize = 4096

class Microphone{
    constructor(){
        this.started = false
    }
    async start(socket){
        if(this.started){
            console.log('microphone alread started')
            return
        }
        this.started = true
        console.log('microphone starting')
        let audioContext = new(window.AudioContext || window.webkitAudioContext)()
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        this.audioInput = audioContext.createMediaStreamSource(stream)
        //this.recorder = audioContext.createScriptProcessor(buffersize, ) //deprecated => replaced by AudioWorkletNode
    }
}

export{
    Microphone
}
