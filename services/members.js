const addMember = ({ members, setMembers, newMember }) => {
  if (!members.includes(newMember)) {
    setMembers([...members, newMember]);
  }
};

export default {
  addMember,
};
