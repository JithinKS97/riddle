import {
  JOIN,
  JOIN_ACKNOWLEDGE,
  REMOVE_MEMBER,
  ADD_MEMBER,
  MAKE_SUBCLIENT_MAINCLIENT,
  ADD_OBJECT,
} from "../constant/message";

/**
 * Functions related to joining and leaving
 */

const join = async ({ client }) => {
  try {
    const address = client.getPublicKey();
    const content = {
      identifier: client.identifier,
      name: client.name,
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
    .map((member) => member.identifier)
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
  const memberToMakeSubClient = members.filter(
    (member) => member.identifier !== ""
  )[0].identifier;
  const publicKey = client.getPublicKey();

  const membersToUpdate = members
    .map((member) => member.identifier)
    .filter((member) => member != memberToMakeSubClient);

  removeMemberFromOthers({
    memberToRemove: memberToMakeSubClient,
    client,
    membersToUpdate,
  });

  const message = generateMessage(MAKE_SUBCLIENT_MAINCLIENT);

  console.log(`${memberToMakeSubClient}.${publicKey}`);

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
 * Canvas functions
 */

const sendObject = ({ client, newObject, members }) => {
  const content = {
    newObject,
  };

  const message = generateMessage(ADD_OBJECT, content);

  const publicKey = client.getPublicKey();

  if (!isMain(client)) {
    members = members.filter((member) => member !== client.identifier);
    members = members.map((member) => `${member}.${publicKey}`);
    members.push(publicKey);
  } else {
    members = members.map((member) => `${member}.${publicKey}`);
  }

  client.send(members, message);
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
  const {
    payload,
    getCanvasAsJSON,
    addMember,
    client,
    removeMember,
    addObjectToCanvas,
    notifyJoin,
  } = props;
  const type = payload.type;

  switch (type) {
    case JOIN:
      const identifier = payload.content.identifier;
      const name = payload.content.name;

      notifyJoin({ name });

      const currentMembers = addMember({ identifier, name });

      const content = {
        fabricJSON: getCanvasAsJSON(),
        currentMembers,
      };

      const message = generateMessage(JOIN_ACKNOWLEDGE, content);

      const membersToNotify = currentMembers
        .map((member) => member.identifier)
        .filter(
          (memberIdentifier) =>
            memberIdentifier !== identifier && memberIdentifier !== ""
        );

      sentMemberUpdatesToAll({
        client,
        newMember: identifier,
        membersToNotify,
        newMemberName: name,
      });

      return message;
    case REMOVE_MEMBER:
      const memberToRemove = payload.content.identifier;
      removeMember(memberToRemove);
      break;
    case ADD_OBJECT:
      const newObject = payload.content.newObject;
      addObjectToCanvas(newObject);
  }
}

function handleMessageForSub(props) {
  const {
    payload,
    addMember,
    removeMember,
    makeThisMainClient,
    addObjectToCanvas,
    notifyJoin,
  } = props;

  const type = payload.type;

  switch (type) {
    case ADD_MEMBER:
      const newMember = payload.content.newMember;
      const newMemberName = payload.content.newMemberName;
      notifyJoin({ name: newMemberName });
      addMember({ identifier: newMember, name: newMemberName });
      break;
    case REMOVE_MEMBER:
      const memberToRemove = payload.content.identifier;
      removeMember(memberToRemove);
      break;
    case MAKE_SUBCLIENT_MAINCLIENT:
      makeThisMainClient();
      break;
    case ADD_OBJECT:
      const newObject = payload.content.newObject;
      addObjectToCanvas(newObject);
  }
}

const sentMemberUpdatesToAll = ({
  client,
  newMember,
  membersToNotify,
  newMemberName,
}) => {
  const content = {
    newMember,
    newMemberName,
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
  sendObject,
};
