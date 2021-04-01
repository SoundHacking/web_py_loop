
let buffersize = 4096

let socket = null
class Microphone{
    constructor(){
        this.started = false
    }
    sender(audioProcessingEvent){
        let inputBuffer = audioProcessingEvent.inputBuffer;
        let outputBuffer = audioProcessingEvent.outputBuffer;
        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                let inputData = inputBuffer.getChannelData(channel);
                console.log(`tx: length:${inputData.length} type:${typeof(inputData)} [0]:${inputData[0]}`)
                socket.send(inputData)
                let outputData = outputBuffer.getChannelData(channel);
                for (let sample = 0; sample < inputBuffer.length; sample++) {
                    outputData[sample] = inputData[sample];
                    outputData[sample] += ((Math.random() * 2) - 1) * 0.03;
                }
            }
    }
    receiver(data){
        console.log(data.size)
    }
    async start(arg_socket){
        socket = arg_socket
        socket.binaryType = 'arraybuffer';
        if(this.started){
            console.log('microphone alread started')
            return
        }
        this.started = true
        console.log('microphone starting')
        let audioContext = new(window.AudioContext || window.webkitAudioContext)()
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        this.audioInput = audioContext.createMediaStreamSource(stream)
        this.scriptNode = audioContext.createScriptProcessor(buffersize, 1, 1) //deprecated => replaced by AudioWorkletNode
        this.scriptNode.onaudioprocess = this.sender
        this.audioInput.connect(this.scriptNode)
        this.scriptNode.connect(audioContext.destination)
        this.audioContext = audioContext
    }
    stop(){
        this.audioInput.disconnect(this.scriptNode)
        this.scriptNode.disconnect(this.audioContext.destination)
        this.started = false
    }
}

export{
    Microphone
}
