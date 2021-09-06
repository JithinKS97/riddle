import * as React from "react";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../context/App";

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);

  const value = {
    client,
    setClient,
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
