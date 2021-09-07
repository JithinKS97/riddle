const Members = ({ members }) => {
  if (!members) {
    return null;
  }

  return (
    <ol>
      {members.map((member) => (
        <li>{member}</li>
      ))}
    </ol>
  );
};

export default Members;
