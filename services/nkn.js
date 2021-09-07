import nkn from "nkn-sdk";
import { v4 as uuidv4 } from "uuid";

export const createClient = ({ id: seed, isSubClient } = {}) => {
  console.log(isSubClient);
  const multiclient = new nkn.MultiClient({
    numSubClients: 2,
    originalClient: true,
    seed,
    identifier: isSubClient ? uuidv4() : undefined,
  });
  return multiclient;
};
