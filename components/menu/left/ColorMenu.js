import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { TwitterPicker } from "react-color";

const colors = [
  "#000000",
  "#FF6900",
  "#FCB900",
  "#7BDCB5",
  "#00D084",
  "#8ED1FC",
  "#0693E3",
  "#EB144C",
  "#F78DA7",
  "#9900EF",
];

const ColorMenu = (props) => {
  const { onChange } = props;

  return (
    <Menu>
      <MenuButton marginLeft="4" as={Button}>
        {props.children}
      </MenuButton>
      <MenuList
        backgroundColor="transparent"
        className="colorpicker"
        border="none"
        boxShadow="none"
        marginTop="3"
      >
        <MenuItem
          _active={{ bg: "transparent" }}
          _focus={{ bg: "transparent" }}
        >
          <TwitterPicker onChange={onChange} colors={colors} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ColorMenu;
