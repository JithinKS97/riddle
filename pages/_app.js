import * as React from "react";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "../context/App";
import theme from "../theme/theme";
import { Pencil } from "../constant/mode";

function MyApp({ Component, pageProps }) {
  const [client, setClient] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMode, setSelectedMode] = useState(Pencil);
  const [brushSize, setBrushSize] = useState(5);
  const [selectedColor, setSelectedColor] = useState("black");
  const [hostAddress, setHostAddress] = useState("");
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
    selectedColor,
    setSelectedColor,
    hostAddress,
    setHostAddress,
    isHost,
    setIsHost,
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
