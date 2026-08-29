import type {
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
  NewKnowledgeEdgeInput,
  NewKnowledgeNodeInput,
} from "./types";

// The rest of the app talks to this interface only, never to a specific storage technology.
export interface KatRepository {
  getGraph(): Promise<KnowledgeGraph>;
  addNode(input: NewKnowledgeNodeInput): Promise<KnowledgeNode>;
  addEdge(input: NewKnowledgeEdgeInput): Promise<KnowledgeEdge>;
}
