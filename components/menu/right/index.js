import { HStack, Button } from "@chakra-ui/react";
import OptionsMenu from "../common/OptionsMenu";
import { FaShareAlt } from "react-icons/fa";
import { GoFileMedia } from "react-icons/go";
import { BsFillPeopleFill } from "react-icons/bs";
import { fileOptions } from "../../../constant/menu";
import { useRef } from "react";
import { BiExit } from "react-icons/bi";
import { addToIPFS } from "../../../services/ipfs";
import IPFSSave from "../../popups/IPFSSave";
import { useState } from "react";

const RightSection = (props) => {
  const {
    onShareIconClick,
    onMembersIconClick,
    saveJson,
    addObjectsInCanvasAndUpdateOthers,
    exit,
    getCanvasAsJSON,
  } = props;
  const fileUploadRef = useRef();
  const [showIPFSSave, setShowIPFSSave] = useState(false);
  const [saveContentId, setSaveContentId] = useState("");

  const handleClick = async (e) => {
    if (e.label === "Save") {
      saveJson();
    } else if (e.label === "Load") {
      uploadFile();
    } else if (e.label === "Save to IPFS") {
      await saveToIPFS();
    }
  };

  const uploadFile = () => {
    fileUploadRef.current.click();
  };

  const handleFileUploadFinish = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    function onRead() {
      saveToFabric(reader.result);
    }
    reader.onload = onRead;
    reader.readAsBinaryString(file);
    fileUploadRef.current.value = null;
  };

  const saveToFabric = (result) => {
    try {
      const fabricData = JSON.parse(result);
      const fabricJSON = JSON.parse(fabricData.json);
      addObjectsInCanvasAndUpdateOthers(fabricJSON.objects);
    } catch (e) {
      console.log(e);
    }
  };

  const saveToIPFS = async () => {
    setShowIPFSSave(true);
    const json = getCanvasAsJSON();
    const cid = await addToIPFS(json);
    setSaveContentId(cid);
  };

  const handleClose = () => {
    setShowIPFSSave(false);
    setSaveContentId("");
  };

  return (
    <>
      <IPFSSave onClose={handleClose} cid={saveContentId} show={showIPFSSave} />
      <HStack p="3">
        <input
          style={{ position: "absolute", visibility: "hidden" }}
          type="file"
          ref={fileUploadRef}
          onChange={handleFileUploadFinish}
        />
        <OptionsMenu
          onClick={handleClick}
          defaultIcon={<GoFileMedia />}
          options={fileOptions}
        />
        <Button onClick={onShareIconClick}>
          <FaShareAlt />
        </Button>
        <Button onClick={onMembersIconClick}>
          <BsFillPeopleFill />
        </Button>
        <Button onClick={exit}>
          <BiExit />
        </Button>
      </HStack>
    </>
  );
};

export default RightSection;
