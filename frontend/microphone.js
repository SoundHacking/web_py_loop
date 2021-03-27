

async function getMedia(constraints) {
    let stream = null;
  
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      /* use the stream */
    } catch(err) {
      /* handle the error */
    }
}

class Microphone{
    constructor(){
        this.started = false
    }
    async start(){
        if(this.started){
            console.log('microphone alread started')
            return
        }
        this.started = true
        console.log('microphone starting')
        let audioContext = new(window.AudioContext || window.webkitAudioContext)();
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
}

export{
    Microphone
}
