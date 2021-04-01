
let buffersize = 4096

let socket = null
class Player{
    constructor(){
    }
    receive(event){
        if (event.data instanceof ArrayBuffer) {
            let streamData = new Float32Array(event.data);
            console.log(`rx: length:${streamData.length} type:${typeof(streamData)}  [0]:${streamData[0]}`)
            return
        }
    }
}

export{
    Player
}
