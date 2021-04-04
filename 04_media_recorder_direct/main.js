import {Microphone} from "./microphone.js"
import {Streamer} from "./streamer.js"

let recorder = new Microphone()
let streamer = new Streamer()

async function record(){
    await recorder.start()
    console.log('record started')
}

function main(){
    
    document.getElementById("mic_start").onclick = ()=>{
        record()
    }
    document.getElementById("mic_stop").onclick = ()=>{
        recorder.stop()
    }

    let open_but = document.getElementById("test_button")
    open_but.onclick = ()=>{
        console.log('Test click')
        streamer.send("Hello button test").then(()=>{
            console.log('Test done')
        })
    }
}

main()
