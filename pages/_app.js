import * as React from "react";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../context/App";
import { BRUSH } from "../constant/mode";
import theme from "../theme/theme";

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);
  const [isMainClient, setIsMainClient] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedTool, setSelectedTool] = useState(BRUSH);

  const value = {
    client,
    setClient,
    isMainClient,
    setIsMainClient,
    members,
    setMembers,
    selectedTool,
    setSelectedTool,
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
