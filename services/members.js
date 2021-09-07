const addMember = ({ members, setMembers, newMember }) => {
  if (!members.includes(newMember) && newMember) {
    const updatedList = [...members, newMember];
    setMembers(updatedList);
    return updatedList;
  }
};

export default {
  addMember,
};
