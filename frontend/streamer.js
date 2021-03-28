

let url = window.location.hostname
//let url = 'localhost'
let port = 88

class Streamer{
    constructor(){
        this.socket = null
    }
    is_open(){
        return (this.socket == null)
    }
    receive(event){
        console.log(`ws-message>${event.data}`)
    }
    async open(){
        return new Promise((resolve,reject) => {
            console.log('stream starting')
            let socket = new WebSocket(`ws://${url}:${port}`);
            socket.onopen = ()=>{
                console.log(`ws> open (${socket.url})`)
                this.socket = socket
                resolve(socket)
            }
            socket.onerror = (err)=>{
                this.socket = null
                reject(err)
            }

            socket.onmessage = this.receive
            
            socket.onclose = (event)=>{
                if(event.wasClean){
                    console.log('ws> closed')
                }else{
                    console.warn('ws> socket down')
                }
                this.socket = null
            }
        })
    }
    async send(payload){
        if(!this.is_open()){
            try{
                await this.open()
            }catch(error){
                console.log(`ws> open error (${err})`)
            }
        }
        this.socket.send(payload)
    }
}

export{
    Streamer
}
