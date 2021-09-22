import { stringToBrightColour } from "./util";

const addMember = ({ members, setMembers, identifier, name }) => {
  const memberAlreadyNotPresent = !members
    .map((member) => member.identifier)
    .includes(identifier);

  if (memberAlreadyNotPresent && identifier) {
    const updatedList = [
      ...members,
      {
        identifier,
        name,
        color: stringToBrightColour(name),
      },
    ];
    setMembers(updatedList);
    return updatedList;
  }
};

const makeTheMemberMainClient = ({
  members,
  setMembers,
  memberToMakeMainClient,
  hostAddress,
  changeShareUrl,
  fillShareLink,
}) => {
  const filterOutMainClient = (member) => member.identifier !== hostAddress;

  const updatedMembers = members.filter(filterOutMainClient);

  changeShareUrl(memberToMakeMainClient);
  fillShareLink(memberToMakeMainClient);

  setMembers(updatedMembers);
};

const removeSubClientMember = ({ members, setMembers, memberToRemove }) => {
  const updatedMembers = members.filter(
    (member) => member.identifier !== memberToRemove
  );

  setMembers(updatedMembers);
};

const makeThisMainClient = ({
  members,
  setMembers,
  setIsHost,
  hostAddress,
  fillShareLink,
  client,
  changeShareUrl,
}) => {
  const publicKey = client.getPublicKey();

  const filterOutCurrentMainClient = (member) =>
    member.identifier !== hostAddress;

  const updatedMembers = members.filter(filterOutCurrentMainClient);

  setMembers(updatedMembers);
  setIsHost(true);

  changeShareUrl(publicKey);
  fillShareLink(publicKey);
};

const getName = ({ id, members }) => {
  const member = members.find((member) => member.identifier === id);
  return member.name;
};

const getMemberById = ({ id, members }) => {
  const member = members.find((member) => member.identifier === id);
  return member;
};

export default {
  addMember,
  makeThisMainClient,
  removeSubClientMember,
  makeTheMemberMainClient,
  getName,
  getMemberById,
};
