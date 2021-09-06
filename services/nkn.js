import nkn from "nkn-sdk";

export const createClient = () => {
  const multiclient = new nkn.MultiClient({
    numSubClients: 3,
    originalClient: false,
  });
  return multiclient;
};
