1. One person (Main client) creates a room and shares his public key with others
2. For others (Sub client) to join, the public address is used to connect to the main client
3. They send a join request to the main client
4. As a reply, they get the latest canvas data and the address of all the current members
5. When change is made in the canvas, it is broadcasted to all
6. When a sub client leaves, it sends a message to all
7. When the main client leaves, it makes a sub client main client
8. So the join id changes as the public address of the client to which message should be sent to join changes
