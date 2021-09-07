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

export default {
  addMember,
  removeMember,
};
