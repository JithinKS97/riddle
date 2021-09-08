import {
  JOIN,
  JOIN_ACKNOWLEDGE,
  REMOVE_MEMBER,
  ADD_MEMBER,
  MAKE_SUBCLIENT_MAINCLIENT,
} from "../constant/message";

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

const sendLeaveMessage = ({ client, members }) => {
  const publicKey = client.getPublicKey();

  const content = {
    identifier: client.identifier,
  };

  const recipients = members
    .filter((member) => member != client.identifier)
    .map((id) => `${id}.${publicKey}`);

  recipients.push(publicKey);

  const message = generateMessage(REMOVE_MEMBER, content);

  client.send(recipients, message);
};

const makeSubClientMainClient = ({ client, members }) => {
  if (members.length === 0) {
    return;
  }
  const memberToMakeSubClient = members[0];
  const publicKey = client.getPublicKey();

  const message = generateMessage(MAKE_SUBCLIENT_MAINCLIENT);

  const membersToUpdate = members.filter(
    (member) => member != memberToMakeSubClient
  );

  removeMemberFromOthers({
    memberToRemove: memberToMakeSubClient,
    client,
    membersToUpdate,
  });

  client.send(`${memberToMakeSubClient}.${publicKey}`, message);
};

const removeMemberFromOthers = ({
  memberToRemove,
  client,
  membersToUpdate,
}) => {
  const publicKey = client.getPublicKey();

  const content = {
    identifier: memberToRemove,
  };

  const recipients = membersToUpdate.map((id) => `${id}.${publicKey}`);

  const message = generateMessage(REMOVE_MEMBER, content);
  client.send(recipients, message);
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
  const { payload, getCanvasAsJSON, addMember, client, removeMember } = props;
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
    case REMOVE_MEMBER:
      const memberToRemove = payload.content.identifier;
      removeMember(memberToRemove);
      break;
  }
}

function handleMessageForSub(props) {
  const { payload, addMember, removeMember, makeThisMainClient } = props;

  const type = payload.type;

  switch (type) {
    case ADD_MEMBER:
      const newMember = payload.content.newMember;
      addMember(newMember);
      break;
    case REMOVE_MEMBER:
      const memberToRemove = payload.content.identifier;
      removeMember(memberToRemove);
      break;
    case MAKE_SUBCLIENT_MAINCLIENT:
      makeThisMainClient();
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
  sendLeaveMessage,
  makeSubClientMainClient,
};
