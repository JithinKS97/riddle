import Drawingboard from "./Drawingboard";
import { useEffect, useContext, useState } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import { useRef } from "react";
import nknApi from "../services/nkn";
import messageApi from "../services/message";
import membersApi from "../services/members";
import Loading from "./Loading";
import NamePopup from "./popups/NamePopup";
import SharePopup from "./popups/SharePopup";
import { useToast } from "@chakra-ui/react";

function Collaboration() {
  const context = useContext(AppContext);
  const {
    client,
    setClient,
    members,
    setMembers,
    isMainClient,
    setIsMainClient,
  } = context;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const membersRef = useRef([]);
  const clientRef = useRef(null);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(true);
  const [shareLink, setShareLink] = useState("");
  const [name, setName] = useState("");
  const toast = useToast();

  useEffect(() => {
    clientRef.current = client;
    if (!clientRef.current) {
      return;
    }
    clientRef.current.onMessage(handleMessage);
    registerLeave();
  }, [client]);

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  // Getting the current canvas state
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    fillShareLink();
    if (isMainClient) {
      client.onConnect(() => {
        setLoading(false);
      });
    }
  }, [id]);

  const fillShareLink = () => {
    const link = `localhost:3000/drawingboard/${id}`;
    setShareLink(link);
  };

  const onNameSubmitInSubClient = () => {
    setLoading(true);
    const newClient = nknApi.createClient({ id, isMainClient: false });
    newClient.name = name;
    setClient(newClient);
    newClient.onConnect(getCurrentState(newClient));
  };

  const getCurrentState = (client) => async () => {
    const { fabricJSON, currentMembers } = await messageApi.join({
      client,
      name,
    });
    setCanvas(fabricJSON);
    setMembers(currentMembers);
    setLoading(false);
  };

  const registerLeave = () => {
    window.onbeforeunload = () => {
      if (!isMainClient) {
        messageApi.sendLeaveMessage({
          client: clientRef.current,
          members: membersRef.current,
        });
      } else {
        messageApi.makeSubClientMainClient({
          client: clientRef.current,
          members: membersRef.current,
        });
      }
      return null;
    };
  };

  const handleMessage = (message) => {
    return messageApi.handleReception({
      message,
      client,
      getCanvasAsJSON,
      addMember,
      removeMember,
      makeThisMainClient,
      addObjectToCanvas,
      notifyJoin,
    });
  };

  const handleNamePopupClose = () => {
    setShowNamePopup(false);
  };

  const handleSharePopupClose = () => {
    setShowSharePopup(false);
  };

  const handleNameSubmit = () => {
    if (!isMainClient) {
      onNameSubmitInSubClient();
    } else {
      const updatedClientWithName = client;
      updatedClientWithName.name = name;
      setClient(updatedClientWithName);
    }
    handleNamePopupClose();
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

  const onAddPath = (path) => {
    messageApi.sendObject({
      client: clientRef.current,
      newObject: path,
      members: membersRef.current,
    });
  };

  const addObjectToCanvas = (newObject) => {
    canvasRef.current.addObject(newObject);
  };

  /**
   * Membership
   */

  const addMember = ({ identifier, name }) => {
    return membersApi.addMember({
      members: membersRef.current,
      setMembers,
      identifier,
      name,
    });
  };

  const removeMember = (memberToRemove) => {
    return membersApi.removeMember({
      members: membersRef.current,
      setMembers,
      memberToRemove,
    });
  };

  const makeThisMainClient = () => {
    return membersApi.makeThisMainClient({
      members: membersRef.current,
      setMembers,
      client,
      setIsMainClient,
      setClient,
      setLoading,
      createClient: nknApi.createClient,
    });
  };

  /**
   * Notification
   */

  const notifyJoin = ({ name }) => {
    toast({
      title: `${name} just joined`,
      duration: 2000,
      isClosable: true,
      status: "success",
    });
  };

  return (
    <>
      <style>{style({ loading })}</style>
      {loading ? <Loading /> : null}
      <div className="canvas-outer">
        <div>{isMainClient ? "This is main client" : null}</div>
        <div>{JSON.stringify(members)}</div>
        <button
          onClick={() => {
            if (!isMainClient) {
              messageApi.sendLeaveMessage({ client, members });
            } else {
              console.log("Here");
              messageApi.makeSubClientMainClient({
                client,
                members,
              });
            }
          }}
        >
          Leave
        </button>
        <NamePopup
          name={name}
          setName={setName}
          shareLink={shareLink}
          show={showNamePopup}
          onClose={handleNamePopupClose}
          onNameSubmit={handleNameSubmit}
        />
        {!loading && isMainClient && !showNamePopup ? (
          <SharePopup
            show={showSharePopup}
            onClose={handleSharePopupClose}
            shareLink={shareLink}
          />
        ) : null}
        <Drawingboard onAddPath={onAddPath} ref={canvasRef} />
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
