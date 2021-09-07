const JOIN = "JOIN";
const JOIN_ACKNOWLEDGE = "JOIN_ACKNOWLEDGE";

/**
 * Sending
 */

function join({ client }) {
  const address = client.getPublicKey();
  const content = {
    identifier: client.identifier,
  };
  const message = generateMessage(JOIN, content);
  sendMessage({ address, message, client });
}

const sendMessage = ({ address, message, client }) => {
  console.log(`Sending message...`);
  console.log(JSON.parse(message));
  console.log(`to address ${address}`);

  client.send(address, message);
};

/**
 * Receiving
 */

function handleMessageReceive({ message, client }) {
  let payload = JSON.parse(message.payload);
  if (isMain(client)) {
    handleMessageForMain({ client, payload });
  }
}

function handleMessageForMain({ client, payload }) {
  const content = payload.content;
  const type = payload.type;

  switch (type) {
    case JOIN:
      console.log("Allow them to join...");
      console.log(content);
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
