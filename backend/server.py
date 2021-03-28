import asyncio
import websockets

url = "127.0.0.1"
port = 88

async def loop_back(websocket, path):
    async for packet in websocket:
        await websocket.send(packet)

server = websockets.serve(loop_back, url, port)

print(f"websocket loop back listening on 'ws://{url}:{port}' ")
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
