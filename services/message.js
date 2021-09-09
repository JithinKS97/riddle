import {
  JOIN,
  JOIN_ACKNOWLEDGE,
  REMOVE_MEMBER,
  ADD_MEMBER,
  MAKE_SUBCLIENT_MAINCLIENT,
  ADD_OBJECT,
  MAKE_THE_MEMBER_MAINCLIENT,
} from "../constant/message";

/**
 * Functions related to joining and leaving
 */

const join = async ({ client }) => {
  try {
    // public key is the address of the main client
    const mainClientAddress = client.getPublicKey();
    const content = {
      identifier: client.identifier,
      name: client.name,
    };

    const message = generateMessage(JOIN, content);

    console.log(message);

    let res = await sendMessage({
      address: mainClientAddress,
      message,
      client,
    });
    console.log("Received join acknowledge message and canvas data");

    res = JSON.parse(res);

    // State of the canvas
    const fabricJSON = res.content.fabricJSON;
    const currentMembers = res.content.currentMembers;

    return { fabricJSON, currentMembers };
  } catch (err) {
    console.log("Join request failed");
  }
};

const sendLeaveMessageForSubClient = ({ client, members }) => {
  const publicKey = client.getPublicKey();

  const content = {
    identifier: client.identifier,
  };

  const filterOutMainClientAndTheSender = (memberIdentifier) =>
    memberIdentifier !== client.identifier && memberIdentifier !== "";

  // To everyone including the main client,
  const recipients = members
    .map((member) => member.identifier)
    .filter(filterOutMainClientAndTheSender)
    .map((id) => `${id}.${publicKey}`);

  // Adding the main client address
  recipients.push(publicKey);

  const message = generateMessage(REMOVE_MEMBER, content);

  client.send(recipients, message);
};

const makeSubClientMainClient = ({ client, members }) => {
  if (members.length === 0) {
    return;
  }

  const filterOutMainClient = (member) => member.identifier !== "";

  const memberToMakeMainClient =
    members.filter(filterOutMainClient)[0].identifier;

  const publicKey = client.getPublicKey();

  const identifiersOfMembersToBeUpdated = members
    .filter(filterOutMainClient)
    .map((member) => member.identifier)
    .filter((memberIdentifier) => memberIdentifier != memberToMakeMainClient);

  makeTheMemberMainClient({
    memberToMakeMainClient,
    client,
    identifiersOfMembersToBeUpdated,
  });

  const message = generateMessage(MAKE_SUBCLIENT_MAINCLIENT);

  client.send(`${memberToMakeMainClient}.${publicKey}`, message);
};

const makeTheMemberMainClient = ({
  memberToMakeMainClient,
  client,
  identifiersOfMembersToBeUpdated,
}) => {
  const publicKey = client.getPublicKey();

  const content = {
    identifier: memberToMakeMainClient,
  };

  const recipients = identifiersOfMembersToBeUpdated.map(
    (id) => `${id}.${publicKey}`
  );

  const message = generateMessage(MAKE_THE_MEMBER_MAINCLIENT, content);
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

  const filterOutThisClientAndMainClient = (member) =>
    member.identifier !== client.identifier && member.identifier !== "";

  if (!isMain(client)) {
    members = members
      .filter(filterOutThisClientAndMainClient)
      .map((member) => `${member.identifier}.${publicKey}`);

    // Add main client address
    members.push(publicKey);
  } else {
    members.filter((member) => member.identifier !== "");
    members = members.map((member) => `${member.identifier}.${publicKey}`);
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
    removeSubClientMember,
    addObjectToCanvas,
    notifyJoin,
  } = props;
  const type = payload.type;

  switch (type) {
    case JOIN:
      // Identifier and name of the client who wants to join the room
      const identifier = payload.content.identifier;
      const name = payload.content.name;

      notifyJoin({ name });

      // Add the member to the list of members
      const currentMembers = addMember({ identifier, name });

      // When the main client receive JOIN request, it should send
      // back the list of members already joined and the current state of the canvs
      const content = {
        fabricJSON: getCanvasAsJSON(),
        currentMembers,
      };

      const message = generateMessage(JOIN_ACKNOWLEDGE, content);

      const filterOutMainClientAndTheSender = (memberIdentifier) =>
        memberIdentifier !== identifier && memberIdentifier !== "";

      // These are the current members who should be notified of the new member
      const membersToNotify = currentMembers
        .map((member) => member.identifier)
        .filter(filterOutMainClientAndTheSender);

      // To all the members, send the identifier and name of the new member
      sentMemberUpdatesToAll({
        client,
        newMember: identifier,
        membersToNotify,
        newMemberName: name,
      });

      return message;
    case REMOVE_MEMBER:
      // The member has to be removed from the members list
      const memberToRemove = payload.content.identifier;
      removeSubClientMember(memberToRemove);
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
    makeThisMainClient,
    addObjectToCanvas,
    notifyJoin,
    makeTheMemberMainClient,
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
      // The member has to be removed from the members list
      const memberToRemove = payload.content.identifier;
      removeSubClientMember(memberToRemove);
      break;
    case MAKE_SUBCLIENT_MAINCLIENT:
      makeThisMainClient();
      break;
    case MAKE_THE_MEMBER_MAINCLIENT:
      const memberToMakeMainClient = payload.content.identifier;
      makeTheMemberMainClient(memberToMakeMainClient);
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
  sendLeaveMessageForSubClient,
  makeSubClientMainClient,
  sendObject,
};
