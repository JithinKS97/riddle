import Drawingboard from "./Drawingboard";
import { useEffect, useContext, useState } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import nknApi from "../services/nkn";
import messageApi from "../services/message";
import membersApi from "../services/members";

function Collaboration() {
  const context = useContext(AppContext);
  const { client, setClient, members, setMembers } = context;
  const isSubClient = client === null;
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) {
      return;
    }
    client.onMessage(handleMessage);
  }, [client]);

  const handleMessage = (message) => {
    return messageApi.handleMessageReceive({ message, client });
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    if (isSubClient) {
      const newClient = nknApi.createClient({ id, isMainClient: false });

      console.log("Client created...");
      console.log(newClient);

      setClient(newClient);
      newClient.onConnect(postConnect(newClient));
    } else {
      setLoading(false);
    }
  }, [id]);

  const postConnect = (client) => async () => {
    console.log("Client finished connecting...");
    await messageApi.join({ client });
    setLoading(false);
  };

  return loading ? <div>Loading...</div> : <Drawingboard />;
}

export default Collaboration;
