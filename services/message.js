import { JOIN, JOIN_ACKNOWLEDGE, ADD_MEMBER } from "../constant/App";

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
    let res = await sendMessage({ address, message, client });
    console.log("Received join acknowledge message and canvas data");

    res = JSON.parse(res);

    const fabricJSON = res.content.fabricJSON;
    const currentMembers = res.content.currentMembers;

    return { fabricJSON, currentMembers };
  } catch (err) {
    console.log("Join request failed");
  }
};

/**
 * Receiving
 */

function handleReception(props) {
  const { client, message } = props;

  let payload = JSON.parse(message.payload);

  if (isMain(client)) {
    return handleMessageForMain({ ...props, payload });
  } else {
    return handleMessageForSub({ ...props, payload });
  }
}

function handleMessageForMain(props) {
  const { payload, getCanvasAsJSON, addMember, client } = props;
  const type = payload.type;

  switch (type) {
    case JOIN:
      const identifier = payload.content.identifier;
      const currentMembers = addMember(identifier);
      const content = {
        fabricJSON: getCanvasAsJSON(),
        currentMembers,
      };

      const message = generateMessage(JOIN_ACKNOWLEDGE, content);

      const membersToNotify = currentMembers.filter(
        (member) => member !== identifier
      );
      sentMemberUpdatesToAll({
        client,
        newMember: identifier,
        membersToNotify,
      });

      return message;
  }
}

function handleMessageForSub(props) {
  const { payload, addMember } = props;

  const type = payload.type;
  const newMember = payload.content.newMember;

  switch (type) {
    case ADD_MEMBER:
      addMember(newMember);
  }
}

const sentMemberUpdatesToAll = ({ client, newMember, membersToNotify }) => {
  const content = {
    newMember,
  };
  const publicKey = client.getPublicKey();
  membersToNotify = membersToNotify.map((member) => `${member}.${publicKey}`);
  const message = generateMessage(ADD_MEMBER, content);
  client.send(membersToNotify, message);
};

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

const sendMessage = async ({ address, message, client }) => {
  console.log(`Sending message...`);
  console.log(JSON.parse(message));
  console.log(`to address ${address}`);

  const res = await client.send(address, message);
  return res;
};

export default {
  join,
  handleReception,
};
