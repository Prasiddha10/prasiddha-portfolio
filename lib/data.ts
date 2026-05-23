export const profile = {
  name: "Prasiddha Koirala",
  shortName: "PRASIDDHA",
  role: "Associate AI Developer",
  location: "Kathmandu, Nepal",
  email: "prasiddhaf23@gmail.com",
  phone: "+977 9867665486",
  tagline:
    "AI/ML researcher & engineer. Pioneer-batch B.Tech AI at Kathmandu University. Building NLP systems for low-resource Nepali.",
  about:
    "I'm passionate about building products and constantly learning. Every day I'm exploring new ideas in AI, NLP, and robotics — shipping research-grade systems that work in the real world.",
} as const;

export type Experience = {
  year: string;
  role: string;
  company: string;
  location?: string;
  desc: string;
  tags: string[];
};

export const experiences: Experience[] = [
  {
    year: "2025 — Now",
    role: "Associate AI Developer",
    company: "AutoLab Technologies",
    location: "Kathmandu",
    desc:
      "Promoted from AI Intern. Owning NLP pipelines end-to-end — crawling, extraction, structuring messy product data into clean JSON, and shipping a RAG search stack on OpenAI embeddings, Qdrant, and GPT-3.5.",
    tags: ["RAG", "Qdrant", "OpenAI", "Pipelines"],
  },
  {
    year: "2023 — Present",
    role: "NLP & AI Researcher",
    company: "Kathmandu University · Independent",
    desc:
      "Nepali-language NLP research: OCR pipelines, retrieval-augmented generation, dataset curation. Fine-tuning LLaMA with instruction-tuning and LoRA; building eval frameworks with BERTScore + human review.",
    tags: ["LLaMA", "LoRA", "BERTScore", "OCR"],
  },
  {
    year: "2023 — 2024",
    role: "Robotics Department Intern",
    company: "WeCan Technology",
    location: "Kathmandu",
    desc:
      "Led a team of three interns to build an autonomous-navigation prototype demoed at the company tech fair. Designed and tested robotic components; raised department productivity by ~20%.",
    tags: ["Robotics", "Autonomous Nav", "Embedded"],
  },
  {
    year: "2022 — 2023",
    role: "Founder · Treasurer",
    company: "Kathmandu University AI Club",
    desc:
      "Co-founded the AI Club, secured $5,000 in grants and sponsorships, ran financial reporting for student-led AI initiatives.",
    tags: ["Leadership", "Community"],
  },
];

export type Project = {
  name: string;
  year: string;
  blurb: string;
  body: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  accent?: "orange" | "blue";
};

export const projects: Project[] = [
  {
    name: "NepKanun",
    year: "2024 — 2025",
    blurb: "First RAG-based Nepali Legal Assistant",
    body:
      "16K-entry Nepali legal QA dataset + OCR ingest + Chroma/Pinecone vector search + a fine-tuned LLaMA. BERTScore F1 0.82 / 0.77 / 0.71 (simple / moderate / complex). Paper submitted to ACL ARR 2025.",
    tags: ["RAG", "LLaMA", "OCR", "ACL ARR 2025"],
    github: "https://github.com/",
    featured: true,
    accent: "orange",
  },
  {
    name: "Market Prediction Engine",
    year: "2023",
    blurb: "Optimizing trading strategies at 85% accuracy",
    body:
      "Trained an ensemble for short-window market direction prediction, integrating macro signals and order-book features. Deployed as a backtesting + paper-trading service.",
    tags: ["Time Series", "Ensembles", "Backtesting"],
    github: "https://github.com/",
    accent: "blue",
  },
  {
    name: "Real-time Object Detection",
    year: "2023",
    blurb: "Edge perception pipeline at 80%+ accuracy",
    body:
      "End-to-end detection pipeline on CCTV streams: YOLO-family backbone, on-device inference, secure event channel. Used in a campus-security workflow.",
    tags: ["YOLO", "OpenCV", "Edge"],
    github: "https://github.com/",
    accent: "blue",
  },
  {
    name: "Face Attendance System",
    year: "2023",
    blurb: "OpenCV + Mediapipe attendance kiosk",
    body:
      "Live face-recognition kiosk with anti-spoofing, attendance log, and admin dashboard. Cut manual-roll-call errors by ~20%.",
    tags: ["OpenCV", "Mediapipe", "Python"],
    github: "https://github.com/",
    accent: "orange",
  },
  {
    name: "KU-AIcrusade Prototype",
    year: "2023",
    blurb: "AI + hardware for environmental monitoring",
    body:
      "Sensor-fusion prototype for real-time environmental monitoring with on-device anomaly detection. Cut monitoring errors by ~25% over baseline thresholds.",
    tags: ["IoT", "Anomaly Detection", "Embedded"],
    accent: "blue",
  },
];

export const skills: { category: string; items: string[]; accent: "orange" | "blue" }[] = [
  {
    category: "AI / ML",
    accent: "orange",
    items: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Transformers",
      "LLaMA · LoRA",
      "RAG",
      "BERTScore",
      "scikit-learn",
    ],
  },
  {
    category: "NLP",
    accent: "orange",
    items: ["Embeddings", "Qdrant", "Chroma", "Pinecone", "OpenAI API", "OCR", "Tokenizers"],
  },
  {
    category: "Backend",
    accent: "blue",
    items: ["Python", "FastAPI", "Flask", "Node.js", "REST", "WebSockets"],
  },
  {
    category: "Frontend",
    accent: "blue",
    items: ["TypeScript", "Next.js", "React", "Tailwind", "Three.js", "Framer Motion"],
  },
  {
    category: "DevOps",
    accent: "blue",
    items: ["Docker", "GitHub Actions", "Linux", "Nginx", "Vercel"],
  },
  {
    category: "Databases",
    accent: "blue",
    items: ["PostgreSQL", "SQLite", "Redis", "Vector DBs"],
  },
];

export const education = [
  {
    period: "2022 — Present",
    degree: "B.Tech in Artificial Intelligence",
    school: "Kathmandu University",
    detail: "Pioneer batch · GPA 3.62",
  },
  {
    period: "2018 — 2020",
    degree: "+2 Science (High School)",
    school: "Sagarmatha Higher Secondary School",
    detail: "GPA 3.29",
  },
  {
    period: "2011 — 2018",
    degree: "SEE",
    school: "SOS Hermann Gmeiner School, Gandaki",
    detail: "GPA 3.60",
  },
] as const;

export const socials = [
  { label: "Email", href: "mailto:prasiddhaf23@gmail.com", handle: "prasiddhaf23@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prasiddha-koirala", handle: "/prasiddha-koirala" },
  { label: "GitHub", href: "https://github.com/", handle: "@prasiddha" },
  { label: "Phone", href: "tel:+9779867665486", handle: "+977 9867665486" },
] as const;

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
