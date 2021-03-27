import {Microphone} from "./microphone.js"

let mic = new Microphone()

function main(){
    let but = document.getElementById("mic_button")
    but.onclick = ()=>{
        mic.start().then(()=>{console.log('click started')})
    }
}

main()
