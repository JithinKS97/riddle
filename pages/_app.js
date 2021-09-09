import * as React from "react";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../context/App";
import { BRUSH } from "../constant/mode";
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
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);
  const [isMainClient, setIsMainClient] = useState(false);
  const [members, setMembers] = useState([]);
  const [mode, setMode] = useState(BRUSH);

  const value = {
    client,
    setClient,
    isMainClient,
    setIsMainClient,
    members,
    setMembers,
  };

  return (
    <ChakraProvider theme={theme}>
      <AppProvider value={value}>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
