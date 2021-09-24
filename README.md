# Riddle
<p align="center"><img width="650px" height="360px" src="https://i.ibb.co/0CYwLwN/Screenshot-2021-09-17-at-8-03-32-AM.png" alt="riddle-logo" /></p>
Riddle is an open source white board collaboration App. It is built on <a href="https://nkn.org/">NKN</a>, a p2p network connectivity protocol, which implies that users do not rely on a centralized authority to engage with one-another.
<br/>

# About
Using the App, you can create a new room and invite others by using the Share Id provided to you and start collaborating in the shared white board.
The whiteboard content can be saved to local computer by anyone in the room. There is also an option to store and retrieve it from [IPFS](https://ipfs.io/).

# Technologies used
1. [NKN](https://nkn.org/)
2. [Fabric](http://fabricjs.com/)
3. [React](https://reactjs.org/)
4. [IPFS](https://ipfs.io/)

# Use the App
Access the App at http://nknriddle.xyz/

<b> Note - The app is hosted in IPFS. Use Brave browser with <a href="https://www.youtube.com/watch?v=jTDkTQiKzJA">IPFS mode enabled</a> to access it. You can also use it from Chrome by installing [IPFS Companion](https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch?hl=en) extension. </b>

# Communication protocol
1. When a client accesses the app, a public address is allocated to him.
2. The person who creates a room (Main user) shares his public address with people who want to join.
3. When a new person joins, they ping the main user to get the latest state of the canvas and the public addresses of all the other members in the room.
4. The whiteboard updates made by each user is broadcasted to everyone so that everyone updates their board with the new changes.
5. When the main user leaves, another user is made the main user and if somebody wants to join, he has to use the public address of the new main user.

# The whiteboard
The whiteboard is made using [Fabric.js](http://fabricjs.com/), a very powerful and convenient layer of abstraction build over the canvas API.
