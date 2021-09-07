import Drawingboard from "./Drawingboard";
import { useEffect, useContext, useState } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import { useRef } from "react";
import nknApi from "../services/nkn";
import messageApi from "../services/message";
import membersApi from "../services/members";
import Members from "./members";

function Collaboration() {
  const context = useContext(AppContext);
  const { client, setClient, members, setMembers } = context;
  const isSubClient = client === null;
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!client) {
      return;
    }
    client.onMessage(handleMessage);
  }, [client]);

  const handleMessage = (message) => {
    return messageApi.handleMessageReceive({
      message,
      client,
      getCanvasAsJSON,
      addMember,
    });
  };

  const addMember = (newMember) => {
    return membersApi.addMember({
      members,
      setMembers,
      newMember,
    });
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
    const fabricJSON = await messageApi.join({ client });
    setCanvas(fabricJSON);
    setLoading(false);
  };

  /**
   * Canvas functions
   */

  const getCanvasAsJSON = () => {
    return JSON.stringify(canvasRef.current.getCanvasAsJSON());
  };

  const setCanvas = (fabricJSON) => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.loadFromJSON(fabricJSON, function () {
      canvasRef.current.renderAll();
    });
  };

  return (
    <>
      <style>{style({ loading })}</style>
      {loading ? <div>Loading...</div> : null}
      <div className="canvas-outer">
        <Drawingboard ref={canvasRef} />
        <Members members={members} />
      </div>
    </>
  );
}

const style = ({ loading }) => `
  .canvas-outer {
    visibility:${loading ? "hidden" : "visible"};
  }  
`;

export default Collaboration;
