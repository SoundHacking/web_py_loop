
let buffersize = 4096

class Microphone{
    constructor(){
        this.started = false
    }
    process(audioProcessingEvent){
        let inputBuffer = audioProcessingEvent.inputBuffer;
        let outputBuffer = audioProcessingEvent.outputBuffer;
        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                let inputData = inputBuffer.getChannelData(channel);
                let outputData = outputBuffer.getChannelData(channel);
                for (let sample = 0; sample < inputBuffer.length; sample++) {
                    outputData[sample] = inputData[sample];
                    outputData[sample] += ((Math.random() * 2) - 1) * 0.03;
                }
            }
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
        this.scriptNode = audioContext.createScriptProcessor(buffersize, 1, 1) //deprecated => replaced by AudioWorkletNode
        this.scriptNode.onaudioprocess = this.process
        this.audioInput.connect(this.scriptNode)
        this.scriptNode.connect(audioContext.destination)
    }
}

export{
    Microphone
}
