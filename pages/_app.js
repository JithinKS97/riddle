import * as React from "react";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../context/App";
import theme from "../theme/theme";
import { PENCIL } from "../constant/mode";

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);
  const [isMainClient, setIsMainClient] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMode, setSelectedMode] = useState(PENCIL);
  const [brushSize, setBrushSize] = useState(5);
  const [selectedColor, setSelectedColor] = useState("black");

  const value = {
    client,
    setClient,
    isMainClient,
    setIsMainClient,
    members,
    setMembers,
    selectedMode,
    setSelectedMode,
    brushSize,
    setBrushSize,
    selectedColor,
    setSelectedColor,
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
