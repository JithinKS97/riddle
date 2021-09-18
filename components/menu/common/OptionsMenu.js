import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";

const OptionsMenu = (props) => {
  const { options, selectedOption, defaultIcon, onClick, highlighted } = props;

  const getIconToShowInMenu = () => {
    if (defaultIcon) {
      return defaultIcon;
    } else if (selectedOption) {
      const selectedOptionObject = options.find(
        (option) => option.label === selectedOption
      );
      if (selectedOptionObject) {
        return <selectedOptionObject.icon />;
      }
    }
  };

  return (
    <Menu>
      <MenuButton
        _focus={{ boxShadow: "none" }}
        variant={highlighted ? "primary" : undefined}
        as={Button}
      >
        {getIconToShowInMenu()}
      </MenuButton>
      <MenuList p={0} minW="0">
        <MenuListItems onClick={onClick} options={options} />
      </MenuList>
    </Menu>
  );
};

const MenuListItems = (props) => {
  const { options, onClick } = props;

  const handleClick = (option) => (e) => {
    if (onClick) {
      onClick({ e, label: option.label });
    }
  };

  return options.map((option) => (
    <MenuItem
      display="flex"
      justifyContent="space-between"
      onClick={handleClick(option)}
    >
      <Box>{option.label}</Box>
      <Box marginLeft="5">
        <option.icon />
      </Box>
    </MenuItem>
  ));
};

export default OptionsMenu;
