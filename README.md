# Riddle
<p align="center"><img width="650px" height="360px" src="https://i.ibb.co/0CYwLwN/Screenshot-2021-09-17-at-8-03-32-AM.png" alt="riddle-logo" /></p>
Riddle is an open source peer to peer white board collaboration App. The clients communicate directly over ![NKN](https://nkn.org/), a new kind of network without any central servers!

From the app, you can create a new room and invite others to it by using the share Id provided to you and start collaborating using the shared white board.

The whiteboard contents can be saved to local computer by any member in the room. There is also an option to store the content to IPFS and retrieve from it.

# Technologies used
1. [NKN](https://nkn.org/)
2. [Fabric](http://fabricjs.com/)
3. [React](https://reactjs.org/)
4. [IPFS](ipfs.io/)

# Use the app
App is hosted in IPFS. We recommend using Brave browser to use the App. There are chances that you might encounter some problems from other browsers.
ipns://nknriddle.xyz/

# Communication protocol
1. When a client accesses an App, a public address and private key is allocated to him.
2. The person who creates a room (Main client) shares his public address with people who wants to join.
3. When a new person joins, they ping the main client to get the latest state of the canvas and the public addresses of the present members in the room.
4. The whiteboard updates made by each client is broadcasted to everyone so that everyone updates their board with the new changes.
5. When the main client leaves, another client is made the main client (So that the share Id changes) and if somebody wants to join, he has to use the public address of the new main client.

# The whiteboard
The whiteboard is made using [Fabric.js](http://fabricjs.com/), a very powerful and convenient layer of abstraction build over the canvas API.
