
//48 KHz : 4096 => 85.33 ms :  12 pps
//48 KHz :  256 =>  5.33 ms : 187 pps
let buffersize = 256

let socket = null
let queue = []
class Microphone{
    constructor(){
        this.started = false
    }
    sender(audioProcessingEvent){
        let inputBuffer = audioProcessingEvent.inputBuffer;
        let outputBuffer = audioProcessingEvent.outputBuffer;
        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                //--------------------------------------------------
                //TX
                let inputData = inputBuffer.getChannelData(channel);
                //console.log(`tx: length:${inputData.length} type:${typeof(inputData)} [0]:${inputData[0]} nbch:${outputBuffer.numberOfChannels}`)
                socket.send(inputData)
                //---------------------------------------------------
                //RX
                //console.log(`queue length = ${queue.length}`)
                let outputData = outputBuffer.getChannelData(channel);
                if(queue.length > 0){
                    let injectData = queue.shift()
                    outputData.set(injectData)
                }else{
                    //Null sink buffering on startup
                    outputData.fill(0)
                }
            }
    }
    receiver(event){
        if (event.data instanceof ArrayBuffer) {
            let streamData = new Float32Array(event.data);
            queue.push(streamData)
            console.log(`rx: length:${streamData.length}`)
            return
        }
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
        const capabilities = stream.getAudioTracks()[0].getCapabilities();
        console.log(capabilities)
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
