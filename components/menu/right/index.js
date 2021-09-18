import { HStack, Button } from "@chakra-ui/react";
import OptionsMenu from "../common/OptionsMenu";
import { BiExport, BiImport } from "react-icons/bi";
import { FaRegFile, FaShareAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";

const LeftSection = () => {
  return (
    <HStack p="3">
      <OptionsMenu defaultIcon={<FaRegFile />} options={fileOptions} />
      <Button>
        <FaShareAlt />
      </Button>
      <Button>
        <BsFillPeopleFill />
      </Button>
    </HStack>
  );
};

const fileOptions = [
  {
    label: "Export",
    icon: BiExport,
  },
  {
    label: "Import",
    icon: BiImport,
  },
];

export default LeftSection;
