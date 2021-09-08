const addMember = ({ members, setMembers, newMember }) => {
  if (!members.includes(newMember) && newMember) {
    const updatedList = [...members, newMember];
    setMembers(updatedList);
    return updatedList;
  }
};

const removeMember = ({ members, setMembers, memberToRemove }) => {
  setMembers(members.filter((member) => member !== memberToRemove));
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
  setMembers(members.filter((member) => member !== myIndentifier));
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
