import nkn from "nkn-sdk";
import { v4 as uuidv4 } from "uuid";

export const createClient = ({ id: seed, isMainClient } = {}) => {
  const client = new nkn.Client({
    seed,
    identifier: !isMainClient ? uuidv4() : undefined,
  });
  return client;
};

export default {
  createClient,
};
