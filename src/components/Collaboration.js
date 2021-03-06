import Drawingboard from "./drawingboard/index";
import { useEffect, useContext, useState } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import { useRef } from "react";
import nknApi from "../service/nkn";
import messageApi from "../service/message";
import membersApi from "../service/members";
import Loading from "./Loading";
import NamePopup from "./popups/NamePopup";
import SharePopup from "./popups/SharePopup";
import { useToast } from "@chakra-ui/react";
import MembersPopup from "./popups/MembersPopup";
import TopMenu from "./menu/TopMenu";
import { saveFile } from "../service/canvas/fabric";

function Collaboration() {
  const context = useContext(AppContext);
  const {
    client,
    setClient,
    members,
    setMembers,
    isHost,
    setIsHost,
    loading,
    setLoading,
  } = context;
  const router = useRouter();
  const canvasRef = useRef(null);
  const membersRef = useRef([]);
  const clientRef = useRef(null);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const [name, setName] = useState("");
  const toast = useToast();
  const isHostRef = useRef(isHost);
  const { hostAddress } = router.query;
  const hostAddressRef = useRef(hostAddress);
  const toastRef = useRef();

  /////////////////////////////////////////////////
  ///// Registering events related to nkn client///
  ////////////////////////////////////////////////

  useEffect(() => {
    if (!isHostRef.current) {
      showConnectingToast();
      const newClient = nknApi.createClient();
      setClient(newClient);
      setLoading(true);
      setShowNamePopup(false);
      newClient.onConnect(() => {
        setLoading(false);
        toast.close(toastRef.current);
        setShowNamePopup(true);
      });
    }
    return () => {
      setIsHost(false);
      leaveRoom();
    };
  }, []);

  useEffect(() => {
    clientRef.current = client;
    if (!client) {
      return;
    }
    client.onMessage(handleMessage);
    return () => client.onMessage(null);
  }, [client]);

  const showConnectingToast = () => {
    toastRef.current = toast({
      title: `Connecting...`,
      isClosable: false,
      duration: null,
      position: "top",
    });
  };

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
      hostAddress: hostAddressRef.current,
      removeObjects,
      notifyHostChange,
      updateObjectsInCanvas,
    });
  };

  const removeObjects = (ids, fromAddress) => {
    const deleter = membersApi.getMemberById({
      id: fromAddress,
      members: membersRef.current,
    });
    canvasRef.current.removeObjects(ids, deleter);
  };

  useEffect(() => {
    return registerLeave();
  }, [client]);

  const registerLeave = () => {
    window.onbeforeunload = leaveRoom;
    return () => (window.onbeforeunload = null);
  };

  const leaveRoom = () => {
    if (!clientRef.current) {
      return;
    }
    console.log(clientRef.current);
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
    hostAddressRef.current = hostAddress;
  }, [hostAddress]);

  const onNameSubmitInSubClient = () => {
    setLoading(true);
    getCurrentState();
  };

  const getCurrentState = async () => {
    const { fabricJSON, currentMembers } = await messageApi.join({
      client: clientRef.current,
      name,
      goBack,
      hostAddress: hostAddressRef.current,
    });
    notifyJoined();
    console.log(fabricJSON, currentMembers);
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
      setShowSharePopup(true);
      const updatedClientWithName = clientRef.current;
      updatedClientWithName.name = name;
      setClient(updatedClientWithName);
      addMember({ name, identifier: hostAddressRef.current });
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
    const fabricObjectsJSON = canvasRef.current.getCanvasAsJSON();
    return JSON.stringify(fabricObjectsJSON);
  };

  const setCanvas = (fabricJSON) => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.loadFromJSON(fabricJSON, function () {
      canvasRef.current.renderAll();
    });
  };

  const onAddObjects = (objects, clear) => {
    messageApi.addObjectsToOthersCanvas({
      client: clientRef.current,
      objects,
      members: membersRef.current,
      hostAddress: hostAddressRef.current,
      clear,
    });
  };

  const onUpdateObjects = (updatedValues) => {
    messageApi.updateObjectsInOthersCanvas({
      client: clientRef.current,
      updatedValues,
      members: membersRef.current,
    });
  };

  const onObjectsRemove = (ids) => {
    messageApi.removeObjectsFromOthersCanvas({
      client: clientRef.current,
      ids,
      members: membersRef.current,
    });
  };

  const addObjectsToCanvas = (objects, fromAddress, clear) => {
    const adder = membersApi.getMemberById({
      id: fromAddress,
      members: membersRef.current,
    });
    if (!clear) {
      canvasRef.current.addObjects(objects, adder);
    } else {
      canvasRef.current.clearAndAddObjects(objects);
    }
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
      hostAddress: hostAddressRef.current,
      changeShareUrl,
    });
  };

  const makeThisMainClient = () => {
    return membersApi.makeThisMainClient({
      members: membersRef.current,
      setMembers,
      client: clientRef.current,
      setClient,
      setLoading,
      handleSharePopupClose,
      hostAddress: hostAddressRef.current,
      setIsHost,
      changeShareUrl,
    });
  };

  /**
   * Notification
   */

  const notifyJoin = ({ name }) => {
    showToast(`${name} just joined`, "success");
  };

  const notifyLeave = (memberToLeave) => {
    const name = membersApi.getName({
      id: memberToLeave,
      members: membersRef.current,
    });
    showToast(`${name} just left`, "warning");
  };

  const notifyHostChange = () => {
    showToast(`You are the host now`, "success");
  };

  const notifyJoined = () => {
    showToast(`Joined the room`, "success");
  };

  const showToast = (title, status) => {
    toast({
      title,
      duration: 2000,
      isClosable: true,
      status,
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

  const resetCanvasZoom = () => {
    if (canvasRef.current) {
      canvasRef.current.resetZoom();
    }
  };

  const resetCanvasPan = () => {
    if (canvasRef.current) {
      canvasRef.current.resetPan();
    }
  };

  const changeShareUrl = (hostAddress) => {
    router.push(`/drawingboard?hostAddress=${hostAddress}`, undefined, {
      shallow: true,
    });
  };

  const saveJson = () => {
    saveFile({ json: getCanvasAsJSON() });
  };

  const addObjectsInCanvasAndUpdateOthers = (objects) => {
    canvasRef.current.clearAndAddObjects(objects, "");
    onAddObjects(objects, true);
  };

  const updateObjectsInCanvas = (updatedValues, fromAddress) => {
    const updater = membersApi.getMemberById({
      id: fromAddress,
      members: membersRef.current,
    });
    canvasRef.current.updateObjects(updatedValues, updater);
  };

  const exit = () => {
    if (confirm("Are you sure you want to leave the room?")) {
      leaveRoom();
      goBack();
    }
  };

  return (
    <>
      <style>{style({ loading })}</style>
      {loading ? <Loading /> : null}
      <TopMenu
        onShareIconClick={onShareIconClick}
        onMembersIconClick={onMembersIconClick}
        resetZoomAndPan={resetCanvasZoomAndPan}
        resetZoom={resetCanvasZoom}
        resetPan={resetCanvasPan}
        saveJson={saveJson}
        addObjectsInCanvasAndUpdateOthers={addObjectsInCanvasAndUpdateOthers}
        getCanvasAsJSON={getCanvasAsJSON}
        exit={exit}
      />
      <div className="canvas-outer">
        <MembersPopup
          members={members}
          onClose={onMembersPopupCloseClick}
          show={showMembersPopup}
          hostAddress={hostAddressRef.current}
        />
        <NamePopup
          name={name}
          setName={setName}
          show={showNamePopup}
          onClose={handleNamePopupClose}
          onNameSubmit={handleNameSubmit}
        />
        <SharePopup
          show={showSharePopup && !showNamePopup}
          onClose={handleSharePopupClose}
          shareLink={hostAddressRef.current}
        />
        <Drawingboard
          onAddObjects={onAddObjects}
          onObjectsRemove={onObjectsRemove}
          ref={canvasRef}
          onUpdateObjects={onUpdateObjects}
        />
      </div>
    </>
  );
}

const style = ({ loading }) => `
  .canvas-outer {
    visibility:${loading ? "hidden" : "visible"};
  }
  body {
    overflow-x:hidden;
    overflow-y:hidden;
  }
`;

export default Collaboration;
