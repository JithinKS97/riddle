import nkn from "nkn-sdk";
import { v4 as uuidv4 } from "uuid";

export const createClient = ({ id: seed, isMainClient } = {}) => {
  const client = new nkn.Client({
    seed,
    identifier: !isMainClient ? uuidv4() : undefined,
  });
  console.log(client);
  return client;
};

export const isValidId = (id) => {
  try {
    new nkn.Client({
      seed: id,
    });
    return true;
  } catch (err) {
    return false;
  }
};

export default {
  createClient,
};
