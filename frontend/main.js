import {Microphone} from "./microphone.js"
import {Streamer} from "./streamer.js"

let mic = new Microphone()
let streamer = new Streamer()

//Player : https://mdn.github.io/webaudio-examples/audio-buffer/

async function record(){
    let socket = await streamer.open()
    await mic.start(socket)
}

function main(){
    let but = document.getElementById("mic_button")
    but.onclick = ()=>{
        record.then(console.log('record started'))
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
