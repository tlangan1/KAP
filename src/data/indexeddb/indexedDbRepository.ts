import { DEFAULT_GRAPH } from "../types";
import type {
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
  NewKnowledgeEdgeInput,
  NewKnowledgeNodeInput,
} from "../types";
import type { KnapRepository } from "../KnapRepository";

const DB_NAME = "knap-db";
const DB_VERSION = 1;
const NODES_STORE = "nodes";
const EDGES_STORE = "edges";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(NODES_STORE)) {
        db.createObjectStore(NODES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(EDGES_STORE)) {
        db.createObjectStore(EDGES_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAll<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

function put<T>(db: IDBDatabase, storeName: string, value: T): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

async function seedIfEmpty(db: IDBDatabase): Promise<void> {
  const existingNodes = await getAll<KnowledgeNode>(db, NODES_STORE);
  if (existingNodes.length > 0) {
    return;
  }

  const transaction = db.transaction([NODES_STORE, EDGES_STORE], "readwrite");
  const nodeStore = transaction.objectStore(NODES_STORE);
  const edgeStore = transaction.objectStore(EDGES_STORE);

  DEFAULT_GRAPH.nodes.forEach((node) => nodeStore.put(node));
  DEFAULT_GRAPH.edges.forEach((edge) => edgeStore.put(edge));

  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function withDatabase<T>(
  run: (db: IDBDatabase) => Promise<T>,
): Promise<T> {
  const db = await openDatabase();
  try {
    await seedIfEmpty(db);
    return await run(db);
  } finally {
    db.close();
  }
}

export const indexedDbRepository: KnapRepository = {
  async getGraph(): Promise<KnowledgeGraph> {
    return withDatabase(async (db) => {
      const [nodes, edges] = await Promise.all([
        getAll<KnowledgeNode>(db, NODES_STORE),
        getAll<KnowledgeEdge>(db, EDGES_STORE),
      ]);
      return { nodes, edges };
    });
  },

  async addNode(input: NewKnowledgeNodeInput): Promise<KnowledgeNode> {
    return withDatabase(async (db) => {
      const node: KnowledgeNode = {
        id: `${input.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        ...input,
      };
      return put(db, NODES_STORE, node);
    });
  },

  async addEdge(input: NewKnowledgeEdgeInput): Promise<KnowledgeEdge> {
    return withDatabase(async (db) => {
      const edge: KnowledgeEdge = {
        id: `edge-${Date.now()}`,
        ...input,
      };
      return put(db, EDGES_STORE, edge);
    });
  },
};
