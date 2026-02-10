// Scene 1 — Connections
export const CONNECTIONS = [
  { name: 'Store', type: 'PostgreSQL', status: 'active' as const, existing: true },
  { name: 'Projects', type: 'PostgreSQL', status: 'active' as const, existing: true },
  { name: 'HR', type: 'PostgreSQL', status: 'active' as const, existing: false },
  { name: 'Marketing', type: 'PostgreSQL', status: 'active' as const, existing: false },
]

// Scene 2 — Onboarding pipeline
export const PIPELINE_STEPS = [
  { label: 'Onboarding databases', subtitle: 'Store, Projects, HR, Marketing, Analytics' },
  { label: 'Discovering databases', subtitle: 'Found 24 tables, 156 columns across 5 databases' },
  { label: 'Building context', subtitle: 'Mapping relationships & business logic' },
  { label: 'Optimizing queries', subtitle: 'Tuning for Store, Projects, HR, Marketing, Analytics' },
  { label: 'Testing & security', subtitle: 'Row-level access policies verified' },
]

// Scene 3 — Query
export const QUERY_DATA = {
  question: 'How many employees are in each department?',
  routing: { database: 'HR', confidence: 94 },
  columns: ['Department', 'Count'],
  rows: [
    ['Engineering', '5'],
    ['Sales', '4'],
    ['Marketing', '4'],
    ['Finance', '2'],
    ['HR', '2'],
  ],
  metrics: { duration: '280ms', rows: 5, source: 'HR (PostgreSQL)' },
}

// Scene 4 — Federated Query
export const CROSS_QUERY_DATA = {
  question: 'Which engineers closed the most deals last quarter?',
  sources: [
    { database: 'HR', table: 'employees', confidence: 96 },
    { database: 'Store', table: 'orders', confidence: 91 },
  ],
  columns: ['Name', 'Department', 'Deals', 'Revenue'],
  rows: [
    ['Sarah Chen', 'Engineering', '12', '$184,200'],
    ['Marcus Webb', 'Engineering', '9', '$147,800'],
    ['Priya Nair', 'Engineering', '8', '$126,450'],
    ['Jake Torres', 'Engineering', '6', '$98,300'],
  ],
  metrics: { duration: '620ms', rows: 4, sources: 'HR + Store' },
}

// Scene 5 — Chat
export const CHAT_DATA = {
  agent: { name: 'baseil_root_7f3a2d', tools: 1 },
  userMessage: 'Show me total revenue by region',
  toolCall: {
    from: 'baseil_root_7f3a2d',
    tool: 'baseil_natural_query',
  },
  botResponse: `Here are the revenue totals by region:

• North America — $460,520
• Europe — $386,390
• Asia Pacific — $198,740

Total across all regions: $1,045,650`,
  metrics: { duration: '1.2s', via: 'baseil_root_7f3a2d' },
}

// Scene 6 — Integrate
export const INTEGRATE_DATA = {
  methods: [
    { name: 'Query Console', icon: 'terminal' as const, desc: 'Natural language SQL via browser', status: 'active' as const },
    { name: 'Chat', icon: 'message' as const, desc: 'Conversational interface for agents', status: 'active' as const },
    { name: 'MCP', icon: 'plug' as const, desc: 'Model Context Protocol server', status: 'active' as const },
    { name: 'API', icon: 'code' as const, desc: 'REST & SDK integration', status: 'active' as const },
  ],
  endpoint: 'baseil.yourcompany.com',
}

// Scene timing config
export const SCENES = [
  { id: 'connect', duration: 5000, label: 'Connect', title: 'Connect your databases' },
  { id: 'onboard', duration: 6000, label: 'Onboard', title: 'Automatic schema discovery' },
  { id: 'query', duration: 10000, label: 'Query', title: 'Query in natural language' },
  { id: 'cross-query', duration: 12000, label: 'Federated Query', title: 'Federated cross-database query' },
  { id: 'chat', duration: 10000, label: 'Chat', title: 'Agent-native conversation' },
  { id: 'integrate', duration: 8000, label: 'Integrate', title: 'Multiple ways to integrate' },
] as const

export const TRANSITION_MS = 600
