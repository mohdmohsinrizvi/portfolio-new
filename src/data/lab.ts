export type Experiment = {
  id: string;
  index: string;
  title: string;
  domain: string;
  blurb: string;
  status: "interactive" | "write-up" | "prototype";
  statusLabel: string;
  body: string[];
  tech: string[];
  href?: string;
  repo?: string;
};

export const labDomains = [
  "All",
  "Algorithms",
  "AI / ML",
  "IoT",
  "Interactive Web",
] as const;

export type LabDomain = (typeof labDomains)[number];

export const experiments: Experiment[] = [
  {
    id: "sorting-network",
    index: "01",
    title: "Sorting Network",
    domain: "Algorithms",
    status: "interactive",
    statusLabel: "Runs in this page",
    blurb:
      "Batcher's odd–and–even merge network, generated, animated and checked against random permutations.",
    body: [
      "A sorting network is a fixed sequence of compare–exchange operations. Unlike a sorting algorithm it does not branch on data: the comparators are wired in advance, so the same comparisons always run.",
      "This one is generated from Batcher's odd–even merge construction for 4, 8 or 16 wires. Generation is followed by an in-page verification pass that runs random permutations through the network and confirms every one comes out ordered — the same style of exhaustive/sampled checking used by the Algorithm Discovery Lab project.",
      "Watch the compare–exchange sweep wave through the levels, or step through it comparator by comparator.",
    ],
    tech: ["Batcher odd–even merge", "Compare–exchange model", "In-browser verification"],
    href: "#sorting-network",
  },
  {
    id: "graph-search",
    index: "02",
    title: "Graph Search",
    domain: "Algorithms",
    status: "interactive",
    statusLabel: "Runs in this page",
    blurb:
      "Breadth-first search and Dijkstra's algorithm over the same graph, visualised side by side as they expand.",
    body: [
      "Breadth-first search expands in rings by hop count; Dijkstra expands in order of accumulated cost. On a weighted graph the two frontiers look completely different, and the difference is easiest to understand when you can watch them.",
      "The graph here is generated deterministically from a seed, so the same seed always gives the same graph — which makes results reproducible rather than decorative.",
      "Toggle the algorithm, re-seed the graph, and compare which nodes each one touches before it reaches the target.",
    ],
    tech: ["BFS", "Dijkstra", "Deterministic graph generation"],
    href: "#graph-search",
  },
  {
    id: "entity-resolution",
    index: "03",
    title: "Entity Resolution",
    domain: "AI / ML",
    status: "interactive",
    statusLabel: "Runs in this page",
    blurb:
      "Normalise a pair of noisy business names, then watch three similarity signals combine into a match decision.",
    body: [
      "This is a deliberately small window into the pipeline built during the Amazon ML Challenge: normalise first, compare several signals rather than one, then apply a threshold.",
      "Edit either record and the normalised forms, token overlap, character n-gram similarity and the combined score update live. It is an educational reduction of the idea, not the competition system.",
      "The point it makes is the one that mattered most in the challenge — matching quality is mostly a normalisation problem wearing a similarity function's clothes.",
    ],
    tech: ["Normalisation", "Token overlap", "Character n-grams", "Thresholding"],
    href: "#entity-resolution",
  },
  {
    id: "algorithm-discovery",
    index: "04",
    title: "Discovery Pipeline",
    domain: "Algorithms",
    status: "write-up",
    statusLabel: "Repository",
    blurb:
      "Search → verify → benchmark → archive. The full pipeline behind the open-source research project.",
    body: [
      "Candidates are proposed by a search strategy (random, evolutionary or MAP-Elites), proven correct by exhaustive testing over small domains, measured under controlled benchmarking, and written into a persistent discovery archive.",
      "The whole pipeline is published as a Python package with a CLI and a small web dashboard.",
    ],
    tech: ["Python", "Evolutionary search", "MAP-Elites", "SQLite"],
    repo: "https://github.com/mohdmohsinrizvi/algorithm-discovery-engine",
  },
  {
    id: "csi-capture",
    index: "05",
    title: "Wi-Fi CSI Capture",
    domain: "IoT",
    status: "prototype",
    statusLabel: "Firmware",
    blurb:
      "ESP32 firmware that records channel-state information and streams frame statistics to a host over UDP.",
    body: [
      "The ESP-IDF CSI callback exposes how a Wi-Fi signal arrived at the receiver. The sketch registers that callback, keeps the hot path to counters and a handful of sampled values, and pushes batches out over UDP with sequence numbers so drops are visible.",
      "Frame classes — probes, beacons, management and data — are counted separately as a sanity check on what is actually being observed.",
    ],
    tech: ["ESP32", "esp_wifi", "UDP telemetry"],
  },
  {
    id: "signal-core",
    index: "06",
    title: "The Signal Core",
    domain: "Interactive Web",
    status: "interactive",
    statusLabel: "Running now",
    blurb:
      "The iridescent object at the centre of this site: simplex-displaced geometry with a thin-film style interference shader.",
    body: [
      "Geometry is displaced in the vertex shader by layered simplex noise, then shaded in the fragment shader with a fresnel-weighted interference palette. Nothing is downloaded — the whole object is generated at runtime from a sphere.",
      "It responds to pointer position with a spring-damped orientation, and to scroll by changing displacement amplitude and scale across chapters.",
      "Its render budget is governed by the graphics quality mode, and it is skipped entirely when WebGL is unavailable or reduced motion is requested.",
    ],
    tech: ["Three.js", "GLSL", "React Three Fiber", "Procedural geometry"],
  },
];

export const skillAxes = [
  {
    label: "Artificial Intelligence",
    body: "Pipelines that classify, match and prioritise — from entity resolution heuristics to complaint triage.",
    projects: ["amazon-ml-challenge", "saafai"],
  },
  {
    label: "Machine Learning",
    body: "Applied ML in competition and coursework settings, plus evolutionary search as a discovery method.",
    projects: ["amazon-ml-challenge", "algorithm-discovery-lab"],
  },
  {
    label: "Software Engineering",
    body: "Full applications with real state, storage and delivery — not isolated demos.",
    projects: ["bbdu-study-hub", "weather-big-data", "cardiosense"],
  },
  {
    label: "Algorithm Research",
    body: "Search, verification and benchmarking as a reproducible experimental pipeline.",
    projects: ["algorithm-discovery-lab"],
  },
  {
    label: "IoT / ESP32",
    body: "Firmware, BLE acquisition and telemetry — hardware that has to behave outside a demo.",
    projects: ["cardiosense", "esp32-csi", "esp32-mission-control"],
  },
  {
    label: "Cloud Computing",
    body: "Static delivery, hosted services and data platforms, with foundations-level cloud credentials.",
    projects: ["campusresq", "weather-big-data", "bbdu-study-hub"],
  },
  {
    label: "Interactive Web",
    body: "Interfaces where the interaction is the product — maps, simulations and this site.",
    projects: ["campusresq", "virtual-chemistry-lab"],
  },
];
