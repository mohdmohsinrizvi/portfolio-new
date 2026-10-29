export type ProjectStatus =
  | "completed"
  | "deployed"
  | "research"
  | "challenge"
  | "prototype"
  | "in-progress"
  | "concept";

export type ProjectCategory =
  | "Full-Stack"
  | "AI / ML"
  | "Research"
  | "IoT"
  | "Interactive Web"
  | "Mobile";

export type CoverMotif =
  | "route"
  | "network"
  | "match"
  | "weather"
  | "index"
  | "wave"
  | "orbit"
  | "nodes"
  | "grid";

export type Cover = {
  motif: CoverMotif;
  palette: readonly [string, string, string];
  seed: number;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  /** `null` where no reliable year could be established. */
  year: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  statusLabel: string;
  featured: boolean;
  order: number;
  summary: string;
  role: string;
  contributions: string[];
  technologies: string[];
  cover: Cover;
  liveUrl?: string;
  repositoryUrl?: string;
  problem: string;
  approach: string;
  features: { title: string; body: string }[];
  architecture: { label: string; items: string[] }[];
  limitations: string[];
  results?: string;
  sources: { label: string; href?: string; note: string }[];
  related: string[];
};

export const statusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  deployed: "Deployed",
  research: "Research / ongoing",
  challenge: "Challenge entry",
  prototype: "Prototype",
  "in-progress": "In progress",
  concept: "Concept",
};

export const categories: ("All" | ProjectCategory)[] = [
  "All",
  "Full-Stack",
  "AI / ML",
  "Research",
  "IoT",
  "Interactive Web",
  "Mobile",
];

export const projects: Project[] = [
  {
    slug: "campusresq",
    title: "CampusResQ",
    subtitle: "Safety Exit",
    year: null,
    category: "Interactive Web",
    status: "deployed",
    statusLabel: "Deployed prototype",
    featured: true,
    order: 1,
    summary:
      "A browser-based emergency navigation system for mapped buildings and campuses — plotting a route from where you are to the nearest reachable exit.",
    role: "Engineering contribution — indoor mapping, routing interface and geospatial tooling.",
    contributions: [
      "Building and floor selection over a mapped venue",
      "Start / destination picking directly on the map",
      "Safe-route generation with hazard zones applied",
      "Turn-by-turn direction output and route download",
      "Simulation controls for blue-dot accuracy and update cadence",
    ],
    technologies: [
      "Mappedin JS SDK v6",
      "JavaScript",
      "Geospatial geometry",
      "Tom Select",
      "HTML / CSS",
      "Render (hosting)",
    ],
    cover: { motif: "route", palette: ["#0c1218", "#9287ea", "#d97757"], seed: 11 },
    liveUrl: "https://safety-exit.onrender.com/",
    problem:
      "Indoor navigation in an emergency is genuinely hard: outdoor maps stop at the door, floors stack on top of each other, and a blocked corridor changes the answer. Existing map products assume you are walking to a shop, not to an exit.",
    approach:
      "Build on a commercial indoor-map platform for the geometry, then own the layer that matters — start and destination resolution across floors, hazard-aware route selection, and a blue-dot simulation harness so routing behaviour can be tested without walking a building.",
    features: [
      {
        title: "Multi-building, multi-floor addressing",
        body: "Choose a building and floor, then pick a start and a destination point on the map itself rather than typing an address.",
      },
      {
        title: "Hazard zones and red zones",
        body: "Restricted areas can be declared as active hazard zones; routing treats them as blocked so the plotted path avoids them.",
      },
      {
        title: "Rescuer entry points",
        body: "Exterior access points can be selected as an origin so a responder approaching from outside gets an immediate route in.",
      },
      {
        title: "Blue-dot simulation harness",
        body: "Configurable jitter, positional accuracy and update interval let the navigation behaviour be exercised deterministically in the browser.",
      },
      {
        title: "Turn-by-turn output",
        body: "Generated routes expose step-by-step directions and can be downloaded for offline reference.",
      },
      {
        title: "Regional map environments",
        body: "Switchable map environments so routing can be demonstrated against venues in different regions.",
      },
    ],
    architecture: [
      {
        label: "Client",
        items: ["Mappedin JS SDK v6 map canvas", "Route + hazard state", "Turn-by-turn panel"],
      },
      { label: "Logic", items: ["Geospatial geometry helpers", "Floor-aware start/destination resolution"] },
      { label: "UI", items: ["Sidebar configuration", "Tom Select pickers", "Simulation controls"] },
      { label: "Delivery", items: ["Static bundle", "Render hosting"] },
    ],
    limitations: [
      "A prototype built on rented indoor-map data — it is not certified, audited or approved for operational emergency use.",
      "Routing quality depends entirely on the accuracy of the imported venue geometry.",
      "Hazard zones are declared manually rather than sensed from live building systems.",
      "The previously published repository URL no longer resolves, so only the live site is linked.",
    ],
    sources: [
      {
        label: "Live deployment",
        href: "https://safety-exit.onrender.com/",
        note: "Fetched and inspected — interface, features and Mappedin integration confirmed.",
      },
      {
        label: "Repository",
        note: "The previously shared repository URL (github.com/SHEIKH-NASIR/safety-exit) returned 404 at the time of writing, so no source link is published.",
      },
    ],
    related: ["weather-big-data", "cardiosense", "esp32-csi"],
  },

  {
    slug: "algorithm-discovery-lab",
    title: "Algorithm Discovery Lab",
    subtitle: "Automated search, verification & benchmarking",
    year: "2026",
    category: "Research",
    status: "research",
    statusLabel: "Ongoing research",
    featured: true,
    order: 2,
    summary:
      "An open-source platform that searches for small deterministic algorithms, exhaustively verifies correctness, benchmarks them under controlled conditions and archives what it finds.",
    role: "Independent research and engineering — design, implementation and experiment authoring.",
    contributions: [
      "Evolutionary, random and MAP-Elites search strategies",
      "Exhaustive correctness verification for small input domains",
      "Statistical benchmarking with warmup and repeated trials",
      "Persistent discovery archive backed by SQLite",
      "CLI and a small web dashboard for running experiments",
    ],
    technologies: ["Python", "Evolutionary algorithms", "MAP-Elites", "SQLite", "CLI", "Web dashboard"],
    cover: { motif: "network", palette: ["#0a0f14", "#4f9aa2", "#9287ea"], seed: 27 },
    repositoryUrl: "https://github.com/mohdmohsinrizvi/algorithm-discovery-engine",
    problem:
      "Established implementations of small algorithms are rarely re-examined. The question this project asks is narrow and testable: can automated search discover formally verified implementations that beat a stated baseline under clearly defined constraints?",
    approach:
      "Treat algorithm discovery as an experimental pipeline rather than a one-off trick. A search engine proposes candidates; a verifier proves them correct by exhaustive testing over small domains; a benchmarker measures them under controlled conditions with statistics; an archive stores everything as a reproducible artifact.",
    features: [
      {
        title: "Three search strategies",
        body: "Random search, evolutionary search, and MAP-Elites quality-diversity search all run against the same problem definition.",
      },
      {
        title: "Exhaustive verification",
        body: "For n ≤ 8, candidates are checked against every binary input rather than a sampled test set — no probabilistic correctness claims.",
      },
      {
        title: "Statistical benchmarking",
        body: "Warmup passes, multiple trials and summary statistics, so a speed claim is never based on a single noisy run.",
      },
      {
        title: "Discovery archive",
        body: "Verified candidates are stored as reproducible research artifacts with their configuration and seed, viewable through a 'museum' command.",
      },
      {
        title: "Plugin problem domains",
        body: "Search, verification and benchmarking are decoupled, so new problem families can be added without rewriting the pipeline.",
      },
    ],
    architecture: [
      { label: "Pipeline", items: ["Search engine", "Candidate generator", "Correctness verifier", "Cost analysis", "Benchmarking", "Discovery archive"] },
      { label: "Search", items: ["Random", "Evolutionary", "MAP-Elites (quality-diversity)"] },
      { label: "Interface", items: ["`adl` CLI", "Experiment YAML configs", "Web dashboard on port 8000"] },
      { label: "Storage", items: ["SQLite", "JSON candidate artifacts"] },
    ],
    limitations: [
      "Presented as an experimental research platform, not a published breakthrough.",
      "Exhaustive verification only scales to small input domains; larger n needs a different correctness argument.",
      "Benchmarks are machine-local — results describe one machine, not a universal ranking.",
      "No claim is made about independently verified novel algorithms.",
    ],
    results:
      "The repository is public under the MIT licence with a working CLI, a web dashboard and documented experiment configs.",
    sources: [
      {
        label: "Repository README",
        href: "https://github.com/mohdmohsinrizvi/algorithm-discovery-engine",
        note: "Fetched directly — commands, architecture and feature list taken from the published README.",
      },
      { label: "Licence", note: "MIT, confirmed through the GitHub API." },
    ],
    related: ["amazon-ml-challenge", "virtual-chemistry-lab", "weather-big-data"],
  },

  {
    slug: "amazon-ml-challenge",
    title: "Amazon ML Challenge",
    subtitle: "Large-scale business entity resolution",
    year: "2026",
    category: "AI / ML",
    status: "challenge",
    statusLabel: "Challenge entry",
    featured: true,
    order: 3,
    summary:
      "A four-person team, roughly 72 hours, and a noisy business-matching problem — moving a leaderboard score from 0.559 to 0.939309.",
    role: "Team member — normalisation, matching heuristics and post-processing strategy.",
    contributions: [
      "Field normalisation and cleaning pipelines",
      "Entity-matching heuristics over noisy business records",
      "Regional threshold tuning",
      "One-to-one assignment via bipartite matching as a post-processing step",
      "Iteration logging across the 72-hour window",
    ],
    technologies: ["Python", "Pandas", "String normalisation", "Bipartite matching", "Threshold tuning"],
    cover: { motif: "match", palette: ["#101007", "#b8a68c", "#9287ea"], seed: 43 },
    problem:
      "Business records arriving from different sources describe the same real-world entity with different spellings, abbreviations, addresses and noise. Matching them at scale, without a clean schema, is the whole problem.",
    approach:
      "Normalise aggressively first, so that string comparison happens on the most favourable representation. Then combine pairwise heuristics with a global one-to-one constraint — improving individual pair scores is not enough if the same record is matched twice.",
    features: [
      {
        title: "Normalisation before matching",
        body: "Case, punctuation, whitespace and common abbreviation handling applied consistently on both sides of every comparison.",
      },
      {
        title: "Regional thresholds",
        body: "A single global similarity cut-off performed poorly across regions, so thresholds were tuned per region rather than uniformly.",
      },
      {
        title: "One-to-one assignment",
        body: "Bipartite matching applied as a post-step so greedy pair scores cannot double-assign a record.",
      },
      {
        title: "Score-driven iteration",
        body: "Each change was measured against the leaderboard, giving a clean record of which engineering decision actually moved the metric.",
      },
    ],
    architecture: [
      { label: "Stage 1", items: ["Ingest", "Normalisation", "Feature construction"] },
      { label: "Stage 2", items: ["Pairwise similarity", "Regional thresholds", "Candidate generation"] },
      { label: "Stage 3", items: ["Bipartite one-to-one assignment", "Submission assembly"] },
    ],
    limitations: [
      "This was a competition entry, not a production system, and the team did not win the challenge or advance to a later round.",
      "Scores are leaderboard values from a specific competition instance and are not a general accuracy guarantee.",
      "Techniques were tuned to that dataset's noise profile.",
    ],
    results:
      "Initial score 0.559 · final score 0.939309 · approximately top 3% of the leaderboard, across roughly 72 hours of work by a four-person team.",
    sources: [
      { label: "Participation record", note: "Scores, team size and duration are owner-reported and have not been independently verified." },
    ],
    related: ["algorithm-discovery-lab", "weather-big-data", "bbdu-study-hub"],
  },

  {
    slug: "bbdu-study-hub",
    title: "BBD Study Hub",
    subtitle: "B.Tech CSE study material & syllabus",
    year: "2026",
    category: "Full-Stack",
    status: "completed",
    statusLabel: "Live",
    featured: true,
    order: 4,
    summary:
      "A student-built academic platform for B.Tech CSE students — syllabus access, curated lecture links and progress tracking, without an account wall.",
    role: "Creator — product design, content architecture and full implementation.",
    contributions: [
      "Syllabus-driven information architecture",
      "Curated YouTube lecture mapping per topic",
      "Client-side progress tracking",
      "Mobile-first layout for students on phones",
      "Search discoverability and metadata",
    ],
    technologies: ["TypeScript", "React", "Netlify", "Client-side storage"],
    cover: { motif: "index", palette: ["#0d1210", "#c9f7b2", "#4f9aa2"], seed: 61 },
    liveUrl: "https://bbdu.netlify.app/",
    repositoryUrl: "https://github.com/mohdmohsinrizvi/bbdu",
    problem:
      "Course material for a semester is scattered across PDFs, drive folders and unlabelled video links. Students end up spending more time locating resources than reading them.",
    approach:
      "Mirror the syllabus as the information architecture. Every topic is a node that carries its own notes and curated lectures, and progress is tracked locally so the tool works without a login or a backend.",
    features: [
      {
        title: "Syllabus as navigation",
        body: "The structure of the site follows the structure of the course, so finding a topic does not require searching.",
      },
      {
        title: "Curated lectures per topic",
        body: "Each topic links to selected YouTube lectures rather than an unfiltered search result page.",
      },
      {
        title: "Progress tracking",
        body: "Local, device-side progress marking — no account required, nothing leaves the browser.",
      },
      {
        title: "Mobile-first delivery",
        body: "Built for students reading on a phone between classes, with a small bundle and no heavy client framework runtime cost.",
      },
    ],
    architecture: [
      { label: "Content", items: ["Syllabus model", "Topic nodes", "Lecture references"] },
      { label: "Client", items: ["React + TypeScript", "Local progress store", "Search"] },
      { label: "Delivery", items: ["Static build", "Netlify hosting"] },
    ],
    limitations: [
      "Content is curated by hand and covers a specific curriculum, not every university's syllabus.",
      "Progress is stored per device, so it does not synchronise between devices.",
      "Lecture links depend on third-party videos remaining available.",
    ],
    sources: [
      { label: "Live site", href: "https://bbdu.netlify.app/", note: "Fetched and inspected — title and description meta confirmed." },
      { label: "Repository", href: "https://github.com/mohdmohsinrizvi/bbdu", note: "Confirmed via GitHub API — TypeScript, created August 2026." },
    ],
    related: ["virtual-chemistry-lab", "amazon-ml-challenge", "vibecoderz"],
  },

  {
    slug: "weather-big-data",
    title: "National Weather Big Data Platform",
    subtitle: "Smart India Hackathon · problem statement #26069",
    year: "2026",
    category: "AI / ML",
    status: "completed",
    statusLabel: "Internal round cleared",
    featured: true,
    order: 5,
    summary:
      "An open-source pipeline for ingesting, normalising, deduplicating and analysing multi-source weather data across India — qualified through the Integral University internal selection round.",
    role: "Backend and data-pipeline engineering — ingestion, normalisation, validation and API design.",
    contributions: [
      "Multi-source data ingestion endpoints",
      "Normalisation and validation of unstructured reports",
      "Exact, near-match and geo-temporal deduplication",
      "H3 hexagonal spatial indexing",
      "Event fusion with confidence scoring",
      "Full-text search over mixed Hindi/English records",
    ],
    technologies: [
      "Python",
      "PostgreSQL",
      "H3",
      "pg_trgm",
      "REST APIs",
      "Data pipelines",
      "ML integration",
    ],
    cover: { motif: "weather", palette: ["#08111a", "#4f9aa2", "#a9b8ff"], seed: 79 },
    repositoryUrl: "https://github.com/mohdmohsinrizvi/sih",
    problem:
      "Weather information for India arrives from APIs, social posts, citizen reports and CSV exports — all in different formats. Without normalisation and deduplication, real-time analysis on top of it is not possible.",
    approach:
      "Build the unglamorous half first: ingest anything, normalise it into a common shape, deduplicate it (exact, near and geo-temporal), then fuse related reports into events with a confidence score. Spatial indexing with H3 and full-text search sit on top of a clean store rather than beside a messy one.",
    features: [
      {
        title: "Multi-source ingestion",
        body: "REST endpoints, citizen reports, social posts and CSV/JSON uploads all land in the same normalised representation.",
      },
      {
        title: "Three-tier deduplication",
        body: "Exact matching, near matching and geo-temporal checks — because the same event reported twice from two locations is not a duplicate row.",
      },
      {
        title: "Event fusion",
        body: "Related reports are grouped into weather events with a confidence score instead of being left as unrelated records.",
      },
      {
        title: "H3 spatial indexing",
        body: "Hexagonal grid indexing makes regional queries cheap compared with raw lat/lon scanning.",
      },
      {
        title: "Bilingual full-text search",
        body: "PostgreSQL with pg_trgm supports search across Hindi and English report text.",
      },
    ],
    architecture: [
      { label: "Ingest", items: ["REST APIs", "CSV/JSON uploads", "Report intake"] },
      { label: "Process", items: ["Normalisation", "Validation", "Deduplication", "Event fusion"] },
      { label: "Store", items: ["PostgreSQL", "H3 spatial index", "pg_trgm text index"] },
      { label: "Serve", items: ["Query API", "Analytics endpoints"] },
    ],
    limitations: [
      "Qualified through the internal university selection round only — the team were not national winners or national finalists.",
      "Individual contribution boundaries within the team have not been fully re-verified for every module.",
      "The repository README titles the effort 'Smart India Hackathon 2024'; the owner reports the 2026 edition. The year shown here is pending confirmation.",
      "Open-source and zero-budget by design, so operational hardening is partial.",
    ],
    sources: [
      { label: "Repository README", href: "https://github.com/mohdmohsinrizvi/sih", note: "Fetched directly — architecture, features and problem statement ID #26069 confirmed." },
      { label: "Qualification", note: "Internal-round qualification is owner-reported and not independently verified." },
    ],
    related: ["campusresq", "amazon-ml-challenge", "algorithm-discovery-lab"],
  },

  {
    slug: "cardiosense",
    title: "CardioSense",
    subtitle: "BLE ECG capture & Android companion",
    year: "2026",
    category: "IoT",
    status: "in-progress",
    statusLabel: "Prototype",
    featured: false,
    order: 6,
    summary:
      "An Android companion app for a low-cost ECG capture device — Bluetooth LE acquisition, on-device signal processing, waveform rendering and session history.",
    role: "Sole developer — Android client, BLE data layer and signal processing.",
    contributions: [
      "BLE scanner, protocol layer and reconnection handling",
      "Streaming ECG engine with a simulator fallback",
      "On-device signal processing and waveform rendering",
      "Session storage, history and export",
      "Foreground monitoring service with device connection state",
    ],
    technologies: ["Kotlin", "Android", "Bluetooth LE", "Room", "Foreground services", "ESP32"],
    cover: { motif: "wave", palette: ["#07110f", "#b6f6e3", "#4f9aa2"], seed: 97 },
    problem:
      "Cheap ECG hardware exists, but the part that decides whether it is usable is the software: keeping a BLE stream stable, rendering a live strip at a readable frame rate, and keeping history organised when a recording is interrupted.",
    approach:
      "Split the app into a data layer that can be swapped (real BLE device or simulator), a domain layer that owns signal processing, and a UI layer that only renders state. That separation is what makes it possible to develop the interface without hardware attached.",
    features: [
      {
        title: "Dual data sources",
        body: "A BLE data source and a simulator implement the same domain interface, so the whole app can be exercised without a device.",
      },
      {
        title: "Custom waveform views",
        body: "A scrolling ECG strip, a full waveform view and a compact mini-wave view are drawn natively rather than through a charting library.",
      },
      {
        title: "Foreground monitor service",
        body: "A connected-device foreground service keeps acquisition alive when the app is backgrounded.",
      },
      {
        title: "Sessions, history and export",
        body: "Recordings are stored locally, browsable by session, and exportable through a file provider.",
      },
      {
        title: "Onboarding and settings",
        body: "Device pairing, calibration and display settings are handled in dedicated flows instead of being buried.",
      },
    ],
    architecture: [
      { label: "Data", items: ["BleScanner", "BleProtocol", "BleEcgDataSource", "EcgSimulator", "EcgFileStore"] },
      { label: "Domain", items: ["EcgProcessor", "EcgTypes", "SessionRepository", "ExportManager"] },
      { label: "UI", items: ["Monitor / History / Report / Devices fragments", "EcgStripView, EcgWaveformView, MiniWaveView"] },
      { label: "System", items: ["Room database", "MonitorService (foreground)", "Settings repository"] },
    ],
    limitations: [
      "A prototype and work in progress — not a clinically validated medical device.",
      "No diagnostic claim of any kind is made: this does not detect or predict heart attacks.",
      "Signal quality depends entirely on electrode contact and the front-end hardware.",
      "Accuracy has not been assessed against a clinical-grade reference.",
    ],
    sources: [
      { label: "Local source tree", note: "Kotlin module structure, BLE layer, fragments and manifest permissions inspected directly in the owner's project files." },
    ],
    related: ["esp32-csi", "campusresq", "esp32-mission-control"],
  },

  {
    slug: "esp32-csi",
    title: "ESP32 CSI Telemetry",
    subtitle: "Wi-Fi channel-state sensing over UDP",
    year: "2026",
    category: "IoT",
    status: "prototype",
    statusLabel: "Experiment",
    featured: false,
    order: 7,
    summary:
      "An ESP32 firmware experiment that captures Wi-Fi channel-state information and streams frame statistics to a host over UDP for offline analysis.",
    role: "Sole developer — firmware, capture pipeline and host protocol.",
    contributions: [
      "CSI callback capture with length and channel tracking",
      "Probe, beacon, management and data frame counters",
      "UDP telemetry stream with sequence numbering",
      "RSSI and channel state sampling",
      "Host-side target configuration",
    ],
    technologies: ["ESP32", "C++ / Arduino", "esp_wifi", "Wi-Fi UDP", "Ping socket"],
    cover: { motif: "orbit", palette: ["#0a0b14", "#9287ea", "#4f9aa2"], seed: 13 },
    problem:
      "Wi-Fi radios expose channel-state information that describes how a signal arrived at the receiver. Getting it off the chip and into an analysis environment, with enough metadata to interpret it, is the first real hurdle.",
    approach:
      "Register a CSI callback on the ESP32, keep the hot path minimal (counters and a few sampled values), and push batches to a host over UDP with sequence numbers so dropped packets are visible rather than silently corrupting a dataset.",
    features: [
      {
        title: "CSI callback capture",
        body: "Raw channel-state data captured through the ESP-IDF CSI callback with length, channel and RSSI metadata recorded.",
      },
      {
        title: "Frame-class counters",
        body: "Probe requests, probe responses, beacons, management and data frames are counted separately to sanity-check what is being observed.",
      },
      {
        title: "Sequenced UDP stream",
        body: "Packets carry sequence numbers, so gaps on the host side are detectable rather than assumed away.",
      },
      {
        title: "Configurable target",
        body: "Host address, port, node ID and channel are compile-time constants, keeping the firmware free of runtime configuration UI.",
      },
    ],
    architecture: [
      { label: "Firmware", items: ["CSI callback", "Frame counters", "UDP sender", "LED status"] },
      { label: "Transport", items: ["Wi-Fi UDP", "Sequence numbers", "Configurable target"] },
      { label: "Host", items: ["Receiver endpoint", "Offline analysis"] },
    ],
    limitations: [
      "An experiment, not a finished sensing product.",
      "UDP is used deliberately for throughput, which means packets can and do drop under load.",
      "No positioning or classification claim is made from the captured data yet.",
      "Firmware constants are edited at compile time.",
    ],
    sources: [{ label: "Local firmware source", note: "ESP32 sketch inspected directly, including capture counters and the UDP transport." }],
    related: ["cardiosense", "esp32-mission-control", "algorithm-discovery-lab"],
  },

  {
    slug: "esp32-mission-control",
    title: "ESP32 Mission Control",
    subtitle: "Android interface for ESP32 firmware workflows",
    year: "2026",
    category: "IoT",
    status: "concept",
    statusLabel: "Concept / early build",
    featured: false,
    order: 8,
    summary:
      "An Android application concept for talking to ESP32 boards graphically — device connection, live status, and a guided firmware-management workflow from a phone.",
    role: "Concept, architecture and early Android build.",
    contributions: [
      "Device connection model",
      "Live hardware status surface",
      "Graphical control interface",
      "Firmware flashing workflow design",
    ],
    technologies: ["Kotlin", "Android", "ESP32", "BLE / USB serial"],
    cover: { motif: "nodes", palette: ["#101318", "#b8a68c", "#9287ea"], seed: 5 },
    problem:
      "Working with ESP32 boards usually means a terminal, a flashing tool and a separate serial monitor — three tools and a cable for what should be a single loop.",
    approach:
      "Design the phone as a single control surface: connect once, see device state, push configuration, and flash firmware through a guided flow rather than a command line.",
    features: [
      {
        title: "Connection management",
        body: "Pair with a board and keep a live connection model rather than reconnecting per operation.",
      },
      {
        title: "Live status surface",
        body: "Hardware state surfaced graphically instead of being read from serial output.",
      },
      {
        title: "Firmware workflow",
        body: "A guided sequence for selecting, validating and flashing firmware images.",
      },
      {
        title: "Graphical controls",
        body: "GPIO and configuration changes exposed as interface controls rather than raw commands.",
      },
    ],
    architecture: [
      { label: "App", items: ["Connection manager", "Status view", "Control view", "Flash workflow"] },
      { label: "Link", items: ["BLE transport", "USB serial transport (planned)"] },
      { label: "Device", items: ["ESP32 firmware", "Command protocol"] },
    ],
    limitations: [
      "Classified as a concept with an early build — broad hardware support is not claimed.",
      "The flashing workflow is designed but not demonstrated end-to-end on every board variant.",
      "No repository has been published for this project yet.",
    ],
    sources: [{ label: "Status", note: "Owner-reported concept. No public repository or live deployment was found, so no external link is published." }],
    related: ["esp32-csi", "cardiosense", "lab"],
  },

  {
    slug: "virtual-chemistry-lab",
    title: "Virtual Chemistry Lab",
    subtitle: "Real-time molecular exploration",
    year: "2026",
    category: "Interactive Web",
    status: "completed",
    statusLabel: "Open source",
    featured: false,
    order: 9,
    summary:
      "An interactive browser tool for exploring molecular chemistry in real time — built as a teaching surface rather than a static reference.",
    role: "Creator — design and implementation.",
    contributions: ["Interactive molecular visualisation", "Real-time parameter controls", "Educational flow and copy"],
    technologies: ["JavaScript", "Browser rendering", "Interactive simulation"],
    cover: { motif: "grid", palette: ["#0b0f16", "#a9b8ff", "#c9f7b2"], seed: 71 },
    repositoryUrl: "https://github.com/mohdmohsinrizvi/virtual-chemistry-lab",
    problem:
      "Chemistry is taught with static diagrams of things that are fundamentally dynamic. Students see a molecule, not the behaviour that makes it one.",
    approach:
      "Make the parameters live. Let a learner change something and immediately see the structural consequence, in the browser, with no install and no lab bench.",
    features: [
      {
        title: "Real-time molecular exploration",
        body: "Structures respond to interaction immediately rather than requiring a re-render or a page reload.",
      },
      {
        title: "Guided educational flow",
        body: "Structured so a learner can move from concept to experiment without documentation.",
      },
      {
        title: "Zero-install delivery",
        body: "Runs in the browser, which matters for classrooms where installing software is not an option.",
      },
    ],
    architecture: [{ label: "Client", items: ["Interactive renderer", "Parameter state", "Guided content"] }],
    limitations: [
      "An educational tool, not a molecular-dynamics research package.",
      "No claim of physical accuracy beyond what the teaching model needs.",
    ],
    sources: [
      { label: "Repository", href: "https://github.com/mohdmohsinrizvi/virtual-chemistry-lab", note: "Confirmed via GitHub API — description authored by Mohd Mohsin." },
    ],
    related: ["bbdu-study-hub", "algorithm-discovery-lab", "vibecoderz"],
  },

  {
    slug: "vibecoderz",
    title: "Vibecoderz",
    subtitle: "Open-source community platform",
    year: "2026",
    category: "Full-Stack",
    status: "completed",
    statusLabel: "Open source",
    featured: false,
    order: 10,
    summary:
      "A community platform where builders showcase projects, receive feedback and contribute back to the platform itself.",
    role: "Contributor / co-builder — platform features and project showcase flows.",
    contributions: ["Project showcase and submission flows", "Feedback loops", "Contribution path back into the platform"],
    technologies: ["JavaScript", "Open-source", "Community tooling"],
    cover: { motif: "nodes", palette: ["#0f0c14", "#ff9dbf", "#9287ea"], seed: 89 },
    repositoryUrl: "https://github.com/mohdmohsinrizvi/vibecoderz",
    problem:
      "Indie builders and vibe coders have nowhere consistent to post work in progress and get useful reactions — social feeds reward polish, not iteration.",
    approach:
      "Structure the platform around projects rather than posts, and make contribution to the platform itself a first-class action alongside sharing a project.",
    features: [
      {
        title: "Project showcase",
        body: "Work in progress can be posted as a project with context, not reduced to a screenshot.",
      },
      {
        title: "Feedback loop",
        body: "Reactions are attached to projects so feedback stays with the thing it is about.",
      },
      {
        title: "Contribution path",
        body: "The platform is open source, so users who want something changed can change it.",
      },
    ],
    architecture: [{ label: "Platform", items: ["Project model", "Feedback model", "Contribution workflow"] }],
    limitations: [
      "An early open-source platform — community features are functional rather than mature.",
      "No usage or growth metrics are claimed.",
    ],
    sources: [{ label: "Repository", href: "https://github.com/mohdmohsinrizvi/vibecoderz", note: "Confirmed via GitHub API — MIT licence, description and scope." }],
    related: ["bbdu-study-hub", "saafai", "virtual-chemistry-lab"],
  },

  {
    slug: "saafai",
    title: "SaafAI",
    subtitle: "AI-assisted civic issue reporting",
    year: "2026",
    category: "AI / ML",
    status: "prototype",
    statusLabel: "Prototype",
    featured: false,
    order: 11,
    summary:
      "A civic platform where residents report local issues — garbage, potholes, infrastructure — and AI analyses, prioritises and routes the complaints.",
    role: "Team contributor — platform engineering.",
    contributions: ["Complaint intake flow", "AI analysis and prioritisation pipeline", "Issue routing interface"],
    technologies: ["TypeScript", "AI APIs", "Web application"],
    cover: { motif: "weather", palette: ["#0c1108", "#c9f7b2", "#b8a68c"], seed: 33 },
    repositoryUrl: "https://github.com/mohdmohsinrizvi/SaafAi",
    problem:
      "Civic complaints reach the wrong desk, in the wrong order, with no consistent description — so nothing is triaged.",
    approach:
      "Let a resident describe the problem in their own words, then use language analysis to classify, prioritise and route it into a queue somebody actually owns.",
    features: [
      {
        title: "Natural-language reporting",
        body: "Residents describe an issue in free text instead of navigating a bureaucratic form.",
      },
      {
        title: "Automated classification",
        body: "Reports are classified by issue type so they reach a queue that can act on them.",
      },
      {
        title: "Prioritisation",
        body: "Issues are ranked rather than queued purely by arrival time.",
      },
    ],
    architecture: [{ label: "Flow", items: ["Report intake", "AI analysis", "Prioritisation", "Routing queue"] }],
    limitations: [
      "A prototype built around a hackathon-style problem statement.",
      "Automated prioritisation reflects model judgement, not an official civic triage policy.",
      "No municipal integration is claimed.",
    ],
    sources: [{ label: "Repository", href: "https://github.com/mohdmohsinrizvi/SaafAi", note: "Confirmed via GitHub API — description and scope." }],
    related: ["vibecoderz", "weather-big-data", "bbdu-study-hub"],
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const usedCategories = categories.filter((c) =>
  c === "All" ? true : projects.some((p) => p.category === c),
);
