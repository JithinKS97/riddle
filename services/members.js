const addMember = ({ members, setMembers, identifier, name }) => {
  const memberAlreadyNotPresent = !members
    .map((member) => member.identifier)
    .includes(identifier);

  if (memberAlreadyNotPresent && identifier) {
    const updatedList = [...members, { identifier, name }];
    setMembers(updatedList);
    return updatedList;
  }
};

const makeTheMemberMainClient = ({
  members,
  setMembers,
  memberToMakeMainClient,
}) => {
  const filterOutMainClient = (member) => member.identifier !== "";

  const makeTheIdOfNewMainClientAsEmpty = (member) => {
    if (member.identifier === memberToMakeMainClient) {
      return {
        ...member,
        identifier: "",
      };
    } else {
      return member;
    }
  };

  const updatedMembers = members
    .filter(filterOutMainClient)
    .map(makeTheIdOfNewMainClientAsEmpty);

  setMembers(updatedMembers);
};

const removeSubClientMember = ({ members, setMembers, memberToRemove }) => {
  const updatedMembers = members.filter(
    (member) => member.identifier !== memberToRemove
  );

  setMembers(updatedMembers);
};

const makeThisMainClient = ({
  client,
  members,
  setMembers,
  setIsMainClient,
  setClient,
  setLoading,
  createClient,
  handleSharePopupClose,
}) => {
  const myIndentifier = client.identifier;

  const filterOutCurrentMainClient = (member) => member.identifier !== "";
  const makeTheIdentifierOfThisClientAsEmptyString = (member) => {
    if (member.identifier === myIndentifier) {
      return {
        ...member,
        identifier: "",
      };
    } else {
      return member;
    }
  };

  const updatedMembers = members
    .filter(filterOutCurrentMainClient)
    .map(makeTheIdentifierOfThisClientAsEmptyString);

  setMembers(updatedMembers);
  setIsMainClient(true);

  const seed = client.getSeed();
  const updatedClient = createClient({ id: seed, isMainClient: true });

  setLoading(true);
  setClient(updatedClient);

  updatedClient.onConnect(() => {
    handleSharePopupClose(false);
    setLoading(false);
  });
};

export default {
  addMember,
  makeThisMainClient,
  removeSubClientMember,
  makeTheMemberMainClient,
};
