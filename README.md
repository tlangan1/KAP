<h1 align="center">Knowledge Acquisition Process (KNAP) Application</h1>

## Application

- This application is designed track my knowledge acquisition efforts in the form of trees whose nodes represent specific types of knowledge. The goal is to be able to enter data to represent these "nodes" of knowledge and "directed edges" that represent how the acquisition of one type of knowledge led to another knowledge acquisition effort. Finally, I would like to be able to view these graphs in a visually appealing way.
- I need an app that can run without a data server as well as one that can. One version should use IndexedDB to store the data and another should use middleware that stores the data in a relational database. The core of the app should be architected so that it is indifferent to the source of the data.
- Example: I want to be able to create a PDE, personalized development environment, using Neovim. This leads to to needing to understand Neovim better. This also leads me to needing to understand how to install plugins in Neovim which leads me to needing to understand Lazy.nvim.

## Architecture

- React version 19 + TypeScript: Framework
- [React Hook Forms](https://react-hook-form.com/): Forms helper in React
- [TanStack](https://tanstack.com/): Specifically TanStack Query a data access helper for frameworks such as React.is
- [axios](https://github.com/axios/axios): A fetch wrapper that integrates well with TanStack Query.
- [d3js](https://d3js.org/): Visualization Tool recommended by Copilot to visualize the data

## React Hook Forms

### Installation

```bash
    npm install react-hook-form
```

## TanStack

### Installation

```bash
    # Core tools for TanStack Query
    npm i @tanstack/react-query
    # and optionally the dev tools
    npm install @tanstack/react-query-devtools
```

#### Eslint plugin for TanStack

[This](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query) was recommended by TanStack.

```bash
npm i -D @tanstack/eslint-plugin-query
```

- I applied the 'flat/recommended' ruleset but there is a stricter ruleset, 'flat/recommended-strict' that I may consider using in the future.

#### TanStack Dev Tools

- TanStack Query Dev Tools
  - **My Question to Copilot**: what do the optional dev tools provide?

  - **Copilot Response: Great question**. The optional package @tanstack/react-query-devtools gives you a live debugging panel for TanStack Query during development.

    What it provides:
    1. Query cache inspector: See every query key, cached data, timestamps, and staleness.
    2. Status visibility: Quickly spot loading, success, error, fetching, paused, and stale states.
    3. Manual controls: Refetch, invalidate, or remove queries directly from the panel.
    4. Mutation tracking: View mutation lifecycle, errors, retries, and current state.
    5. Performance insight: Understand when and why queries are re-running.

    Why it is optional:
    1. Not needed for production behavior.
    2. Mostly for debugging and learning your app’s server-state flow.
    3. Usually included only in development builds.

    Rule of thumb: install it early while building features, keep it dev-only when shipping.

### Use of TanStack

#### Setup Declarative wrapper

- Add the Query client/provider in main.tsx

  ```
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  ```

- Use these objects in the app

  ```
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30, // 30s
        refetchOnWindowFocus: false,
      },
    },
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
  );
  ```

#### Create and Use a Get Request

```
import { useQuery } from "@tanstack/react-query";

type Todo = { id: number; title: string };

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export default function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {data?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Create and Use a Get Request

## Axios

### Installation

```bash
    npm install axios
```

### Use

#### Interceptors

- See [this](https://blog.jobins.jp/axios-interceptors-with-practical-examples). In short, interceptors in axios are hooks to run functions just before a request is sent and right after a response is received.
