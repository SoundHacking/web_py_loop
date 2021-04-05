import {Microphone} from "./microphone.js"
import {Streamer} from "./streamer.js"

let recorder = new Microphone()
let streamer = new Streamer()

async function record(){
    let socket = await streamer.open()
    socket.onmessage = recorder.receiver
    await recorder.start(socket)
    console.log('record started')
}

function main(){
    
    document.getElementById("mic_start").onclick = ()=>{
        record()
    }
    document.getElementById("mic_stop").onclick = ()=>{
        recorder.stop()
        streamer.close()
    }

}

main()
