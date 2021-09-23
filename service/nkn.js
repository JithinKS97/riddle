import nkn from "nkn-sdk";

export const createClient = () => {
  const client = new nkn.Client();
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
