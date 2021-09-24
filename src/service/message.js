import {
  JOIN,
  JOIN_ACKNOWLEDGE,
  REMOVE_MEMBER,
  ADD_MEMBER,
  MAKE_SUBCLIENT_MAINCLIENT,
  ADD_OBJECTS,
  MAKE_THE_MEMBER_MAINCLIENT,
  REMOVE_OBJECTS,
  MODIFY_OBJECTS,
} from "../constant/message";

/**
 * Functions related to joining and leaving
 */

const join = async ({ client, goBack, hostAddress }) => {
  try {
    // My public is my address
    const myAddress = client.getPublicKey();

    const content = {
      identifier: myAddress,
      name: client.name,
    };

    const message = generateMessage(JOIN, content);

    let res = await sendMessage({
      address: hostAddress,
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
    alert("Unable to join room");
    goBack();
  }
};

const sendLeaveMessageForSubClient = ({ client, members }) => {
  const publicKey = client.getPublicKey();

  const content = {
    identifier: publicKey,
  };

  const filterOutThisClient = (memberIdentifier) =>
    memberIdentifier !== publicKey;

  // To everyone including the main client,
  const recipients = members
    .map((member) => member.identifier)
    .filter(filterOutThisClient);

  const message = generateMessage(REMOVE_MEMBER, content);

  client.send(recipients, message);
};

const makeSubClientMainClient = ({ client, members }) => {
  if (members.length === 0) {
    return;
  }

  const publicKey = client.getPublicKey();

  const filterOutMainClient = (member) => member.identifier !== publicKey;

  const memberToMakeMainClientObject = members.filter(filterOutMainClient)[0];

  if (!memberToMakeMainClientObject) {
    return;
  }

  const memberToMakeMainClient = memberToMakeMainClientObject.identifier;

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

  client.send(memberToMakeMainClient, message);
};

const makeTheMemberMainClient = ({
  memberToMakeMainClient,
  client,
  identifiersOfMembersToBeUpdated,
}) => {
  const content = {
    identifier: memberToMakeMainClient,
  };

  const message = generateMessage(MAKE_THE_MEMBER_MAINCLIENT, content);
  sendMessage({ address: identifiersOfMembersToBeUpdated, message, client });
};

/**
 * Canvas functions
 */

const addObjectsToOthersCanvas = ({
  client,
  objects,
  members,
  hostAddress,
  isHost,
  clear,
}) => {
  if (!client) {
    return;
  }

  const content = {
    objects,
    clear,
  };

  const message = generateMessage(ADD_OBJECTS, content);
  sendCanvasUpdate({ client, members, message, hostAddress, isHost });
};

const updateObjectsInOthersCanvas = ({ client, updatedValues, members }) => {
  if (!client) {
    return;
  }
  const content = {
    updatedValues,
  };
  const message = generateMessage(MODIFY_OBJECTS, content);
  sendCanvasUpdate({ client, members, message });
};

const removeObjectsFromOthersCanvas = ({ client, ids, members }) => {
  const content = {
    ids,
  };

  const message = generateMessage(REMOVE_OBJECTS, content);
  sendCanvasUpdate({ client, members, message });
};

const sendCanvasUpdate = ({ client, members, message }) => {
  const filterOutThisClient = (member) =>
    member.identifier !== client.getPublicKey();

  members = members.filter(filterOutThisClient);

  members = members.map((member) => member.identifier);

  if (members.length === 0) {
    return;
  }

  sendMessage({ address: members, message, client });
};

/**
 * Receiving
 */

function handleReception(props) {
  const { message, isHost } = props;

  const payload = JSON.parse(message.payload);
  const src = message.src;

  if (isHost) {
    return handleMessageForHost({ ...props, payload, src });
  } else {
    return handleMessageForSub({ ...props, payload, src });
  }
}

function handleMessageForHost(props) {
  const {
    payload,
    getCanvasAsJSON,
    addMember,
    client,
    removeSubClientMember,
    addObjectsToCanvas,
    notifyJoin,
    notifyLeave,
    removeObjects,
    src,
    hostAddress,
    updateObjectsInCanvas,
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

      // // When the main client receive JOIN request, it should send
      // // back the list of members already joined and the current state of the canvs
      const content = {
        fabricJSON: getCanvasAsJSON(),
        currentMembers,
      };

      const message = generateMessage(JOIN_ACKNOWLEDGE, content);

      const filterOutMainClientAndTheSender = (memberIdentifier) =>
        memberIdentifier !== identifier && memberIdentifier !== hostAddress;

      // // These are the current members who should be notified of the new member
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
      const memberToRemove = payload.content.identiValuesfier;
      notifyLeave(memberToRemove);
      removeSubClientMember(memberToRemove);
      break;
    case ADD_OBJECTS:
      const objects = payload.content.objects;
      const clear = payload.content.clear;
      addObjectsToCanvas(objects, src, clear);
      break;
    case MODIFY_OBJECTS:
      const updatedValues = payload.content.updatedValues;
      updateObjectsInCanvas(updatedValues, src);
      break;
    case REMOVE_OBJECTS:
      const ids = payload.content.ids;
      removeObjects(ids, src);
  }
}

function handleMessageForSub(props) {
  const {
    payload,
    addMember,
    makeThisMainClient,
    addObjectsToCanvas,
    notifyJoin,
    makeTheMemberMainClient,
    removeSubClientMember,
    notifyLeave,
    removeObjects,
    src,
    hostAddress,
    notifyHostChange,
    updateObjectsInCanvas,
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
      notifyLeave(memberToRemove);
      removeSubClientMember(memberToRemove);
      break;
    case MAKE_SUBCLIENT_MAINCLIENT:
      notifyLeave(hostAddress);
      setTimeout(() => {
        notifyHostChange();
      }, 2000);
      makeThisMainClient();
      break;
    case MAKE_THE_MEMBER_MAINCLIENT:
      const memberToMakeMainClient = payload.content.identifier;
      notifyLeave(hostAddress);
      makeTheMemberMainClient(memberToMakeMainClient);
      break;
    case ADD_OBJECTS:
      const objects = payload.content.objects;
      const clear = payload.content.clear;
      addObjectsToCanvas(objects, src, clear);
      break;
    case MODIFY_OBJECTS:
      const updatedValues = payload.content.updatedValues;
      updateObjectsInCanvas(updatedValues, src);
      break;
    case REMOVE_OBJECTS:
      const ids = payload.content.ids;
      removeObjects(ids, src);
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

  const message = generateMessage(ADD_MEMBER, content);
  sendMessage({ address: membersToNotify, message, client });
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
  try {
    console.log("");
    console.log(`Sending message...`);
    console.log(JSON.parse(message));
    console.log(`to address ${address}`);
    console.log("");

    const res = await client.send(address, message);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export default {
  join,
  handleReception,
  sendLeaveMessageForSubClient,
  makeSubClientMainClient,
  addObjectsToOthersCanvas,
  removeObjectsFromOthersCanvas,
  updateObjectsInOthersCanvas,
};
