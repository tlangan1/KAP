import "./App.css";
import { useQuery } from "@tanstack/react-query";
import KnapForm from "./Knapform";

type Todo = { id: number; title: string };

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5",
  );
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <>
      <header>
        <nav></nav>
      </header>
      <section id="center">
        <div>
          <h1>KNAP</h1>
          <KnapForm />
        </div>
      </section>
      <h1>Todos</h1>
      <ul>
        {data?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>

      <footer></footer>
    </>
  );
}

export default App;
