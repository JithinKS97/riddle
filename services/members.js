const addMember = ({ members, setMembers, identifier, name }) => {
  console.log("Inside add member");
  console.log({ members, setMembers, identifier, name });

  const memberAlreadyNotPresent = !members
    .map((member) => member.identifier)
    .includes(identifier);

  if (memberAlreadyNotPresent && identifier) {
    const updatedList = [...members, { identifier, name }];
    setMembers(updatedList);
    return updatedList;
  }
};

const removeMember = ({ members, setMembers, memberToRemove }) => {
  const updatedMembers = members
    .filter((member) => member.identifier !== "")
    .map((member) => {
      if (member.identifier === memberToRemove) {
        return {
          ...member,
          identifier: "",
        };
      } else {
        return member;
      }
    });
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
}) => {
  console.log("Make this main client");
  const myIndentifier = client.identifier;
  const updatedMembers = members
    .filter((member) => member.identifier !== "")
    .map((member) => {
      if (member.identifier === myIndentifier) {
        return {
          ...member,
          identifier: "",
        };
      } else {
        return member;
      }
    });
  console.log(updatedMembers);
  setMembers(updatedMembers);
  setIsMainClient(true);
  const seed = client.getSeed();
  const updatedClient = createClient({ id: seed, isMainClient: true });
  setLoading(true);
  setClient(updatedClient);
  updatedClient.onConnect(() => {
    setLoading(false);
  });
};

export default {
  addMember,
  removeMember,
  makeThisMainClient,
};
