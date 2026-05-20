// Multi-agent orchestrator - routes requests to appropriate agent
export type AgentType = "support" | "medical" | "farm" | "finance";

export async function routeToAgent(agent: AgentType, input: any) {
  switch (agent) {
    case "support":
      return { agent: "support", handled: true };
    case "medical":
      return { agent: "medical", handled: true };
    case "farm":
      return { agent: "farm", handled: true };
    case "finance":
      return { agent: "finance", handled: true };
    default:
      throw new Error(`Unknown agent: ${agent}`);
  }
}
