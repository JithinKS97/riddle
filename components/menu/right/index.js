import { HStack, Button } from "@chakra-ui/react";
import OptionsMenu from "../common/OptionsMenu";
import { FaRegFile, FaShareAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { fileOptions } from "../../../constant/menu";

const LeftSection = (props) => {
  const { onShareIconClick, onMembersIconClick } = props;

  return (
    <HStack p="3">
      <OptionsMenu defaultIcon={<FaRegFile />} options={fileOptions} />
      <Button onClick={onShareIconClick}>
        <FaShareAlt />
      </Button>
      <Button onClick={onMembersIconClick}>
        <BsFillPeopleFill />
      </Button>
    </HStack>
  );
};

export default LeftSection;
