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
    console.log(res);
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

function handleMessageReceive({ message, client }) {
  let payload = JSON.parse(message.payload);
  if (isMain(client)) {
    return handleMessageForMain({ client, payload });
  }
}

function handleMessageForMain({ client, payload }) {
  const content = payload.content;
  const type = payload.type;

  switch (type) {
    case JOIN:
      return "Joining request recieved";
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
  handleMessageReceive,
};
