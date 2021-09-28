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
            bgColor: "#4299E1",
            _disabled: {
              bgColor: "#1A365D",
            },
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
