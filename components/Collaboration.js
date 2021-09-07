import Drawingboard from "./Drawingboard";
import { useEffect, useContext, useState } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import { useRef } from "react";
import nknApi from "../services/nkn";
import messageApi from "../services/message";
import membersApi from "../services/members";
import Members from "./Members";

function Collaboration() {
  const context = useContext(AppContext);
  const { client, setClient, members, setMembers } = context;
  const isSubClient = client === null;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  // Getting the current canvas state
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    if (isSubClient) {
      const newClient = nknApi.createClient({ id, isMainClient: false });

      console.log("Created client...");
      console.log(newClient);

      setClient(newClient);
      newClient.onConnect(getCurrentCanvasState(newClient));
    } else {
      client.onConnect(() => {
        console.log("Client finished connecting...");
        setLoading(false);
      });
    }
  }, [id]);

  const getCurrentCanvasState = (client) => async () => {
    console.log("Client finished connecting...");
    const fabricJSON = await messageApi.join({ client });
    setCanvas(fabricJSON);
    console.log("Restored canvas state...");
    setLoading(false);
  };

  useEffect(() => {
    if (!client) {
      return;
    }
    client.onMessage(handleMessage);
  }, [client]);

  /**
   * Message handling
   */

  const handleMessage = (message) => {
    return messageApi.handleReception({
      message,
      client,
      getCanvasAsJSON,
      addMember,
    });
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

  /**
   * Membership
   */

  const addMember = (newMember) => {
    return membersApi.addMember({
      members,
      setMembers,
      newMember,
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
