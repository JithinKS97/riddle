import Drawingboard from "./Drawingboard";
import { useEffect, useContext, useState } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import { useRef } from "react";
import nknApi from "../services/nkn";
import messageApi from "../services/message";
import membersApi from "../services/members";
import Members from "./Members";
import { Button } from "@chakra-ui/react";

function Collaboration() {
  const context = useContext(AppContext);
  const { client, setClient, members, setMembers } = context;
  const isSubClient = client === null;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const membersRef = useRef([]);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      messageApi.sendLeaveMessage({ client, members });
      return null;
    };
  });

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  // Getting the current canvas state
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    if (isSubClient) {
      const newClient = nknApi.createClient({ id, isMainClient: false });
      setClient(newClient);
      newClient.onConnect(getCurrentState(newClient));
    } else {
      client.onConnect(() => {
        setLoading(false);
      });
    }
  }, [id]);

  const getCurrentState = (client) => async () => {
    const { fabricJSON, currentMembers } = await messageApi.join({ client });
    setCanvas(fabricJSON);
    setMembers(currentMembers);
    setLoading(false);
  };

  /**
   * Message handling
   */

  useEffect(() => {
    if (!client) {
      return;
    }
    client.onMessage(handleMessage);
  }, [client]);

  const handleMessage = (message) => {
    return messageApi.handleReception({
      message,
      client,
      getCanvasAsJSON,
      addMember,
      removeMember,
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
      members: membersRef.current,
      setMembers,
      newMember,
    });
  };

  const removeMember = (memberToRemove) => {
    return membersApi.removeMember({
      members: membersRef.current,
      setMembers,
      memberToRemove,
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
