import { useState, useEffect } from "react";

export default function useCallAgents() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(
      "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR"
    )
      .then((response) => response.json())
      .then((data) => {
        setAgents(data.data);
        setIsLoading(false);
      });
  }, []);
  return { agents, isLoading };
}
