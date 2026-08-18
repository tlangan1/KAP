## Create a dual backend capability

### prompt

- I need an app that can run without a data server as well as one that can. One version should use IndexedDB to store the data and another should use middleware that stores the data in a relational database. The core of the app should be architected so that it is indifferent to the source of the data.

### Response

- Now the IndexedDB implementation (serverless mode):

- Now the REST implementation using axios (talks to the relational-database middleware):

- Now the selector that picks the backend at runtime via an env var, keeping the app core indifferent to the source:

### Interjected Prompt

- Note, do not build the middle ware. I will be leveraging the Express Server implementation located at /media/tlangan/ext4-xhd/computer-science/original-applications/life-helper-docs-and-apps/express-server

### Interjected Response

- I found the existing Express server's routing convention (`/get_items/<type>?params=...`, `/add/<type>`, `/update/<type>`, HTTPS-only). I'll align the REST repository to that convention instead of inventing my own API shape, and won't touch the server project itself.

- ✅ Data layer refactored — storage-agnostic architecture

- I did not touch the Express server project as instructed. Instead, I built a repository abstraction so the KNAP app core is indifferent to where data comes from, and aligned the REST implementation to that server's existing route conventions.

- New structure
- `types.ts` — shared domain types (`KnowledgeNode`, `KnowledgeEdge`, `KnowledgeGraph`) and the default seed graph
- `KnapRepository.ts` — the interface the app depends on: `getGraph`, `addNode`, `addEdge`
- `indexedDbRepository.ts` — serverless mode, persists via the browser's native IndexedDB, self-seeds on first run
- `restRepository.ts` — talks to your existing server at `/media/.../life-helper-docs-and-apps/express-server` using its `GET /get_items/<type>?params=...` and `POST /add/<type>` conventions
- `repository.ts` — picks the backend at runtime via `VITE_DATA_BACKEND` (`"indexedDB"` default, or `"rest"`)
- `vite-env.d.ts` — typed env vars (`VITE_DATA_BACKEND`, `VITE_API_BASE_URL`)

- `App.tsx` and `Knapform.tsx` now depend only on `repository` and the shared types — no `localStorage` or IndexedDB code lives in the component tree anymore.

#### One thing you'll need to do server-side

- That server's `itemType` allow-list (in `server.js`'s `get_items` switch) currently only permits `objectives, goals, tasks, notes, thoughts, user_logins, search, ...`. To use REST mode, you'll need to add `nodes` and `edges` to that allow-list and to `db.js`'s schema/queries — I did not make that change since you asked me not to touch the middleware.

#### Verification

- `npm run build` succeeded: “✓ built in 161ms”, 123 modules transformed with no type errors.

- To switch modes, set in a `.env.local`:

```
VITE_DATA_BACKEND=rest
VITE_API_BASE_URL=https://<your-server-host>:<port>
```

- (defaults to IndexedDB mode if unset).
