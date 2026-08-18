export type KnowledgeNode = {
  id: string;
  title: string;
  type: string;
  description: string;
};

export type KnowledgeEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type KnowledgeGraph = {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
};

export type NewKnowledgeNodeInput = {
  title: string;
  type: string;
  description: string;
};

export type NewKnowledgeEdgeInput = {
  source: string;
  target: string;
  label: string;
};

// Form values mirror NewKnowledgeNodeInput; kept distinct so form wiring can evolve independently.
export type KnowledgeFormValues = NewKnowledgeNodeInput;

export const DEFAULT_GRAPH: KnowledgeGraph = {
  nodes: [
    {
      id: "pde",
      title: "PDE",
      type: "Goal",
      description: "Personalized development environment for daily work.",
    },
    {
      id: "neovim",
      title: "Neovim",
      type: "Tool",
      description: "A terminal-first editor that is highly configurable.",
    },
    {
      id: "plugins",
      title: "Plugins",
      type: "Skill",
      description:
        "Extending Neovim through plugin ecosystems and configuration.",
    },
    {
      id: "lazy-nvim",
      title: "Lazy.nvim",
      type: "Concept",
      description: "A plugin manager that simplifies Neovim setup and updates.",
    },
  ],
  edges: [
    { id: "edge-1", source: "pde", target: "neovim", label: "requires" },
    { id: "edge-2", source: "neovim", target: "plugins", label: "needs" },
    { id: "edge-3", source: "plugins", target: "lazy-nvim", label: "uses" },
  ],
};
