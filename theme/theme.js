import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _hover: {
          boxShadow: "none",
        },
        _active: {
          boxShadow: "none",
        },
        _focus: {
          boxShadow: "none",
        },
      },
      variants: {
        primary: {
          bg: "#1A365D",
          color: "white",
          _hover: {
            backgroundColor: "#4299E1",
          },
        },
      },
      _focus: {
        boxShadow: "none",
      },
    },
  },
});

export default theme;
