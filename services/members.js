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
  setMembers(members.filter((member) => member.identifier !== memberToRemove));
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
  const myIndentifier = client.identifier;
  setMembers(members.filter((member) => member.identifier !== myIndentifier));
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
