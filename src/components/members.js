const Members = ({ members }) => {
  if (!members) {
    return null;
  }

  return (
    <ol>
      {members.map((member) => (
        <li key={member}>{member}</li>
      ))}
    </ol>
  );
};

export default Members;
