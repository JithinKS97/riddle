1. One person (Main client) creates a room (Creates a new seed key)
2. For others (Sub client) to join, the key should be shared with them
3. For them to join, they send a Join message to the main client
4. As a reply, the get the latest canvas data and the address of all the current members
5. When change is made in the canvas, it is broadcasted to all
6. When a sub client leaves, it sends a message to all
7. When the main client leaves, it makes a sub client main client
