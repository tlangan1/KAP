import type { KatRepository } from "./KatRepository";
import { indexedDbRepository } from "./indexeddb/indexedDbRepository";
import { restRepository } from "./rest/restRepository";

export type DataBackend = "indexeddb" | "rest";

// VITE_DATA_BACKEND selects storage at build/run time; defaults to serverless IndexedDB mode.
// A .env.local file can be used to set VITE_DATA_BACKEND at build/run time.
// The value of VITE_DATA_BACKEND should be either "indexeddb" or "rest". For example,
// VITE_DATA_BACKEND="indexeddb" or VITE_DATA_BACKEND="rest".
// Currently no file exists so the default value "indexeddb" will be used.
export const dataBackend: DataBackend =
  (import.meta.env.VITE_DATA_BACKEND as DataBackend | undefined) ?? "indexeddb";

const repositories: Record<DataBackend, KatRepository> = {
  indexeddb: indexedDbRepository,
  rest: restRepository,
};

export const repository: KatRepository = repositories[dataBackend];
