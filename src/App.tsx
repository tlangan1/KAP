import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import KnapForm from "./Knapform";
import { repository } from "./data/repository";
import { DEFAULT_GRAPH } from "./data/types";
import type { KnowledgeFormValues } from "./data/types";
import "./App.css";

function App() {
  const queryClient = useQueryClient();
  const {
    data: graph = DEFAULT_GRAPH,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["knowledgeGraph"],
    queryFn: () => repository.getGraph(),
  });

  const [edgeDraft, setEdgeDraft] = useState({
    source: "",
    target: "",
    label: "requires",
  });

  const invalidateGraph = () =>
    queryClient.invalidateQueries({ queryKey: ["knowledgeGraph"] });

  const addNode = useMutation({
    mutationFn: (values: KnowledgeFormValues) => repository.addNode(values),
    onSuccess: invalidateGraph,
  });

  const addEdge = useMutation({
    mutationFn: (input: typeof edgeDraft) => repository.addEdge(input),
    onSuccess: invalidateGraph,
  });

  const handleAddNode = (values: KnowledgeFormValues) => {
    addNode.mutate(values);
  };

  const handleAddEdge = () => {
    if (
      !edgeDraft.source ||
      !edgeDraft.target ||
      edgeDraft.source === edgeDraft.target
    ) {
      return;
    }

    addEdge.mutate(edgeDraft);
    setEdgeDraft((previous) => ({
      ...previous,
      source: edgeDraft.target,
      target: "",
    }));
  };

  const positions = useMemo(() => {
    const columns = Math.max(1, Math.ceil(Math.sqrt(graph.nodes.length || 1)));

    return graph.nodes.reduce(
      (layout, node, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;

        layout[node.id] = {
          x: 120 + column * 220,
          y: 110 + row * 180,
        };

        return layout;
      },
      {} as Record<string, { x: number; y: number }>,
    );
  }, [graph.nodes]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Knowledge acquisition process</p>
          <h1>KNAP</h1>
        </div>
        <div className="status-pill">{graph.nodes.length} nodes</div>
      </header>

      <main className="app-layout">
        <section className="panel form-panel">
          <h2>Add a knowledge node</h2>
          <KnapForm onSubmitNode={handleAddNode} />

          <div className="relationship-panel">
            <h3>Connect learning steps</h3>

            <label>
              Source
              <select
                value={edgeDraft.source}
                onChange={(event) =>
                  setEdgeDraft((previous) => ({
                    ...previous,
                    source: event.target.value,
                  }))
                }
              >
                <option value="">Select source</option>
                {graph.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Target
              <select
                value={edgeDraft.target}
                onChange={(event) =>
                  setEdgeDraft((previous) => ({
                    ...previous,
                    target: event.target.value,
                  }))
                }
              >
                <option value="">Select target</option>
                {graph.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Relationship
              <input
                type="text"
                value={edgeDraft.label}
                onChange={(event) =>
                  setEdgeDraft((previous) => ({
                    ...previous,
                    label: event.target.value,
                  }))
                }
              />
            </label>

            <button
              type="button"
              onClick={handleAddEdge}
              className="primary-button"
            >
              Add relationship
            </button>
          </div>
        </section>

        <section className="panel graph-panel">
          <div className="panel-header">
            <h2>Knowledge graph</h2>
            <span>{graph.edges.length} connected steps</span>
          </div>

          {isLoading ? (
            <p className="empty-state">Loading graph…</p>
          ) : isError ? (
            <p className="empty-state">Unable to load your knowledge graph.</p>
          ) : (
            <svg viewBox="0 0 1000 620" role="img" aria-label="Knowledge graph">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="8"
                  refX="9"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L0,8 L9,4 z" fill="#8ac7ff" />
                </marker>
              </defs>

              {graph.edges.map((edge) => {
                const source = positions[edge.source];
                const target = positions[edge.target];

                if (!source || !target) {
                  return null;
                }

                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2 - 18;

                return (
                  <g key={edge.id}>
                    <line
                      x1={source.x + 110}
                      y1={source.y + 40}
                      x2={target.x + 110}
                      y2={target.y + 40}
                      stroke="#8ac7ff"
                      strokeWidth="2.5"
                      markerEnd="url(#arrowhead)"
                    />
                    <text x={midX + 10} y={midY} className="edge-label">
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {graph.nodes.map((node) => {
                const position = positions[node.id];
                if (!position) {
                  return null;
                }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${position.x}, ${position.y})`}
                  >
                    <rect
                      width="220"
                      height="90"
                      rx="18"
                      className="node-rect"
                    />
                    <text x="18" y="30" className="node-type">
                      {node.type}
                    </text>
                    <text x="18" y="55" className="node-title">
                      {node.title}
                    </text>
                    <text x="18" y="75" className="node-description">
                      {node.description}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </section>
      </main>

      <section className="panel summary-panel">
        <h2>Current learning map</h2>
        <div className="node-list">
          {graph.nodes.map((node) => (
            <article key={node.id} className="node-card">
              <div className="node-card-header">
                <span className="tag">{node.type}</span>
                <strong>{node.title}</strong>
              </div>
              <p>{node.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
