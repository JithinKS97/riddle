import { HStack, Button } from "@chakra-ui/react";
import OptionsMenu from "../common/OptionsMenu";
import { FaRegFile, FaShareAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { fileOptions } from "../../../constant/menu";
import { useRef } from "react";
import { BiExit } from "react-icons/bi";

const RightSection = (props) => {
  const {
    onShareIconClick,
    onMembersIconClick,
    saveJson,
    addObjectsInCanvasAndUpdateOthers,
    exit,
  } = props;
  const fileUploadRef = useRef();

  const handleClick = (e) => {
    if (e.label === "Save") {
      saveJson();
    } else if (e.label === "Load") {
      uploadFile();
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

  return (
    <HStack p="3">
      <input
        style={{ position: "absolute", visibility: "hidden" }}
        type="file"
        ref={fileUploadRef}
        onChange={handleFileUploadFinish}
      />
      <OptionsMenu
        onClick={handleClick}
        defaultIcon={<FaRegFile />}
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
  );
};

export default RightSection;
