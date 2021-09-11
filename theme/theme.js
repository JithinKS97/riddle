import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {},
      variants: {
        primary: {
          bg: "#1A365D",
          color: "white",
          _hover: {
            backgroundColor: "#4299E1",
          },
        },
        menuButton: {
          bg: "white",
          color: "black",
          borderRadius: "full",
          _hover: {
            backgroundColor: "#c8c8c8",
            color: "white",
          },
          border: "1px solid grey",
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
