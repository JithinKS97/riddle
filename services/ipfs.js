const IPFS = require("ipfs-core");

export const addToIPFS = async (content) => {
  const ipfs = await IPFS.create({ repo: "ok" + Math.random() });
  const result = await ipfs.add(content);
  return result.path;
};
