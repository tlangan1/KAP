import type { KnapRepository } from "./KnapRepository";
import { indexedDbRepository } from "./indexeddb/indexedDbRepository";
import { restRepository } from "./rest/restRepository";

export type DataBackend = "indexeddb" | "rest";

// VITE_DATA_BACKEND selects storage at build/run time; defaults to serverless IndexedDB mode.
export const dataBackend: DataBackend =
  (import.meta.env.VITE_DATA_BACKEND as DataBackend | undefined) ?? "indexeddb";

const repositories: Record<DataBackend, KnapRepository> = {
  indexeddb: indexedDbRepository,
  rest: restRepository,
};

export const repository: KnapRepository = repositories[dataBackend];
