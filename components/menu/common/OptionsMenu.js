import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";

const OptionsMenu = (props) => {
  const { options, selectedOption, defaultIcon, onClick } = props;

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
      <MenuButton as={Button}>{getIconToShowInMenu()}</MenuButton>
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
    <MenuItem onClick={handleClick(option)} textAlign="center">
      <Box marginRight="8">{option.label}</Box>
      <Box padding="3" position="absolute" right="0">
        <option.icon />
      </Box>
    </MenuItem>
  ));
};

export default OptionsMenu;
