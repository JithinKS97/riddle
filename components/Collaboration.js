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
import MembersPopup from "./popups/MembersPopup";
import TopMenu from "./menu/TopMenu";
import { Button, Box } from "@chakra-ui/react";

function Collaboration() {
  const context = useContext(AppContext);
  const { client, setClient, members, setMembers, isHost, setIsHost } = context;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const membersRef = useRef([]);
  const clientRef = useRef(null);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [name, setName] = useState("");
  const toast = useToast();
  const isHostRef = useRef(isHost);
  const { hostAddress } = router.query;

  /////////////////////////////////////////////////
  ///// Refistering events related to nkn client///
  ////////////////////////////////////////////////

  useEffect(() => {
    clientRef.current = client;
    if (!client) {
      return;
    }
    client.onMessage(handleMessage);
    return () => client.onMessage(null);
  }, [client]);

  const handleMessage = (message) => {
    return messageApi.handleReception({
      message,
      client,
      getCanvasAsJSON,
      addMember,
      makeThisMainClient,
      addObjectsToCanvas,
      notifyJoin,
      removeSubClientMember,
      makeTheMemberMainClient,
      notifyLeave,
      isHost: isHostRef.current,
      hostAddress,
      removeObjects: canvasRef.current.removeObjects,
    });
  };

  useEffect(() => {
    return registerLeave();
  }, [client]);

  const registerLeave = () => {
    window.onbeforeunload = () => {
      if (!isHostRef.current) {
        messageApi.sendLeaveMessageForSubClient({
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
    return () => (window.onbeforeunload = null);
  };

  //////////////////////////////////////////////
  //////////// Updating references ////////////
  ////////////////////////////////////////////

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  useEffect(() => {
    if (!hostAddress) {
      return;
    }
    fillShareLink();
    if (isHostRef.current) {
      client.onConnect(() => {
        setShowSharePopup(true);
        setLoading(false);
      });
    }
  }, [hostAddress]);

  const fillShareLink = () => {
    const id = hostAddress;
    setShareLink(id);
  };

  const onNameSubmitInSubClient = () => {
    setLoading(true);
    const newClient = nknApi.createClient();
    newClient.name = name;
    setClient(newClient);
    newClient.onConnect(getCurrentState(newClient));
  };

  const getCurrentState = () => async () => {
    const { fabricJSON, currentMembers } = await messageApi.join({
      client: clientRef.current,
      name,
      goBack,
      hostAddress,
    });
    setCanvas(fabricJSON);
    setMembers(currentMembers);
    setLoading(false);
  };

  const handleNamePopupClose = () => {
    setShowNamePopup(false);
  };

  const handleSharePopupClose = () => {
    setShowSharePopup(false);
  };

  const handleNameSubmit = () => {
    if (!isHostRef.current) {
      onNameSubmitInSubClient();
    } else {
      const updatedClientWithName = clientRef.current;
      updatedClientWithName.name = name;
      setClient(updatedClientWithName);
      setMembers([{ name, identifier: hostAddress }]);
    }
    handleNamePopupClose();
  };

  const onMembersIconClick = () => {
    setShowMembersPopup(true);
  };

  const onShareIconClick = () => {
    setShowSharePopup(true);
  };

  const onMembersPopupCloseClick = () => {
    setShowMembersPopup(false);
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

  const onAddObjects = (objects) => {
    messageApi.addObjectsToOthersCanvas({
      client: clientRef.current,
      objects,
      members: membersRef.current,
      hostAddress,
    });
  };

  const onObjectsRemove = (ids) => {
    messageApi.removeObjectsFromOthersCanvas({
      client: clientRef.current,
      ids,
      members: membersRef.current,
    });
  };

  const addObjectsToCanvas = (objects, fromAddress) => {
    const nameOfTheAdder = membersApi.getName({
      id: fromAddress,
      members: membersRef.current,
      isHost: isHostRef.current,
      hostAddress,
    });
    canvasRef.current.addObjects(objects, nameOfTheAdder);
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

  const removeSubClientMember = (memberToRemove) => {
    return membersApi.removeSubClientMember({
      members: membersRef.current,
      setMembers,
      memberToRemove,
    });
  };

  const makeTheMemberMainClient = (memberToMakeMainClient) => {
    return membersApi.makeTheMemberMainClient({
      members: membersRef.current,
      setMembers,
      memberToMakeMainClient,
      hostAddress,
      changeRouteShallow,
      fillShareLink,
    });
  };

  const makeThisMainClient = () => {
    return membersApi.makeThisMainClient({
      members: membersRef.current,
      setMembers,
      client: clientRef.current,
      setClient,
      setLoading,
      createClient: nknApi.createClient,
      handleSharePopupClose,
      hostAddress,
      setIsHost,
      changeRouteShallow,
      fillShareLink,
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

  const notifyLeave = (memberToLeave) => {
    const member = membersRef.current.find(
      (member) => member.identifier === memberToLeave
    );
    const name = member.name;
    toast({
      title: `${name} just left`,
      duration: 2000,
      isClosable: true,
      status: "warning",
    });
  };

  const goBack = () => {
    setLoading(false);
    router.push(`/`);
  };

  const resetCanvasZoomAndPan = () => {
    if (canvasRef.current) {
      canvasRef.current.resetZoomAndPan();
    }
  };

  const changeRouteShallow = (hostAddress) => {
    console.log("Shallow route");
    router.push(`/drawingboard/${hostAddress}`, undefined, { shallow: true });
  };

  return (
    <>
      <style>{style({ loading })}</style>
      {loading ? <Loading /> : null}
      <TopMenu
        onShareIconClick={onShareIconClick}
        onMembersIconClick={onMembersIconClick}
        resetZoomAndPan={resetCanvasZoomAndPan}
      />
      <div className="canvas-outer">
        <MembersPopup
          members={members}
          onClose={onMembersPopupCloseClick}
          show={showMembersPopup}
        />
        <NamePopup
          name={name}
          setName={setName}
          shareLink={shareLink}
          show={showNamePopup}
          onClose={handleNamePopupClose}
          onNameSubmit={handleNameSubmit}
        />
        <SharePopup
          show={showSharePopup && !showNamePopup}
          onClose={handleSharePopupClose}
          shareLink={shareLink}
        />
        <Drawingboard
          onAddObjects={onAddObjects}
          onObjectsRemove={onObjectsRemove}
          ref={canvasRef}
        />
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
