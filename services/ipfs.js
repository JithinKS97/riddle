const IPFS = require("ipfs-core");

export const addToIPFS = async (content) => {
  const ipfs = await IPFS.create({ repo: "ok" + Math.random() });
  const result = await ipfs.add(content);
  return result.path;
};

export const loadFromIPFS = async (contentId) => {
  try {
    const node = await IPFS.create({ repo: "ok" + Math.random() });
    const stream = node.cat(contentId);
    let data = "";
    for await (const chunk of stream) {
      data += chunk.toString();
    }
    return data;
  } catch (err) {
    return;
  }
};
