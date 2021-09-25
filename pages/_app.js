import * as React from "react";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../src/context/App";
import theme from "../src/theme/theme";
import { Pencil } from "../src/constant/mode";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMode, setSelectedMode] = useState(Pencil);
  const [brushSize, setBrushSize] = useState(5);
  const [selectedFill, setSelectedFill] = useState("#00D084");
  const [selectedStroke, setSelectedStroke] = useState("black");
  const [isHost, setIsHost] = useState(false);

  const value = {
    client,
    setClient,
    members,
    setMembers,
    selectedMode,
    setSelectedMode,
    brushSize,
    setBrushSize,
    isHost,
    setIsHost,
    selectedFill,
    setSelectedFill,
    selectedStroke,
    setSelectedStroke,
  };

  return (
    <ChakraProvider theme={theme}>
      <AppProvider value={value}>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
