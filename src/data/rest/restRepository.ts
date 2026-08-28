import axios from "axios";
import type {
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
  NewKnowledgeEdgeInput,
  NewKnowledgeNodeInput,
} from "../types";
import type { KatRepository } from "../KatRepository";

// Speaks the route convention used by the shared life-helper Express server:
// GET  /get_items/<itemType>?params=<encoded JSON>
// POST /add/<itemType>            (server responds 200 with no body)
// POST /update/<itemType>
// The server's item-type allow-list must include "nodes" and "edges" for this to work.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:3000";

const client = axios.create({ baseURL: API_BASE_URL });

function buildParamsQuery(params: Record<string, unknown>): string {
  return `?params=${encodeURIComponent(JSON.stringify(params))}`;
}

function makeNodeId(title: string): string {
  return `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
}

export const restRepository: KatRepository = {
  async getGraph(): Promise<KnowledgeGraph> {
    const [nodesResponse, edgesResponse] = await Promise.all([
      client.get<KnowledgeNode[]>(`/get_items/nodes${buildParamsQuery({})}`),
      client.get<KnowledgeEdge[]>(`/get_items/edges${buildParamsQuery({})}`),
    ]);
    return { nodes: nodesResponse.data, edges: edgesResponse.data };
  },

  async addNode(input: NewKnowledgeNodeInput): Promise<KnowledgeNode> {
    const node: KnowledgeNode = { id: makeNodeId(input.title), ...input };
    // The server's add route returns only a status code, so the client-built record is the source of truth.
    await client.post("/add/nodes", node);
    return node;
  },

  async addEdge(input: NewKnowledgeEdgeInput): Promise<KnowledgeEdge> {
    const edge: KnowledgeEdge = { id: `edge-${Date.now()}`, ...input };
    await client.post("/add/edges", edge);
    return edge;
  },
};
