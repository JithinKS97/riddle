const JOIN = "JOIN";

/**
 * Sending
 */

const join = async ({ client }) => {
  try {
    const address = client.getPublicKey();
    const content = {
      identifier: client.identifier,
    };
    const message = generateMessage(JOIN, content);
    const res = await sendMessage({ address, message, client });
    console.log("Received join acknowledge message and canvas data");
    return res;
  } catch (err) {
    console.log("Join request failed");
  }
};

const sendMessage = async ({ address, message, client }) => {
  console.log(`Sending message...`);
  console.log(JSON.parse(message));
  console.log(`to address ${address}`);

  const res = await client.send(address, message);
  return res;
};

/**
 * Receiving
 */

function handleReception(props) {
  const { client } = props;

  if (isMain(client)) {
    return handleMessageForMain(props);
  }
}

function handleMessageForMain(props) {
  const { message, getCanvasAsJSON, addMember } = props;
  let payload = JSON.parse(message.payload);
  const type = payload.type;

  switch (type) {
    case JOIN:
      const identifier = payload.content.identifier;
      const currentMembers = addMember(identifier);
      const content = getCanvasAsJSON();
      return content;
  }
}

/**
 * Utilities
 */

const generateMessage = (type, content) => {
  const message = {
    type,
    content,
  };
  const stringifiedMessage = JSON.stringify(message);
  return stringifiedMessage;
};

const isMain = (client) => {
  return client.identifier === "";
};

export default {
  join,
  handleReception,
};
