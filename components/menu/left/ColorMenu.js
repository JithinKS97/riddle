import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { TwitterPicker } from "react-color";

const colors = [
  "#000000",
  "#FF6900",
  "#FCB900",
  "#00D084",
  "#8ED1FC",
  "#0693E3",
  "#EB144C",
  "#F78DA7",
  "#9900EF",
  "transparent",
];

const ColorMenu = (props) => {
  const { onChange, onMenuClick, onClose } = props;

  return (
    <Menu onClose={onClose}>
      <MenuButton onClick={onMenuClick} marginLeft="4" as={Button}>
        {props.children}
      </MenuButton>
      <MenuList
        backgroundColor="transparent"
        className="colorpicker"
        border="none"
        boxShadow="none"
        marginTop="3"
      >
        <TwitterPicker onChange={onChange} colors={colors} />
      </MenuList>
    </Menu>
  );
};

export default ColorMenu;
