import Drawingboard from "./Drawingboard";
import { useEffect, useContext } from "react";
import { AppContext } from ".././context/App";
import { useRouter } from "next/router";
import { createClient } from "../services/nkn";

function Collaboration() {
  const context = useContext(AppContext);
  const { client, setClient } = context;
  const isSubClient = client === null;
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    if (isSubClient) {
      const newClient = createClient({ id, isSubClient });
      console.log("Client created...");
      console.log(newClient);
      setClient(newClient);
    }
  }, [id]);

  const postConnect = () => {};

  return <Drawingboard />;
}

export default Collaboration;
