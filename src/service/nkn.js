import nkn from "nkn-sdk";

export const createClient = () => {
  let multiclient = new nkn.MultiClient({
    numSubClients: 4,
    originalClient: false,
  });
  return multiclient;
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
