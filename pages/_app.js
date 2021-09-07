import * as React from "react";
import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../context/App";
import { useBeforeUnload } from "react-use";

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);
  const [isMainClient, setIsMainClient] = useState(false);
  const [members, setMembers] = useState([]);

  const value = {
    client,
    setClient,
    isMainClient,
    setIsMainClient,
    members,
    setMembers,
  };

  return (
    <ChakraProvider>
      <AppProvider value={value}>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
