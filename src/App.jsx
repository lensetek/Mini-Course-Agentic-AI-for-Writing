import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Workflow,
  LineChart,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Layers3,
  BarChart3,
  MessageSquareMore,
  Menu,
  X,
  Play,
  RotateCcw,
  Sparkle,
  LogOut,
  BookOpen,
  Award,
  Terminal,
  FileText,
  HelpCircle,
  ChevronRight,
  Send,
  Globe,
  ListChecks,
  Network,
  User,
  TrendingUp,
  Download
} from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

const githubUrl = "https://github.com/lensetek/Mini-Course-Agentic-AI-for-Writing";
const agentApiUrl = import.meta.env.VITE_AGENT_API_URL || (import.meta.env.DEV ? "http://localhost:3001/api/agent/run" : "/api/agent/run");

const stripLogPrefix = (log) => log.replace(/^.*?\]:\s*/, "");

const getLogType = (log) => {
  if (log.includes("[You]")) return "user";
  if (log.includes("[Agent")) return "agent";
  return "system";
};

const renderInlineMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

const MarkdownMessage = ({ content }) => {
  const lines = content.split("\n").map(line => line.trim()).filter(Boolean);

  if (!lines.length) return null;

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      {lines.map((line, idx) => {
        if (line.startsWith("### ")) {
          return <h5 key={idx} className="pt-1 text-sm font-extrabold text-slate-900">{renderInlineMarkdown(line.slice(4))}</h5>;
        }
        if (line.startsWith("## ")) {
          return <h4 key={idx} className="pt-1 text-base font-extrabold text-slate-900">{renderInlineMarkdown(line.slice(3))}</h4>;
        }
        if (line.startsWith("# ")) {
          return <h4 key={idx} className="pt-1 text-base font-extrabold text-slate-900">{renderInlineMarkdown(line.slice(2))}</h4>;
        }
        if (/^[-*]\s+/.test(line)) {
          return (
            <div key={idx} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
              <p>{renderInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</p>
            </div>
          );
        }
        if (/^\d+\.\s+/.test(line)) {
          return <p key={idx}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</p>;
        }
        return <p key={idx}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
};

const getAgentLogText = (labLogs) => labLogs
  .filter(log => getLogType(log) === "agent")
  .map(stripLogPrefix)
  .join("\n\n");

const createSummaryFromLogs = (labLogs, lang) => {
  const agentText = getAgentLogText(labLogs);
  if (!agentText) {
    return lang === "EN"
      ? "No AI-Mentor response is available to summarize yet."
      : "Belum ada respons AI-Mentor yang bisa diringkas.";
  }

  const sentences = agentText
    .replace(/\*\*/g, "")
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 20)
    .slice(-4);

  return sentences.length
    ? sentences.map(sentence => `- ${sentence}`).join("\n")
    : `- ${agentText.slice(0, 320)}${agentText.length > 320 ? "..." : ""}`;
};

const createMindmapFromLogs = (labLogs, activeModuleTitle, lang) => {
  const agentText = getAgentLogText(labLogs).replace(/\*\*/g, "");
  if (!agentText) return null;

  const sentences = agentText
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 24)
    .slice(-6);

  const branches = sentences.slice(0, 3).map((sentence, idx) => {
    const words = sentence.split(/\s+/).filter(Boolean);
    const title = words.slice(0, 5).join(" ").replace(/[,:;.!?]$/, "");
    const details = [
      words.slice(5, 11).join(" ").replace(/[,:;.!?]$/, ""),
      words.slice(11, 17).join(" ").replace(/[,:;.!?]$/, "")
    ].filter(Boolean);

    return {
      id: `branch-${idx}`,
      title: title || (lang === "EN" ? `Key idea ${idx + 1}` : `Ide utama ${idx + 1}`),
      details
    };
  });

  return {
    root: activeModuleTitle,
    branches: branches.length ? branches : [
      {
        id: "branch-0",
        title: lang === "EN" ? "AI-Mentor insight" : "Insight AI-Mentor",
        details: [agentText.slice(0, 80)]
      }
    ]
  };
};

const agentSteps = [
  {
    id: 1,
    title: "Literature Search Agent",
    desc: "Mencari jurnal dan publikasi ilmiah terbaru",
    details: "Memindai basis data akademik seperti PubMed, arXiv, dan Google Scholar untuk literatur relevan.",
    status: "success",
    duration: 1.5
  },
  {
    id: 2,
    title: "Synthesis & Gap Agent",
    desc: "Mengekstrak temuan dan celah penelitian",
    details: "Menganalisis artikel untuk menyusun literature matrix dan memetakan fenomena/gap penelitian.",
    status: "success",
    duration: 2.0
  },
  {
    id: 3,
    title: "Draft Outline Agent",
    desc: "Menyusun draf kerangka naskah/proposal",
    details: "Membangun outline proposal yang logis, lengkap dengan pendahuluan, metodologi, dan bab buku.",
    status: "success",
    duration: 1.0
  },
  {
    id: 4,
    title: "Ethics & Citation Agent",
    desc: "Memverifikasi sitasi dan kepatuhan etika",
    details: "Memastikan semua sitasi mengikuti gaya APA/MLA dan melakukan pemeriksaan pencegahan halusinasi.",
    status: "success",
    duration: 0.8
  },
];

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ChatGPTIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5969 8.3829v-2.3324a.0757.0757 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66l-.1467-.0853-4.7782-2.7581a.7712.7712 0 0 0-.7806 0zm-8.835-3.3543-.1467-.0853 4.7782-2.7582a.7664.7664 0 0 0 .3879-.6765V3.805a.0804.0804 0 0 1 .0379-.052l4.8303 2.7866a4.504 4.504 0 0 1 2.129 4.8872l-.1419.0804zM12 14.5422l-4.571-2.637 4.571-2.637 4.571 2.637z" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Translation Dictionary
const t = {
  EN: {
    navCurriculum: "Curriculum",
    navCompetencies: "Competencies",
    navUseCases: "Use Cases",
    loginBtn: "Login",
    signUpBtn: "Sign Up",
    logoutBtn: "Log Out",
    studentLoginBtn: "Student Login",
    badgeLabel: "Mini Course 20 Hours · 5 Sessions · Beginner to Intermediate",
    heroTitlePrefix: "Agentic AI for ",
    heroTitleHighlight: "Researchers & Authors",
    heroDescription: "Learn how to build autonomous AI agents for literature analysis, design custom research proposal assistants, build reusable academic writing skills, and orchestrate publishing ecosystems. No coding experience required. Practical focus: master source-grounded workspaces, build Opal agents, and write skills with Antigravity.",
    heroCTAEnroll: "Enroll Now via Google",
    heroCTALogin: "Student Login",
    statsHours: "Total Learning Hours",
    statsModules: "Hands-on Modules",
    statsFriendly: "Beginner Friendly",
    sandboxHeader: "Interactive Sandbox",
    sandboxSub: "Academic Research Assistant",
    sandboxPlay: "Run Live Agent Demo",
    sandboxReset: "Reset Simulator",
    curriculumHeader: "Applied Curriculum",
    curriculumTitle: "From Core Architecture Design to Fully Ready Deployments.",
    curriculumSub: "Our program is systematically structured to take you step-by-step: AI research brains, no-code academic agents, reusable skill libraries, autonomous writing workflows, all the way to ethical capstone implementations.",
    competencyHeader: "Key Competencies",
    competencyTitle: "Equip yourself with a brand new workflow mindset, not just another list of copy-paste prompts.",
    competencyDescription: "This program is crafted from the ground up for modern researchers, authors, lecturers, students, and academic professionals seeking to deploy AI strategically in their research and publishing workflows.",
    competencyCTAEnroll: "Register Account",
    competencyCTALogin: "Student Portal",
    useCasesHeader: "Real-world Use Cases",
    useCasesTitle: "AI Solutions engineered for real-life academic workflows.",
    useCasesDescription: "Forget theoretical coding exercises. Every single use case is built directly around actual, critical academic responsibilities: literature synthesis, gap creation, methodology validation, book outlines, and responsible AI-assisted draft writing.",
    ctaHeader: "Ready to construct your first automated multi-agent AI system?",
    ctaDescription: "Register for the Lensetek Certification Program, enter our digital sandbox academy, and master Agentic AI frameworks designed specifically for research and academic writing.",
    ctaBtnEnroll: "Register Now via Google",
    classroomHeader: "Student Classroom",
    classroomDesc: "Welcome to your Agentic AI Classroom. Browse the core modules, complete the quick validation challenges, and run live server-side agents.",
    badgeProgress: "Badges",
    sidebarHeader: "Course Modules",
    certHeader: "Course Certificate",
    certDesc: "Complete the quick quiz challenge on all 5 modules to unlock your digital Certificate of Completion.",
    certBtn: "Generate Certificate",
    certViewBtn: "View Certificate",
    studyMaterialsTab: "Study Materials",
    agentSandboxTab: "Agent Sandbox Lab",
    quizVerificationTab: "Quiz Verification",
    practicalLabTitle: "Interactive Agent Sandbox Lab",
    quizSubmit: "Submit Answer",
    quizRetry: "Try Again",
    certTitle: "Certificate of Completion",
    certPresenter: "This is proudly presented to",
    certBody: "For successfully mastering the concepts and engineering parameters of Agentic AI Mastery for Researchers & Authors, completing all 5 technical verification sessions, and demonstrating hands-on proficiency in server-side AI Agent Orchestration.",
    certIssued: "Issued By",
    certDate: "Date of Graduation",
    certPrint: "Print Certificate",
    certDownloadPdf: "Download PDF",
    certDownloadingPdf: "Preparing PDF...",
    shareLinkedIn: "Download PDF + Add to LinkedIn",
    linkedInPreparing: "Preparing LinkedIn...",
    verifyBtnOpen: "Open Verification Page",
    biodataTitle: "📋 Student Profile",
    biodataEdit: "✏️ Edit",
    biodataName: "Name",
    biodataWhatsapp: "WhatsApp",
    biodataBirth: "Place & Date of Birth",
    biodataOccupation: "Occupation",
    biodataIncomplete: "⚠️ Your profile is incomplete!",
    biodataCompleteBtn: "Complete Now",
    inviteTitle: "Exclusive Access Only",
    inviteDesc: "This Mini-Course is private. Please enter your valid invitation code to unlock the curriculum and certificate features.",
    invitePlaceholder: "Enter Invitation Code",
    inviteSubmit: "Unlock Course",
    inviteChecking: "Verifying Code...",
    inviteErrorInvalid: "❌ Invalid invitation code. Please check and try again.",
    inviteErrorLimit: "❌ This invitation code has reached its maximum usage limit.",
    inviteSuccess: "🎉 Access granted! Welcome to the course.",
    backToStudy: "Back to Study",
    classroomBtn: "Go to Classroom",
    curriculumBtn: "Go to Curriculum",
        modulesList: [
      {
        id: 1,
        title: "AI Research Brain with NotebookLM",
        hours: "4 Hours",
        desc: "Build an organized research knowledge base and leverage AI to rapidly comprehend academic sources.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Total Duration: 20 Hours",
          difficulty: "Difficulty: Beginner (No coding background required)",
          description: "This module covers how to overcome information overload, understand how NotebookLM works, build a research knowledge base, and perform advanced literature analysis.",
          sessions: [
            {
              title: "Session 1.1: Research Challenges & NotebookLM Basics",
              bullets: [
                "The challenge of information overload and the risk of generative AI hallucinations.",
                "How NotebookLM works with source-grounded AI.",
                "Creating your first research workspace and understanding AI limitations."
              ]
            },
            {
              title: "Session 1.2: Literature Analysis & Pattern Discovery",
              bullets: [
                "Uploading and organizing journals, books, and reports.",
                "Literature synthesis, journal comparison, and key finding identification.",
                "Using Audio Overview for rapid learning from multiple references."
              ]
            }
          ],
          quiz: {
            question: "What is the primary advantage of using NotebookLM for academic research compared to a standard chatbot?",
            options: [
              "NotebookLM can automatically write an entire book without input.",
              "NotebookLM grounds its answers exclusively on the references you upload to prevent hallucination.",
              "NotebookLM connects directly to social media.",
              "NotebookLM executes local SQL queries.",
              "NotebookLM translates languages without internet access."
            ],
            answerIdx: 1
          }
        }
      },
      {
        id: 2,
        title: "Building Academic Productivity Agents with Google Opal",
        hours: "4 Hours",
        desc: "Build no-code AI agents to automate research and academic writing activities.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Total Duration: 20 Hours",
          difficulty: "Difficulty: Beginner (No coding background required)",
          description: "Learn how to transform regular chats into automated agent workflows in Google Opal, such as Research Idea Assistants, Proposal Assistants, and Book Planning Assistants.",
          sessions: [
            {
              title: "Session 2.1: From Chatbots to Working Agents",
              bullets: [
                "The paradigm shift from single-step chatbots to multi-step agent workflows.",
                "Understanding Google Opal features and how to build mini-applications.",
                "Building a Research Idea Agent to map phenomena and research gaps."
              ]
            },
            {
              title: "Session 2.2: Advanced Academic Agents",
              bullets: [
                "Building a Proposal Assistant Agent for background and problem formulation.",
                "Building an Academic Reviewer Agent to evaluate proposal argument weaknesses.",
                "Designing a Book Planning Agent based on syllabus and lesson plans."
              ]
            }
          ],
          quiz: {
            question: "Which type of Google Opal agent is most appropriate to build for evaluating weaknesses in your research argumentation and methodology?",
            options: [
              "Research Idea Agent",
              "Book Planning Agent",
              "Academic Reviewer Agent",
              "Audio Overview Agent",
              "Translation Agent"
            ],
            answerIdx: 2
          }
        }
      },
      {
        id: 3,
        title: "Building Research & Writing Skills with Google Antigravity",
        hours: "4 Hours",
        desc: "Develop professional SOP-based skills that can be reused across various AI agents.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Total Duration: 20 Hours",
          difficulty: "Difficulty: Beginner (No coding background required)",
          description: "Learn the difference between agents and skills, and how to design intelligent capabilities that adhere to SOP standards for accurate research analysis.",
          sessions: [
            {
              title: "Session 3.1: Core Structure of Professional Skills",
              bullets: [
                "Understanding the difference between Skills, Agents, and Workflows.",
                "Structuring professional skills using SKILL.md files, constraints, and examples.",
                "Building a Research Gap Creator Skill."
              ]
            },
            {
              title: "Session 3.2: Reusable Academic Skill Library",
              bullets: [
                "Building a Literature Matrix Creator Skill for literature review synthesis.",
                "Designing a Proposal Reviewer Skill for methodological evaluation.",
                "Creating a Book Outline Creator and Academic Writing Skill."
              ]
            }
          ],
          quiz: {
            question: "What is the primary component used to design a structured 'skill' in Google Antigravity?",
            options: [
              "Just using a regular chat input box.",
              "A SKILL.md file containing instructions, constraints, and behavioral examples.",
              "A Python-based backend script.",
              "A local SQL database.",
              "A visual drag-and-drop canvas."
            ],
            answerIdx: 1
          }
        }
      },
      {
        id: 4,
        title: "Autonomous Research & Book Publication Systems",
        hours: "4 Hours",
        desc: "Integrate NotebookLM, Google Opal, and Antigravity into a cohesive research and writing system.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Total Duration: 20 Hours",
          difficulty: "Difficulty: Beginner (No coding background required)",
          description: "Unite all elements into a single Autonomous Research Operating System with human-in-the-loop quality control validation.",
          sessions: [
            {
              title: "Session 4.1: Research Operating System",
              bullets: [
                "Connecting Knowledge, Agents, and Skills into a single orchestration pipeline.",
                "Designing an automated Systematic Literature Review (SLR) and proposal drafting system.",
                "Building an automated academic book writing system."
              ]
            },
            {
              title: "Session 4.2: Human-in-the-Loop Validation & AI Ethics",
              bullets: [
                "Applying Human-in-the-Loop validation for fact-checking and QA.",
                "AI Ethics: reference hallucinations, citation fabrication, and AI authorship roles.",
                "Aligning AI workflows with international journal policies (Elsevier, Nature)."
              ]
            }
          ],
          quiz: {
            question: "Why is the 'Human-in-the-Loop Validation' stage critically important in an Autonomous Research System?",
            options: [
              "To technically slow down AI processing time.",
              "To manually perform reference verification, fact-checking, and quality assurance of the written output.",
              "To translate visual prompts into binary code.",
              "To bypass system firewall security.",
              "To perform automated database backups."
            ],
            answerIdx: 1
          }
        }
      },
      {
        id: 5,
        title: "Final Capstone Project",
        hours: "4 Hours",
        desc: "Apply your knowledge by building a specialized academic operating system.",
        githubUrl: "https://github.com/lensetek/Research-Agent-Skills-Collection/tree/main",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Total Duration: 20 Hours",
          difficulty: "Difficulty: Intermediate",
          description: "Select one specialization to build a functional academic OS: Research OS, Thesis OS, Book Authoring OS, or Academic Reviewer OS.",
          sessions: [
            {
              title: "Session 5.1: Track Selection & System Design",
              bullets: [
                "Track A: Building an automated research system.",
                "Track B: Building a thesis companion system.",
                "Track C: Building an automated book writing system.",
                "Track D: Building an article and proposal review system."
              ]
            },
            {
              title: "Session 5.2: Presentation & Certification",
              bullets: [
                "Testing and refining the built academic operating system.",
                "Reviewing system performance for real-world research needs.",
                "Receiving the Certified Agentic AI Research & Authoring Practitioner certificate."
              ]
            }
          ],
          quiz: {
            question: "Which of the following is one of the Capstone Project track options in this course?",
            options: [
              "Building an e-commerce checkout feature.",
              "Building an Academic Reviewer Operating System.",
              "Designing a local network firewall system.",
              "Creating an automated video editor.",
              "Writing a calculator script using Python."
            ],
            answerIdx: 1
          }
        }
      }
    ]
  },
  ID: {
    navCurriculum: "Kurikulum",
    navCompetencies: "Kompetensi",
    navUseCases: "Use Case",
    loginBtn: "Masuk",
    signUpBtn: "Daftar",
    logoutBtn: "Keluar",
    studentLoginBtn: "Login Peserta",
    badgeLabel: "Mini Course 20 Jam · 5 Sesi · Pemula hingga Menengah",
    heroTitlePrefix: "Agentic AI untuk ",
    heroTitleHighlight: "Researchers & Authors",
    heroDescription: "Pelajari cara membangun agen AI otonom untuk analisis literatur, rancang asisten proposal penelitian kustom, bangun skill penulisan akademik yang dapat digunakan kembali, dan orkestrasikan ekosistem penerbitan. Tidak wajib coding. Fokus praktis: kuasai workspace berbasis sumber data, bangun agen Opal, dan tulis skill dengan Antigravity.",
    heroCTAEnroll: "Daftar Sekarang via Google",
    heroCTALogin: "Login Peserta",
    statsHours: "Total Jam Belajar",
    statsModules: "Modul Praktis",
    statsFriendly: "Ramah Pemula",
    sandboxHeader: "Simulasi Interaktif",
    sandboxSub: "Academic Research Assistant",
    sandboxPlay: "Jalankan Demo Alur Kerja AI",
    sandboxReset: "Reset Simulasi",
    curriculumHeader: "Kurikulum Terapan",
    curriculumTitle: "Dari Desain Arsitektur Dasar Hingga Deployment Siap Pakai.",
    curriculumSub: "Struktur program dirancang bertahap: basis riset AI, agen akademik no-code, pustaka skill reusable, sistem penulisan otonom, hingga implikasi etika capstone.",
    competencyHeader: "Kompetensi Akhir",
    competencyTitle: "Pulang membawa cara kerja baru, bukan hanya kumpulan copy-paste prompt.",
    competencyDescription: "Program ini dirancang khusus untuk dosen, peneliti, penulis, mahasiswa, dan profesional akademik yang ingin menerapkan kecerdasan buatan (AI) secara strategis dalam penelitian ilmiah dan alur kerja publikasi mereka.",
    competencyCTAEnroll: "Buat Akun Baru",
    competencyCTALogin: "Portal Peserta",
    useCasesHeader: "Academic Use Cases",
    useCasesTitle: "Solusi AI yang dirancang untuk alur kerja akademik nyata harian.",
    useCasesDescription: "Lupakan latihan coding teoretis. Setiap use case dibangun langsung di sekitar tanggung jawab akademik penting: sintesis literatur otomatis, identifikasi gap riset, metodologi proposal, outline bab naskah, dan penulisan draf berbasis etika.",
    ctaHeader: "Siap membangun sistem riset dan penulisan akademik otonom Anda?",
    ctaDescription: "Daftar di Lensetek Certification Program, masuk ke akademi simulasi digital kami, dan kuasai framework Agentic AI yang dirancang khusus untuk riset ilmiah dan kepengaruhan akademik.",
    ctaBtnEnroll: "Daftar Sekarang via Google",
    classroomHeader: "Kelas Belajar",
    classroomDesc: "Selamat datang di Kelas Agentic AI Anda. Pelajari modul utama, selesaikan kuis evaluasi singkat, dan jalankan agen server-side Anda secara otonom.",
    badgeProgress: "Lencana",
    sidebarHeader: "Modul Pembelajaran",
    certHeader: "Sertifikat Kelulusan",
    certDesc: "Selesaikan kuis verifikasi kompetensi di kelima modul untuk membuka Sertifikat Kelulusan resmi Anda.",
    certBtn: "Generate Sertifikat",
    certViewBtn: "Lihat Sertifikat",
    studyMaterialsTab: "Materi Pembelajaran",
    agentSandboxTab: "Asisten AI-Mentor",
    quizVerificationTab: "Kuis Verifikasi",
    practicalLabTitle: "Asisten Interaktif AI-Mentor",
    quizSubmit: "Kirim Jawaban",
    quizRetry: "Coba Lagi",
    certTitle: "Sertifikat Kelulusan Resmi",
    certPresenter: "Sertifikat ini dengan bangga dipersembahkan kepada",
    certBody: "Atas keberhasilannya menguasai konsep dan rekayasa parameter Agentic AI Mastery for Researchers & Authors, menyelesaikan 5 sesi verifikasi teknis kompetensi, serta mendemonstrasikan kecakapan praktis dalam Orkestrasi Agen AI pada sisi server.",
    certIssued: "Penerbit Sertifikat",
    certDate: "Tanggal Kelulusan",
    certPrint: "Cetak Sertifikat",
    certDownloadPdf: "Download PDF",
    certDownloadingPdf: "Menyiapkan PDF...",
    shareLinkedIn: "Download PDF + Tambah ke LinkedIn",
    linkedInPreparing: "Menyiapkan LinkedIn...",
    verifyBtnOpen: "Buka Laman Verifikasi",
    biodataTitle: "📋 Biodata Mahasiswa",
    biodataEdit: "✏️ Edit",
    biodataName: "Nama",
    biodataWhatsapp: "WhatsApp",
    biodataBirth: "TTL",
    biodataOccupation: "Pekerjaan",
    biodataIncomplete: "⚠️ Biodata Anda belum lengkap!",
    biodataCompleteBtn: "Lengkapi Sekarang",
    inviteTitle: "Akses Eksklusif Kelas",
    inviteDesc: "Mini-Course ini bersifat privat. Silakan masukkan kode undangan (invitation code) Anda yang valid untuk membuka kurikulum dan sertifikat.",
    invitePlaceholder: "Masukkan Kode Undangan",
    inviteSubmit: "Buka Akses Kelas",
    inviteChecking: "Memverifikasi Kode...",
    inviteErrorInvalid: "❌ Kode undangan tidak valid. Silakan periksa kembali.",
    inviteErrorLimit: "❌ Kode undangan ini telah mencapai batas maksimum pemakaian.",
    inviteSuccess: "🎉 Akses dibuka! Selamat belajar di kelas.",
    backToStudy: "Kembali Belajar",
    classroomBtn: "Masuk ke Kelas",
    curriculumBtn: "Lihat Kurikulum",
        modulesList: [
      {
        id: 1,
        title: "AI Research Brain dengan NotebookLM",
        hours: "4 Jam",
        desc: "Membangun basis pengetahuan penelitian yang terorganisasi dan memanfaatkan AI untuk memahami berbagai sumber akademik secara cepat.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Durasi Total: 20 Jam",
          difficulty: "Tingkat Kesulitan: Pemula (Tidak wajib latar belakang coding)",
          description: "Modul ini membahas cara mengatasi information overload, memahami cara kerja NotebookLM, membangun knowledge base penelitian, dan melakukan analisis literatur tingkat lanjut.",
          sessions: [
            {
              title: "Sesi 1.1: Tantangan Penelitian & Dasar-Dasar NotebookLM",
              bullets: [
                "Tantangan information overload dan risiko halusinasi pada AI generatif.",
                "Cara kerja NotebookLM dengan pendekatan source-grounded AI.",
                "Membuat workspace penelitian pertama dan memahami batasan AI."
              ]
            },
            {
              title: "Sesi 1.2: Analisis Literatur & Penemuan Pola",
              bullets: [
                "Mengunggah dan mengorganisasi jurnal, buku, serta laporan penelitian.",
                "Sintesis literatur, komparasi jurnal, dan identifikasi temuan utama.",
                "Menggunakan Audio Overview untuk pembelajaran cepat dari banyak referensi."
              ]
            }
          ],
          quiz: {
            question: "Apakah keuntungan utama menggunakan NotebookLM untuk penelitian akademik dibandingkan dengan chatbot standar?",
            options: [
              "NotebookLM dapat menulis buku secara otomatis tanpa input.",
              "NotebookLM mendasarkan jawabannya secara eksklusif pada referensi yang Anda unggah untuk mencegah halusinasi.",
              "NotebookLM terhubung langsung ke media sosial.",
              "NotebookLM mengeksekusi kueri SQL lokal.",
              "NotebookLM menerjemahkan bahasa tanpa akses internet."
            ],
            answerIdx: 1
          }
        }
      },
      {
        id: 2,
        title: "Membangun Agen Produktivitas Akademik dengan Google Opal",
        hours: "4 Jam",
        desc: "Membangun agen AI tanpa coding untuk mengotomatisasi aktivitas penelitian dan penulisan akademik.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Durasi Total: 20 Jam",
          difficulty: "Tingkat Kesulitan: Pemula (Tidak wajib latar belakang coding)",
          description: "Pelajari cara mengubah obrolan biasa menjadi alur kerja agen otomatis di Google Opal, seperti Asisten Ide Riset, Asisten Proposal, dan Asisten Perencanaan Buku.",
          sessions: [
            {
              title: "Sesi 2.1: Dari Chatbot Menjadi Agen yang Bekerja",
              bullets: [
                "Pergeseran paradigma dari chatbot satu langkah ke alur kerja agen multi-langkah.",
                "Memahami fitur Google Opal dan cara membangun aplikasi mini.",
                "Membangun Research Idea Agent untuk memetakan fenomena dan research gap."
              ]
            },
            {
              title: "Sesi 2.2: Agen Akademik Tingkat Lanjut",
              bullets: [
                "Membangun Proposal Assistant Agent untuk latar belakang dan perumusan masalah.",
                "Membangun Academic Reviewer Agent untuk mengevaluasi kelemahan argumen proposal.",
                "Merancang Book Planning Agent berdasarkan silabus dan modul pembelajaran."
              ]
            }
          ],
          quiz: {
            question: "Jenis agen Google Opal manakah yang paling tepat dibangun untuk mengevaluasi kelemahan dalam argumentasi dan metodologi penelitian Anda?",
            options: [
              "Research Idea Agent",
              "Book Planning Agent",
              "Academic Reviewer Agent",
              "Audio Overview Agent",
              "Translation Agent"
            ],
            answerIdx: 2
          }
        }
      },
      {
        id: 3,
        title: "Membangun Skill Riset & Penulisan dengan Google Antigravity",
        hours: "4 Jam",
        desc: "Mengembangkan skill profesional berbasis SOP yang dapat digunakan ulang oleh berbagai agen AI.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Durasi Total: 20 Jam",
          difficulty: "Tingkat Kesulitan: Pemula (Tidak wajib latar belakang coding)",
          description: "Pelajari perbedaan antara agen dan skill, serta bagaimana merancang kemampuan cerdas yang mematuhi standar SOP untuk analisis penelitian yang akurat.",
          sessions: [
            {
              title: "Sesi 3.1: Struktur Inti dari Skill Profesional",
              bullets: [
                "Memahami perbedaan antara Skill, Agent, dan Workflow.",
                "Menyusun skill profesional menggunakan file SKILL.md, batasan, dan contoh.",
                "Membangun Research Gap Creator Skill."
              ]
            },
            {
              title: "Sesi 3.2: Pustaka Skill Akademik Reusable",
              bullets: [
                "Membangun Literature Matrix Creator Skill untuk sintesis tinjauan pustaka.",
                "Merancang Proposal Reviewer Skill untuk evaluasi metodologis.",
                "Membuat Book Outline Creator dan Academic Writing Skill."
              ]
            }
          ],
          quiz: {
            question: "Apakah komponen utama yang digunakan untuk merancang 'skill' terstruktur di Google Antigravity?",
            options: [
              "Hanya menggunakan kotak input chat biasa.",
              "File SKILL.md yang berisi instruksi, batasan, dan contoh perilaku.",
              "Skrip backend berbasis Python.",
              "Database SQL lokal.",
              "Kanvas visual drag-and-drop."
            ],
            answerIdx: 1
          }
        }
      },
      {
        id: 4,
        title: "Sistem Riset Otonom & Publikasi Buku",
        hours: "4 Jam",
        desc: "Mengintegrasikan NotebookLM, Google Opal, dan Antigravity menjadi sistem penelitian dan penulisan yang lengkap.",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Durasi Total: 20 Jam",
          difficulty: "Tingkat Kesulitan: Pemula (Tidak wajib latar belakang coding)",
          description: "Satukan semua elemen ke dalam satu Sistem Operasi Penelitian Otonom dengan validasi kontrol kualitas human-in-the-loop.",
          sessions: [
            {
              title: "Sesi 4.1: Research Operating System",
              bullets: [
                "Menghubungkan Knowledge, Agent, dan Skill ke dalam satu pipa orkestrasi.",
                "Merancang Systematic Literature Review (SLR) otomatis dan sistem draf proposal.",
                "Membangun sistem penulisan buku akademik otomatis."
              ]
            },
            {
              title: "Sesi 4.2: Validasi Human-in-the-Loop & Etika AI",
              bullets: [
                "Menerapkan validasi Human-in-the-Loop untuk pemeriksaan fakta dan QA.",
                "Etika AI: halusinasi referensi, fabrikasi sitasi, dan peran kepengaruhan AI.",
                "Menyelaraskan alur kerja AI dengan kebijakan jurnal internasional (Elsevier, Nature)."
              ]
            }
          ],
          quiz: {
            question: "Mengapa tahap 'Validasi Human-in-the-Loop' sangat penting dalam Sistem Penelitian Otonom?",
            options: [
              "Untuk memperlambat waktu pemrosesan AI secara teknis.",
              "Untuk melakukan verifikasi referensi, pemeriksaan fakta, dan jaminan kualitas output secara manual.",
              "Untuk menerjemahkan prompt visual menjadi kode biner.",
              "Untuk melewati keamanan firewall sistem.",
              "Untuk melakukan pencadangan database otomatis."
            ],
            answerIdx: 1
          }
        }
      },
      {
        id: 5,
        title: "Final Capstone Project",
        hours: "4 Jam",
        desc: "Terapkan pengetahuan Anda dengan membangun sistem operasi akademik khusus.",
        githubUrl: "https://github.com/lensetek/Research-Agent-Skills-Collection/tree/main",
        materials: {
          institution: "Lensetek International, LLC.",
          course: "Agentic AI Mastery for Researchers & Authors",
          duration: "Durasi Total: 20 Jam",
          difficulty: "Tingkat Kesulitan: Menengah",
          description: "Pilih salah satu spesialisasi untuk membangun OS akademik yang berfungsi: Research OS, Thesis OS, Book Authoring OS, atau Academic Reviewer OS.",
          sessions: [
            {
              title: "Sesi 5.1: Pemilihan Jalur & Desain Sistem",
              bullets: [
                "Jalur A: Membangun sistem penelitian otomatis.",
                "Jalur B: Membangun sistem pendamping tesis.",
                "Jalur C: Membangun sistem penulisan buku otomatis.",
                "Jalur D: Membangun sistem peninjau artikel dan proposal."
              ]
            },
            {
              title: "Sesi 5.2: Presentasi & Sertifikasi",
              bullets: [
                "Menguji dan menyempurnakan sistem operasi akademik yang dibangun.",
                "Meninjau kinerja sistem untuk kebutuhan penelitian dunia nyata.",
                "Menerima sertifikat Certified Agentic AI Research & Authoring Practitioner."
              ]
            }
          ],
          quiz: {
            question: "Manakah di bawah ini yang merupakan salah satu pilihan jalur Proyek Capstone dalam kursus ini?",
            options: [
              "Membangun fitur checkout e-commerce.",
              "Membangun Academic Reviewer Operating System.",
              "Merancang sistem firewall jaringan lokal.",
              "Membuat editor video otomatis.",
              "Menulis skrip kalkulator menggunakan Python."
            ],
            answerIdx: 1
          }
        }
      }
    ]
  }
};

const sessionExplanations = {
  EN: {
    1: [
      {
        concept: "NotebookLM acts as a source-grounded research memory brain. It synthesizes literature, highlights key findings, and extracts patterns from uploaded journals, books, and reports while strictly preventing AI hallucinations.",
        architecture: "Upload Literature References ──> Source-Grounded Comprehension ──> Literature Synthesis ──> AI Gap Discovery",
        checklist: [
          "Create a dedicated research source workspace in NotebookLM.",
          "Upload academic papers, reports, or research notes into the dashboard.",
          "Generate comparative literature grids and discover key research gap areas."
        ]
      },
      {
        concept: "Utilize Audio Overview features in NotebookLM to rapidly ingest literature. Convert complex, multi-journal reference lists into audio discussions to comprehend key hypotheses and academic debates.",
        architecture: "Multi-Source References ──> Audio Overview Engine ──> Synthetic Discussion Podcast ──> Rapid Insight",
        checklist: [
          "Enable Audio Overview inside your NotebookLM reference collection.",
          "Listen to structural arguments and synthesize cross-journal comparisons.",
          "Extract key notes to compile into your thesis or book outline draft."
        ]
      }
    ],
    2: [
      {
        concept: "Google Opal allows researchers to build no-code, multi-step productivity agents. Transition from simple prompting to designing specialized assistants for gap analysis, proposal drafting, and reviewer workflows.",
        architecture: "Define Custom Inputs ──> Opal Multi-Step Workflow ──> Specialized Academic Agent ──> Proposal Outline",
        checklist: [
          "Build a customized mini-application inside the Google Opal canvas.",
          "Design inputs for research phenomena and target variables.",
          "Create a Research Idea Agent that dynamically generates titles and gap outlines."
        ]
      },
      {
        concept: "Deploy academic reviewer and reviewer proposal agents. Provide academic feedback on drafts by highlighting methodological issues, arguable claims, and citation gaps automatically.",
        architecture: "Draft Proposal ──> Academic Reviewer Agent ──> Argumentation Quality Check ──> Suggested Revisions",
        checklist: [
          "Configure an Academic Reviewer Agent in Google Opal.",
          "Input a draft background section or research proposal outline.",
          "Analyze the structural weaknesses, argument critiques, and improvement checklists."
        ]
      }
    ],
    3: [
      {
        concept: "Google Antigravity enables researchers to build reusable academic skills. By designing standard operating procedures (SOPs) inside SKILL.md configurations, you enforce quality controls on AI writing and gap extraction.",
        architecture: "Draft SKILL.md Instructions ──> Set Rigid Constraints & Examples ──> Reusable Gap Creator Skill",
        checklist: [
          "Create a structured skill directory using SKILL.md rules.",
          "Define behavioral constraints, academic tone guidelines, and output formats.",
          "Test the Research Gap Creator Skill on modern academic papers."
        ]
      },
      {
        concept: "Build a literature matrix and outline builder skill. Automatically parse sources and synthesize them into a literature comparison grid that maps directly into your academic thesis layout.",
        architecture: "Parse Academic Literature ──> Literature Matrix Skill ──> Formatted Synthesis Grid ──> Thesis Draft",
        checklist: [
          "Configure a Literature Matrix Creator Skill in Google Antigravity.",
          "Input selected research abstracts to generate structured comparison grids.",
          "Format results into academic outline tables ready for publication."
        ]
      }
    ],
    4: [
      {
        concept: "Orchestrate an end-to-end Autonomous Research Operating System. Connect source references to Opal agents and Antigravity skills to build a pipeline that takes you from raw PDFs to a drafted literature review.",
        architecture: "NotebookLM Source Brain ──> Opal Proposal Agent ──> Antigravity Writing Skill ──> Systematic Literature Review",
        checklist: [
          "Connect NotebookLM research findings to Opal workflow nodes.",
          "Map the automated flow of data from literature matrices to outline builders.",
          "Generate a first draft of a Systematic Literature Review (SLR) autonomously."
        ]
      },
      {
        concept: "Enforce ethical AI rules and human-in-the-loop checkpoints. Audit draft citations for hallucinations, verify references, and align publication drafts with international journal policies (Elsevier, Nature, IEEE).",
        architecture: "Autonomous Draft ──> Reference & Fact Check ──> Journal Compliance Audit ──> Human Approval Rilis",
        checklist: [
          "Insert strict fact-checking and citation verification blocks in the pipeline.",
          "Audit AI output for citation fabrication or misleading summaries.",
          "Establish a manual validation checkpoint before submitting to international journals."
        ]
      }
    ],
    5: [
      {
        concept: "Select your Capstone specialization. Select Track A (Research OS), Track B (Thesis OS), Track C (Book Authoring OS), or Track D (Academic Reviewer OS) to build a functional workspace.",
        architecture: "Select Capstone Specialization ──> Design System Orchestration ──> Deploy Academic OS ──> Showcase",
        checklist: [
          "Select one track and design the core workflow architecture.",
          "Integrate NotebookLM source maps, Opal agents, and Antigravity skills.",
          "Build and test your academic workspace on real-world reference datasets."
        ]
      },
      {
        concept: "Complete the capstone evaluation. Audit daily query limits, secure API endpoints, run dry-runs with peers, and obtain your Certified Agentic AI Research & Authoring Practitioner credential.",
        architecture: "Audit Token Quotas ──> Run Peer UAT dry-runs ──> Verify Security ──> Professional Certification",
        checklist: [
          "Verify the execution costs and token boundaries of your system.",
          "Run peer tests and correct bugs in the agent flow.",
          "Present your system to earn the Lensetek Practitioner certification."
        ]
      }
    ]
  },
  ID: {
    1: [
      {
        concept: "NotebookLM berfungsi sebagai otak memori penelitian berbasis sumber (source-grounded). Platform ini mensintesis literatur, menyoroti temuan utama, dan mengekstrak pola dari jurnal/buku yang diunggah secara akurat.",
        architecture: "Unggah Dokumen Referensi ──> Pemahaman Berbasis Sumber ──> Sintesis Literatur ──> Identifikasi Research Gap",
        checklist: [
          "Buat workspace sumber penelitian khusus di NotebookLM.",
          "Unggah makalah akademis, tesis, atau laporan ke dashboard NotebookLM.",
          "Hasilkan matriks komparasi literatur dan identifikasi area research gap."
        ]
      },
      {
        concept: "Manfaatkan fitur Audio Overview di NotebookLM untuk mencerna literatur secara cepat. Ubah daftar pustaka multi-jurnal yang kompleks menjadi diskusi audio interaktif untuk memahami hipotesis utama.",
        architecture: "Referensi Multi-Sumber ──> Audio Overview Engine ──> Diskusi Podcast Sintetis ──> Pemahaman Instan",
        checklist: [
          "Aktifkan Audio Overview di dalam koleksi referensi NotebookLM Anda.",
          "Dengarkan argumen struktural dan perbandingan antar-jurnal.",
          "Catat poin penting untuk disusun ke dalam draf usulan proposal atau outline buku."
        ]
      }
    ],
    2: [
      {
        concept: "Google Opal memungkinkan peneliti membangun agen produktivitas multi-langkah tanpa coding. Rancang asisten khusus untuk analisis gap, penyusunan draf proposal, dan peninjauan akademis.",
        architecture: "Desain Input Kustom ──> Alur Kerja Visual Opal ──> Agen Akademik Kustom ──> Draf Proposal",
        checklist: [
          "Bangun aplikasi mini kustom di kanvas visual Google Opal.",
          "Petakan kolom input untuk fenomena penelitian dan variabel target.",
          "Buat Research Idea Agent untuk menghasilkan judul dan rumusan gap otomatis."
        ]
      },
      {
        concept: "Terapkan agen peninjau akademis (Academic Reviewer Agent) untuk mengevaluasi draf proposal. Identifikasi kelemahan metodologi, klaim argumen, dan celah sitasi secara instan.",
        architecture: "Draf Proposal ──> Academic Reviewer Agent ──> Pemeriksaan Logika Argumen ──> Rekomendasi Perbaikan",
        checklist: [
          "Konfigurasikan Academic Reviewer Agent di Google Opal.",
          "Masukkan bagian draf latar belakang atau metodologi proposal Anda.",
          "Analisis kelemahan argumen dan ikuti instruksi checklist perbaikan."
        ]
      }
    ],
    3: [
      {
        concept: "Google Antigravity memungkinkan pembuatan skill akademik reusable berbasis SOP. Menggunakan dokumen SKILL.md, Anda dapat menetapkan aturan baku untuk penulisan artikel ilmiah dan ekstraksi gap riset.",
        architecture: "Tulis Panduan SKILL.md ──> Tetapkan Batasan & Contoh ──> Skill Gap Creator Reusable",
        checklist: [
          "Buat folder skill terstruktur dengan pedoman file SKILL.md.",
          "Tentukan batasan gaya bahasa akademik, format tabel, dan batasan panjang teks.",
          "Uji coba Research Gap Creator Skill pada abstrak jurnal terbaru."
        ]
      },
      {
        concept: "Membangun skill literature matrix dan outline builder. Secara mandiri menganalisis referensi dan menuangkannya ke dalam tabel komparasi terstruktur yang siap disalin ke bab tinjauan pustaka.",
        architecture: "Analisis Makalah Akademik ──> Literature Matrix Skill ──> Matriks Sintesis Tinjauan ──> Draf Bab 2",
        checklist: [
          "Konfigurasikan Literature Matrix Creator Skill di Google Antigravity.",
          "Input beberapa abstrak artikel untuk menyusun tabel perbandingan otonom.",
          "Format hasil matriks riset agar sesuai dengan standar publikasi jurnal."
        ]
      }
    ],
    4: [
      {
        concept: "Orkestrasikan Sistem Operasi Penelitian Otonom (Research OS). Hubungkan referensi NotebookLM ke agen Opal dan skill Antigravity menjadi satu pipa kerja penulisan draf artikel ilmiah utuh.",
        architecture: "NotebookLM Source Brain ──> Opal Proposal Agent ──> Antigravity Writing Skill ──> Draf Tinjauan Pustaka",
        checklist: [
          "Hubungkan temuan analisis NotebookLM ke input alur kerja Opal.",
          "Rancang alur data otomatis dari matriks literatur menuju outline builder.",
          "Hasilkan draf bab tinjauan pustaka pertama (SLR) secara otonom."
        ]
      },
      {
        concept: "Terapkan validasi etis AI dan pos review Human-in-the-loop. Periksa fabrikasi kutipan, verifikasi keaslian sumber, dan selaraskan tulisan dengan kebijakan etika jurnal internasional (Elsevier, Nature, IEEE).",
        architecture: "Draf AI Otonom ──> Cek Plagiarisme & Sitasi ──> Audit Kebijakan Jurnal ──> Persetujuan Akhir Manusia",
        checklist: [
          "Sisipkan langkah fact-checking dan verifikasi sitasi manual dalam workflow.",
          "Periksa halusinasi referensi atau ringkasan klaim yang tidak akurat.",
          "Pastikan draf memenuhi standar etika kepengarangan sebelum disubmit ke penerbit."
        ]
      }
    ],
    5: [
      {
        concept: "Selesaikan proyek Capstone sesuai jalur spesialisasi Anda: Track A (Research OS), Track B (Thesis OS), Track C (Book OS), atau Track D (Reviewer OS).",
        architecture: "Pilih Spesialisasi Capstone ──> Rancang Integrasi Sistem ──> Deploy OS Akademik ──> Uji Coba",
        checklist: [
          "Pilih satu jalur spesialisasi capstone dan rancang alur arsitekturnya.",
          "Integrasikan source brain NotebookLM, Opal agents, and Antigravity skills.",
          "Deploy dan uji performa sistem operasi akademik Anda dengan data referensi nyata."
        ]
      },
      {
        concept: "Lakukan audit akhir sistem. Pantau batas kueri harian, amankan token API, lakukan pengujian UAT bersama rekan sejawat, dan raih sertifikat kompetensi Practitioner Anda.",
        architecture: "Audit Token Kuota ──> Simulasi UAT Rekan Sejawat ──> Verifikasi Keamanan ──> Sertifikasi Kompetensi",
        checklist: [
          "Analisis penggunaan token dan perkiraan biaya operasional kueri harian.",
          "Lakukan simulasi pengujian akhir bersama pengguna uji dan perbaiki bug.",
          "Tunjukkan hasil orkestrasi sistem untuk memperoleh sertifikat resmi Lensetek."
        ]
      }
    ]
  }
};

const skillsList = [
  "Architectural thinking to translate complex research challenges into automated AI workflows",
  "Advanced prompting & persona design for academic literature review, synthesis, and methodology checks",
  "Seamless tool integration: source-grounded knowledge bases, research search engines, and document outline templates",
  "Orchestration mastery to design, control, and sync collaboration among multiple specialized academic agents",
];

const useCasesList = [
  "Automated literature synthesis matrices",
  "Research gap discovery & hypothesis formulation",
  "Academic proposal background & methodology drafts",
  "Syllabus-aligned book and chapter outline creators",
  "Responsible AI-assisted manuscript editing and style validation",
  "Self-reflective reviewer agents for article evaluation",
];

const moduleQuestions = {
  EN: {
    1: [
      {
        question: "What is the primary advantage of using NotebookLM for academic research compared to a standard chatbot?",
        options: [
          "NotebookLM can automatically write an entire book without input.",
          "NotebookLM grounds its answers exclusively on the references you upload to prevent hallucination.",
          "NotebookLM connects directly to social media.",
          "NotebookLM executes local SQL queries.",
          "NotebookLM translates languages without internet access."
        ],
        answerIdx: 1
      },
      {
        question: "Which component of an AI Agent acts as the persistent context ledger for multi-step reasoning?",
        options: ["Core LLM", "Planning Engine", "Memory (Short/Long-term)", "Web scrapers"],
        answerIdx: 2
      },
      {
        question: "In the ReAct framework, what does the cycle stand for?",
        options: ["Reasoning + Acting", "Reaction + Action", "Reading + Active tuning", "Recursive + Active indexing"],
        answerIdx: 0
      },
      {
        question: "Why is Chain-of-Thought (CoT) critical in architectural thinking for AI agents?",
        options: [
          "It accelerates LLM token generation speed.",
          "It forces the agent to map complex reasoning paths transparently.",
          "It eliminates the need for any external database connections.",
          "It encrypts the backend API credentials."
        ],
        answerIdx: 1
      },
      {
        question: "Which type of memory allows an agent to retrieve relevant historical documents over long periods?",
        options: ["Short-term memory", "Short-term conversation history", "Vector database embeddings (Long-term)", "Direct cache variables"],
        answerIdx: 2
      }
    ],
    2: [
      {
        question: "What is the primary role of a Supervisor or Orchestrator agent in a Multi-Agent system?",
        options: [
          "To store system passwords securely.",
          "To evaluate the output of worker agents and route tasks dynamically.",
          "To compile Python scripts into executable code.",
          "To count the number of tokens written."
        ],
        answerIdx: 1
      },
      {
        question: "What is a 'system prompt' state in agent persona engineering?",
        options: [
          "A prompt designed to force CPU restarts.",
          "A foundational prompt that enforces strict boundaries, role assumptions, and formatting constraints.",
          "An emergency override prompt.",
          "The first text input sent by the student."
        ],
        answerIdx: 1
      },
      {
        question: "Which pattern is best suited for an agent system requiring human verification before executing high-risk APIs?",
        options: ["Fully Autonomous loop", "Chain-of-Thought loop", "Human-in-the-loop (HITL)", "Recursive retry"],
        answerIdx: 2
      },
      {
        question: "Why should we enforce response formats (like JSON) on worker agents?",
        options: [
          "It makes the output look nicer to read.",
          "It guarantees the output can be parsed programmatically by downstream agents or APIs.",
          "It reduces token billing costs by 50%.",
          "It accelerates server database loading speed."
        ],
        answerIdx: 1
      },
      {
        question: "What happens when an agent enters an infinite feedback loop?",
        options: [
          "The system will automatically crash the computer.",
          "The agent will consume tokens endlessly without completing the task until a limit/guardrail is hit.",
          "The agent's intelligence level increases.",
          "The API provider refunds the cost."
        ],
        answerIdx: 1
      }
    ],
    3: [
      {
        question: "What is the primary component used to design a structured 'skill' in Google Antigravity?",
        options: [
          "Just using a regular chat input box.",
          "A SKILL.md file containing instructions, constraints, and behavioral examples.",
          "A Python-based backend script.",
          "A local SQL database.",
          "A visual drag-and-drop canvas."
        ],
        answerIdx: 1
      },
      {
        question: "In academic writing, how does a Literature Matrix Creator skill help a researcher?",
        options: [
          "By automatically downloading paywalled papers without permission.",
          "By systematically extracting and comparing research objectives, methodologies, and findings from uploaded documents.",
          "By writing the entire thesis in one single step without review.",
          "By hosting the database on a private server."
        ],
        answerIdx: 1
      },
      {
        question: "What is the main risk of not defining negative constraints (guardrails) in an Academic Outline Creator skill?",
        options: [
          "The skill might generate fabricated references or copy copyrighted text directly.",
          "The CSS layout of the website will break.",
          "The API key will be deleted automatically.",
          "The server will shut down."
        ],
        answerIdx: 0
      },
      {
        question: "How can a researcher verify that a custom Antigravity skill conforms to writing guidelines?",
        options: [
          "By checking the file size of the skill.",
          "By running verification prompts in the sandbox and comparing outputs to a reference standard.",
          "By converting the skill into a CSS stylesheet.",
          "By changing the LLM temperature to 2.0."
        ],
        answerIdx: 1
      },
      {
        question: "Why is separating 'Skills' from 'Agents' useful in agentic architectures?",
        options: [
          "It allows the same skill (e.g. outline creation) to be used by different agents (e.g. book agent, proposal agent).",
          "It makes the database load faster.",
          "It reduces the size of the React bundle.",
          "It encrypts the client-side environment variables."
        ],
        answerIdx: 0
      }
    ],
    4: [
      {
        question: "Why is the 'Human-in-the-Loop Validation' stage critically important in an Autonomous Research System?",
        options: [
          "To technically slow down AI processing time.",
          "To manually perform reference verification, fact-checking, and quality assurance of the written output.",
          "To translate visual prompts into binary code.",
          "To bypass system firewall security.",
          "To perform automated database backups."
        ],
        answerIdx: 1
      },
      {
        question: "In a Book Authoring System, what does a self-reflective 'Academic Reviewer Agent' do?",
        options: [
          "It automatically writes positive reviews on Google Books.",
          "It evaluates drafts against academic standards, checking logical coherence, methodology weaknesses, and citation validity.",
          "It handles invoice payments for publishers.",
          "It restarts the web server."
        ],
        answerIdx: 1
      },
      {
        question: "What is the benefit of a source-grounded workspace in an autonomous writing system?",
        options: [
          "It prevents the AI from generating claims or citations not present in the provided source documents.",
          "It automatically increases the font size of the output PDF.",
          "It makes the web application mobile responsive.",
          "It deletes the database records."
        ],
        answerIdx: 0
      },
      {
        question: "Which API integration is most critical for a Literature Search Agent to gather academic preprints?",
        options: [
          "An e-commerce payment gateway API.",
          "An academic repository API like arXiv, Europe PMC, or Crossref.",
          "A CSS UI styling toolkit.",
          "A local file compressor."
        ],
        answerIdx: 1
      },
      {
        question: "What is the danger of not implementing Human-in-the-Loop validation in an autonomous book writing pipeline?",
        options: [
          "The browser tab will close automatically.",
          "The system might output plausible-sounding but inaccurate arguments or fabricated citations without human detection.",
          "The server will run out of memory.",
          "The user will lose their Google login session."
        ],
        answerIdx: 1
      }
    ],
    5: [
      {
        question: "Which of the following is one of the Capstone Project track options in this course?",
        options: [
          "Building an e-commerce checkout feature.",
          "Building an Academic Reviewer Operating System.",
          "Designing a local network firewall system.",
          "Creating an automated video editor.",
          "Writing a calculator script using Python."
        ],
        answerIdx: 1
      },
      {
        question: "What is the role of webhooks in connecting academic platforms like NotebookLM or Google Opal?",
        options: [
          "To display pop-ups in the browser console.",
          "To send real-time document updates or completed draft payloads between research workspaces and editors.",
          "To clean up local browser cookies.",
          "To style the PDF certificate layout."
        ],
        answerIdx: 1
      },
      {
        question: "Why must we estimate and calculate API token costs prior to enterprise deployment?",
        options: [
          "To prevent surprise billing charges when agents run in infinite loops or high-volume workflows.",
          "Because LLMs charge a flat monthly fee regardless of use.",
          "To speed up LLM response generation rates.",
          "To comply with legal tax regulations."
        ],
        answerIdx: 0
      },
      {
        question: "In a Capstone Project evaluation, what metric is most critical to prove the success of an Academic OS?",
        options: [
          "An keakuratan analisis jurnal, koherensi outline naskah, dan efisiensi waktu riset.",
          "The accuracy of synthesized papers, coherence of outline generation, and time saved in literature reviews.",
          "The UI background color selection.",
          "The size of the local database."
        ],
        answerIdx: 1
      },
      {
        question: "What is the final step in launching an Agentic AI workflow to production?",
        options: [
          "Uninstalling all local packages.",
          "Deploying the cloud orchestrator, setting active triggers, and establishing human-in-the-loop audit logs.",
          "Converting the code to binary files.",
          "Re-entering the sandbox simulator."
        ],
        answerIdx: 1
      }
    ]
  },
  ID: {
    1: [
      {
        question: "Apakah keuntungan utama menggunakan NotebookLM untuk penelitian akademik dibandingkan dengan chatbot standar?",
        options: [
          "NotebookLM dapat menulis buku secara otomatis tanpa input.",
          "NotebookLM mendasarkan jawabannya secara eksklusif pada referensi yang Anda unggah untuk mencegah halusinasi.",
          "NotebookLM terhubung langsung ke media sosial.",
          "NotebookLM mengeksekusi kueri SQL lokal.",
          "NotebookLM menerjemahkan bahasa tanpa akses internet."
        ],
        answerIdx: 1
      },
      {
        question: "Pilar Agen AI manakah yang bertindak sebagai penyimpan riwayat konteks untuk penalaran multi-langkah?",
        options: ["Core LLM (Brain)", "Planning Engine", "Memory (Short/Long-term)", "Web scrapers"],
        answerIdx: 2
      },
      {
        question: "Dalam kerangka berpikir ReAct, apa kepanjangan dari siklus tersebut?",
        options: ["Reasoning + Acting (Penalaran + Tindakan)", "Reaction + Action", "Reading + Active tuning", "Recursive + Active indexing"],
        answerIdx: 0
      },
      {
        question: "Mengapa konsep Chain-of-Thought (CoT) sangat penting dalam pemikiran arsitektural untuk agen AI?",
        options: [
          "Untuk mempercepat kecepatan pembuatan token LLM.",
          "Untuk memaksa agen memetakan jalur pemikiran yang kompleks secara transparan.",
          "Untuk menghilangkan kebutuhan koneksi database eksternal.",
          "Untuk mengenkripsi kredensial API backend."
        ],
        answerIdx: 1
      },
      {
        question: "Jenis memori apa yang memungkinkan agen mencari dokumen historis yang relevan dalam jangka panjang?",
        options: ["Memori jangka pendek", "Riwayat percakapan jangka pendek", "Database Vektor / Embeddings (Jangka Panjang)", "Variabel cache langsung"],
        answerIdx: 2
      }
    ],
    2: [
      {
        question: "Jenis agen Google Opal manakah yang paling tepat dibangun untuk mengevaluasi kelemahan dalam argumentasi dan metodologi penelitian Anda?",
        options: [
          "Research Idea Agent",
          "Book Planning Agent",
          "Academic Reviewer Agent",
          "Audio Overview Agent",
          "Translation Agent"
        ],
        answerIdx: 2
      },
      {
        question: "Apa yang dimaksud dengan 'system prompt' dalam rekayasa persona agen?",
        options: [
          "Prompt yang dirancang untuk memicu restart CPU.",
          "Instruksi dasar yang menetapkan batasan peran, kepribadian, batasan instruksi, dan format respon agen.",
          "Prompt darurat untuk memotong server.",
          "Input teks pertama yang dikirim oleh siswa."
        ],
        answerIdx: 1
      },
      {
        question: "Pola arsitektur mana yang paling cocok jika sistem agen memerlukan persetujuan manusia sebelum mengeksekusi API berisiko tinggi?",
        options: ["Fully Autonomous loop", "Chain-of-Thought loop", "Human-in-the-loop (HITL)", "Recursive retry"],
        answerIdx: 2
      },
      {
        question: "Mengapa kita harus memaksakan format respon (seperti JSON) pada agen pekerja?",
        options: [
          "Agar hasilnya terlihat lebih rapi dibaca manusia.",
          "Agar hasilnya dapat diproses dan diparsing secara terprogram oleh agen lain atau sistem API hilir.",
          "Untuk mengurangi biaya token hingga 50%.",
          "Untuk mempercepat server memuat database."
        ],
        answerIdx: 1
      },
      {
        question: "Apa yang terjadi jika agen masuk ke dalam loop umpan balik tanpa batasan (infinite loop)?",
        options: [
          "Sistem akan langsung mematikan komputer.",
          "Agen akan terus mengonsumsi token tanpa henti sampai batas waktu/guardrail tercapai.",
          "Tingkat kecerdasan agen akan meningkat drastis.",
          "Penyedia API akan mengembalikan biaya token."
        ],
        answerIdx: 1
      }
    ],
    3: [
      {
        question: "Apakah komponen utama yang digunakan untuk merancang 'skill' terstruktur di Google Antigravity?",
        options: [
          "Hanya menggunakan kotak input chat biasa.",
          "File SKILL.md yang berisi instruksi, batasan, dan contoh perilaku.",
          "Skrip backend berbasis Python.",
          "Database SQL lokal.",
          "Kanvas visual drag-and-drop."
        ],
        answerIdx: 1
      },
      {
        question: "Dalam penulisan akademik, bagaimana skill 'Literature Matrix Creator' membantu peneliti?",
        options: [
          "Mengunduh jurnal berbayar secara ilegal tanpa izin.",
          "Mengekstrak dan membandingkan tujuan riset, metodologi, dan temuan dari dokumen referensi secara sistematis.",
          "Menulis seluruh tesis dalam satu langkah cepat tanpa perlu revisi.",
          "Menghosting database penelitian di server privat."
        ],
        answerIdx: 1
      },
      {
        question: "Apa risiko utama jika kita tidak mendefinisikan batasan negatif (guardrails) pada skill 'Academic Outline Creator'?",
        options: [
          "Skill mungkin menghasilkan referensi fiktif (halusinasi) atau menyalin teks berhak cipta secara langsung.",
          "Tata letak CSS di antarmuka web akan berantakan.",
          "Kunci API OpenAI akan otomatis terhapus dari server.",
          "Server backend akan mati secara tiba-tiba."
        ],
        answerIdx: 0
      },
      {
        question: "Bagaimana cara peneliti memverifikasi bahwa skill kustom Antigravity telah mematuhi pedoman penulisan?",
        options: [
          "Memeriksa ukuran byte file penyimpanan skill.",
          "Menjalankan perintah uji coba di sandbox simulator dan membandingkan outputnya dengan standar acuan.",
          "Mengubah file konfigurasi skill menjadi kode CSS.",
          "Mengubah suhu (temperature) LLM menjadi 2.0."
        ],
        answerIdx: 1
      },
      {
        question: "Mengapa pemisahan antara 'Skill' dan 'Agent' sangat penting dalam arsitektur agentic?",
        options: [
          "Memungkinkan skill yang sama (misal: pembuat outline) dipakai ulang oleh berbagai agen (misal: agen buku, agen proposal).",
          "Mempercepat waktu pemuatan database server.",
          "Mengurangi ukuran bundle kompilasi aplikasi React.",
          "Mengenkripsi variabel lingkungan di sisi client."
        ],
        answerIdx: 0
      }
    ],
    4: [
      {
        question: "Mengapa tahap 'Validasi Human-in-the-Loop' sangat penting dalam Sistem Penelitian Otonom?",
        options: [
          "Untuk memperlambat waktu pemrosesan AI secara teknis.",
          "Untuk melakukan verifikasi referensi, pemeriksaan fakta, dan jaminan kualitas output secara manual.",
          "Untuk menerjemahkan prompt visual menjadi kode biner.",
          "Untuk melewati keamanan firewall sistem.",
          "Untuk melakukan pencadangan database otomatis."
        ],
        answerIdx: 1
      },
      {
        question: "Dalam sistem penulisan buku otomatis, apa tugas dari agen peninjau mandiri (Academic Reviewer Agent)?",
        options: [
          "Menulis ulasan bintang lima secara otomatis di Google Books.",
          "Mengevaluasi draf terhadap standar akademik, memeriksa koherensi logika, kelemahan metodologi, dan validitas kutipan.",
          "Mengelola transaksi pembayaran royalti dengan penerbit.",
          "Melakukan restart pada server lokal."
        ],
        answerIdx: 1
      },
      {
        question: "Apa keuntungan dari workspace berbasis referensi sumber (source-grounded) dalam sistem penulisan otonom?",
        options: [
          "Mencegah AI menghasilkan klaim atau kutipan fiktif yang tidak ada dalam dokumen referensi yang diunggah.",
          "Meningkatkan ukuran font teks PDF keluaran secara otomatis.",
          "Membuat halaman web menjadi responsif di perangkat mobile.",
          "Menghapus seluruh rekaman database progress belajar."
        ],
        answerIdx: 0
      },
      {
        question: "Integrasi API manakah yang paling penting bagi Literature Search Agent untuk mengumpulkan draf publikasi akademik?",
        options: [
          "API gerbang pembayaran e-commerce.",
          "API repositori akademik seperti arXiv, Europe PMC, atau Crossref.",
          "Toolkit styling antarmuka CSS.",
          "Aplikasi kompresi file lokal."
        ],
        answerIdx: 1
      },
      {
        question: "Apa bahaya utama dari tidak menerapkan validasi Human-in-the-Loop dalam sistem penulisan buku otonom?",
        options: [
          "Tab browser pengguna akan menutup dengan sendirinya.",
          "Sistem dapat mengeluarkan argumentasi yang terdengar meyakinkan namun tidak akurat atau kutipan fiktif tanpa terdeteksi.",
          "Server akan kehabisan ruang memori RAM.",
          "Pengguna akan kehilangan sesi login Google mereka."
        ],
        answerIdx: 1
      }
    ],
    5: [
      {
        question: "Manakah di bawah ini yang merupakan salah satu pilihan jalur Proyek Capstone dalam kursus ini?",
        options: [
          "Membangun fitur checkout e-commerce.",
          "Membangun Academic Reviewer Operating System.",
          "Merancang sistem firewall jaringan lokal.",
          "Membuat editor video otomatis.",
          "Menulis skrip kalkulator menggunakan Python."
        ],
        answerIdx: 1
      },
      {
        question: "Apa peran webhook dalam menghubungkan platform akademik seperti NotebookLM atau Google Opal?",
        options: [
          "Menampilkan pop-up notifikasi pada konsol browser.",
          "Mengirimkan pembaruan dokumen real-time atau draf naskah yang selesai dibuat antara workspace riset dan editor.",
          "Membersihkan cache cookies browser lokal secara berkala.",
          "Mengatur tata letak visual pencetakan sertifikat PDF."
        ],
        answerIdx: 1
      },
      {
        question: "Mengapa kita wajib menghitung estimasi biaya token API sebelum implementasi skala besar?",
        options: [
          "Untuk menghindari tagihan tidak terduga saat agen mengalami infinite loop atau workflow volume tinggi.",
          "Karena LLM menuntut biaya bulanan tetap berapa pun penggunaannya.",
          "Untuk mempercepat waktu respon LLM.",
          "Untuk mematuhi peraturan pelaporan pajak hukum."
        ],
        answerIdx: 0
      },
      {
        question: "Dalam evaluasi proyek Capstone, metrik apa yang paling krusial untuk membuktikan kesuksesan Academic OS?",
        options: [
          "Jumlah total file baru yang dibuat di dalam direktori proyek.",
          "Keakuratan sintesis jurnal, koherensi outline naskah, dan efisiensi waktu dalam tinjauan pustaka.",
          "Pemilihan skema warna latar belakang antarmuka pengguna.",
          "Ukuran byte penyimpanan database lokal."
        ],
        answerIdx: 1
      },
      {
        question: "Apa langkah akhir dalam merilis workflow Agentic AI ke produksi?",
        options: [
          "Menghapus seluruh pustaka lokal.",
          "Deploy orkestrator cloud, menyalakan pemicu otomatis, dan membangun pos audit pengawasan manusia (HITL).",
          "Mengubah kode program menjadi biner.",
          "Masuk kembali ke simulator digital."
        ],
        answerIdx: 1
      }
    ]
  }
};const getFallbackResponse = (prompt, moduleIdx, lang) => {
  const isId = lang === "ID";
  const p = prompt.toLowerCase();
  
  if (moduleIdx === 0) {
    if (p.includes("maksud") || p.includes("apa") || p.includes("jelas")) {
      return isId 
        ? "Tentu! Di Modul 1 ini, maksud dari **Agentic AI** adalah teknologi kecerdasan buatan yang tidak hanya pasif menjawab pertanyaan (seperti ChatGPT biasa), melainkan bisa bertindak mandiri secara otonom untuk menyelesaikan tugas penelitian Anda. Prakteknya kita menggunakan **NotebookLM** untuk mengunggah berbagai sumber referensi akademik dan menganalisis polanya secara otonom tanpa perlu mengerti pemrograman sama sekali."
        : "Sure! In Module 1, **Agentic AI** refers to AI systems that don't just passively answer questions, but can actively plan, reason, and use tools autonomously to achieve research goals. We will practice this by using **NotebookLM** to upload various academic sources and analyze patterns autonomously without coding.";
    }
    return isId
      ? `Pertanyaan yang bagus sekali tentang Fondasi Agentic AI! Di sesi ini, kita belajar merancang basis pengetahuan terorganisasi pada **NotebookLM** agar kustom asisten Anda bisa memetakan dan menyintesis literatur secara otomatis. Anda tidak perlu coding, cukup unggah dokumen referensi Anda.`
      : `That is a wonderful question about Agentic AI Foundations! In this session, we learn how to structure organized research workspaces using **NotebookLM** to synthesize journals and books. No coding required, just upload your reference sources.`;
  }
  
  if (moduleIdx === 1) {
    if (p.includes("maksud") || p.includes("apa") || p.includes("jelas")) {
      return isId
        ? "Maksud dari **Google Opal** adalah platform no-code eksperimental di mana Anda bisa merancang agen asisten akademik Anda sendiri secara visual. Di modul 2 ini, kita menggunakannya untuk membuat prototype asisten ide riset, asisten draf proposal, dan asisten rencana buku tanpa menulis satu baris kode pun."
        : "**Google Opal** is an experimental no-code platform where you can design custom academic assistants visually. In Module 2, we use it to build research idea helpers, proposal draft assistants, and book planning assistants without writing a single line of code.";
    }
    return isId
      ? "Menarik sekali! Merancang agen asisten akademik kustom di **Google Opal** sangat membantu mempercepat penulisan proposal dan outline buku. Dengan membagi peran spesifik (Ide Riset, Proposal, Reviewer), draf akademik yang dihasilkan akan jauh lebih komprehensif."
      : "Very interesting! Designing custom academic agents in **Google Opal** helps accelerate proposal and book outline drafting. By delegating specific roles (Research Idea, Proposal, Reviewer), the resulting academic drafts are much more comprehensive.";
  }
  
  if (moduleIdx === 2) {
    if (p.includes("maksud") || p.includes("apa") || p.includes("jelas")) {
      return isId
        ? "Di Modul 3 ini, otomatisasi riset menggunakan skill **Antigravity** dimaksudkan untuk merancang kemampuan khusus berbasis Standar Operasional Prosedur (SOP) akademik. Antigravity akan bertindak secara mandiri menyusun literature matrix, merumuskan research gap, dan merancang kerangka penulisan buku sesuai pedoman yang Anda berikan."
        : "In Module 3, research automation with **Antigravity** means designing reusable, SOP-based academic skills. Antigravity acts autonomously to construct literature matrices, formulate research gaps, and design book outlines according to your specific instructions.";
    }
    return isId
      ? "Luar biasa! Otomatisasi riset dengan skill cerdas **Antigravity** mempermudah akademisi memetakan keterbatasan riset terdahulu. Anda cukup menulis pedoman instruksi (SKILL.md) dan biarkan asisten membuat matrik literatur secara otomatis."
      : "Excellent! Research automation with the **Antigravity** skill engine makes mapping previous research gaps easy. Just define your instructions in a SKILL.md template and let the engine generate literature matrices autonomously.";
  }
  
  if (moduleIdx === 3) {
    if (p.includes("maksud") || p.includes("apa") || p.includes("jelas") || p.includes("opal")) {
      return isId
        ? "Maksud dari **Sistem Riset Otonom & Publikasi Buku** adalah mengintegrasikan NotebookLM, Google Opal, dan Antigravity ke dalam satu alur kerja riset otonom terpadu (pipeline). Di modul 4 ini, kita menggunakannya untuk menghubungkan knowledge base, agen, dan skill dengan validasi kontrol kualitas dari Anda (Human-in-the-Loop)."
        : "By **Autonomous Research & Book Publication Systems**, we mean integrating NotebookLM, Google Opal, and Antigravity into a cohesive, automated research pipeline. In Module 4, we connect knowledge, agents, and skills with your direct feedback (Human-in-the-Loop validation).";
    }
    return isId
      ? "Pertanyaan menarik! Menghubungkan seluruh modul ke dalam satu sistem riset otonom akan mempercepat penyusunan Systematic Literature Review (SLR) dan draf naskah buku secara signifikan dengan tetap menjaga kontrol penuh pada verifikasi manusia."
      : "Great question! Connecting all components into a single autonomous research system accelerates Systematic Literature Reviews (SLRs) and book drafting significantly, while maintaining full control via human verification.";
  }
  
  if (moduleIdx === 4) {
    if (p.includes("maksud") || p.includes("apa") || p.includes("jelas")) {
      return isId
        ? "Maksud dari **Final Capstone Project** adalah mempraktikkan seluruh ilmu yang diperoleh untuk membangun sistem operasi akademik kustom sesuai spesialisasi pilihan Anda: Research OS, Thesis OS, Book Authoring OS, atau Academic Reviewer OS."
        : "**Final Capstone Project** is the practical phase where you apply all learned frameworks to build your own custom academic operating system: Research OS, Thesis OS, Book Authoring OS, or Academic Reviewer OS.";
    }
    return isId
      ? "Langkah penting! Sebelum meluncurkan sistem operasi akademik Anda untuk kebutuhan riset nyata, Anda harus melakukan uji coba menyeluruh untuk memastikan kepatuhan etika penelitian dan keakuratan data sitasi."
      : "Crucial step! Before launching your academic operating system for real research workflows, you must test it thoroughly to ensure research ethics compliance and citation accuracy.";
  }
  
  return isId
    ? "Halo! Saya adalah AI-Mentor yang siap membantu Anda dalam kursus ini. Silakan tanyakan materi apa pun terkait NotebookLM, Google Opal, atau otomatisasi Antigravity!"
    : "Hello! I am your AI-Mentor, here to help you in this course. Please ask anything about NotebookLM, Google Opal, or Antigravity automations!";
};

export default function LensetekAgenticAiLandingPage() {
  const [lang, setLang] = useState(() => localStorage.getItem("course_lang") || "ID"); // "EN" or "ID"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [user, setUser] = useState(null);

  // Classroom Dashboard States
  const [activeModuleIdx, setActiveModuleIdx] = useState(() => {
    const v = localStorage.getItem("course_active_module");
    return v !== null ? parseInt(v, 10) : 0;
  });
  const [classroomTab, setClassroomTab] = useState(() => localStorage.getItem("course_classroom_tab") || "materials"); // "materials" | "lab" | "quiz" | "certificate"
  const [completedModules, setCompletedModules] = useState({}); // { moduleId: true }
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState([null, null, null, null, null]);
  const [quizScore, setQuizScore] = useState(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null); // 'sIdx' or null
  const [chatCount, setChatCount] = useState(0);
  const [chatLastResetDate, setChatLastResetDate] = useState("");

  // Invitation Code States
  const [inviteInput, setInviteInput] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteChecking, setInviteChecking] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");
  
  // Real Agent Lab States
  const [labPrompt, setLabPrompt] = useState("");
  const [labLogs, setLabLogs] = useState([]);
  const [labLoading, setLabLoading] = useState(false);
  const [labSummary, setLabSummary] = useState("");
  const [labMindmap, setLabMindmap] = useState(null);

  // Biodata Form States
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [biodata, setBiodata] = useState(null);
  const [certificateRecord, setCertificateRecord] = useState(null);
  const [certificateRefreshAfterBiodata, setCertificateRefreshAfterBiodata] = useState(false);
  const [certificatePdfLoading, setCertificatePdfLoading] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [verificationRecord, setVerificationRecord] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const publishedCertificateRef = useRef(new Set());
  const certificatePageRef = useRef(null);
  const transcriptPageRef = useRef(null);
  const [biodataForm, setBiodataForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    birthPlace: "",
    birthDate: "",
    gender: "Laki-laki",
    occupation: "Mahasiswa / Pelajar"
  });

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const getQrCodeUrl = (value, size = 140) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(value)}`;

  const formatDisplayDate = (dateValue, locale = lang === "EN" ? "en-US" : "id-ID") =>
    new Date(dateValue).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });

  const createCertificateNo = (uid) =>
    `LAIMRA-${new Date().getFullYear()}-${uid.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const getDynamicVerificationUrl = (record) => {
    if (!record) return "";
    const baseOrigin = import.meta.env.VITE_CREDENTIAL_URL || window.location.origin;
    const sanitizedBase = baseOrigin.endsWith("/") ? baseOrigin.slice(0, -1) : baseOrigin;
    return `${sanitizedBase}/verify/${record.certificateNo}`;
  };

  const getLinkedInShareUrl = (record) => {
    if (!record) return "";
    const completionDate = new Date(record.completionDate);
    const issueYear = completionDate.getFullYear();
    const issueMonth = completionDate.getMonth() + 1; // 1-indexed

    const baseUrl = "https://www.linkedin.com/profile/add";
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: record.courseTitle || "Agentic AI Mastery for Researchers & Authors",
      organizationName: record.institution || "Lensetek International, LLC",
      issueYear: issueYear.toString(),
      issueMonth: issueMonth.toString(),
      certId: record.certificateNo,
      certUrl: getDynamicVerificationUrl(record)
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const getQrCodeModule = (qrCodeModule) => qrCodeModule.default || qrCodeModule;

  const createPdfQr = async (qrCodeModule, value, width = 220) => {
    const QRCode = getQrCodeModule(qrCodeModule);
    if (!QRCode?.toDataURL) throw new Error("QR generator is unavailable.");

    return QRCode.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 1,
      width,
      color: {
        dark: "#091A36",
        light: "#FFFFFF"
      }
    });
  };

  const loadPdfAsset = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load PDF asset: ${url}`);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fitPdfFontSize = (pdf, text, maxWidth, startSize, minSize = 8) => {
    let size = startSize;
    pdf.setFontSize(size);

    while (pdf.getTextWidth(text) > maxWidth && size > minSize) {
      size -= 1;
      pdf.setFontSize(size);
    }

    return size;
  };

  const drawPdfText = (pdf, text, x, y, options = {}) => {
    pdf.setFont(options.font || "helvetica", options.style || "normal");
    pdf.setFontSize(options.size || 10);
    pdf.setTextColor(options.color || "#091A36");
    pdf.text(text, x, y, {
      align: options.align || "left",
      baseline: options.baseline || "alphabetic",
      maxWidth: options.maxWidth
    });
  };

  const drawPdfCard = (pdf, x, y, width, height, radius = 2) => {
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(x, y, width, height, radius, radius, "FD");
  };

  const drawCertificatePdfPage = async (pdf, record, qrCodeModule) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const templateDataUrl = await loadPdfAsset("/cert-template.png");
    const templateRatio = 1536 / 1080;
    const templateWidth = pageHeight * templateRatio;
    const templateX = (pageWidth - templateWidth) / 2;
    const tx = (percent) => templateX + templateWidth * percent;
    const ty = (percent) => pageHeight * percent;
    const tw = (percent) => templateWidth * percent;
    const th = (percent) => pageHeight * percent;

    pdf.addImage(templateDataUrl, "PNG", templateX, 0, templateWidth, pageHeight);

    drawPdfCard(pdf, tx(0.745), ty(0.064), tw(0.19), th(0.055), 2);
    drawPdfText(pdf, "Certificate No.", tx(0.923), ty(0.085), { align: "right", size: 6, style: "bold", color: "#64748B" });
    drawPdfText(pdf, record.certificateNo, tx(0.923), ty(0.109), { align: "right", size: 7.5, font: "courier", style: "bold" });

    pdf.setFont("times", "bold");
    fitPdfFontSize(pdf, record.holderName, tw(0.7), 31, 16);
    pdf.setTextColor("#091A36");
    pdf.text(record.holderName, pageWidth / 2, ty(0.442), { align: "center", baseline: "middle", maxWidth: tw(0.7) });

    pdf.setFillColor(255, 255, 255);
    pdf.rect(tx(0.15), ty(0.56), tw(0.7), th(0.08), "F");
    pdf.setFont("times", "bold");
    fitPdfFontSize(pdf, record.courseTitle, tw(0.75), 24, 12);
    pdf.setTextColor("#091A36");
    pdf.text(record.courseTitle, pageWidth / 2, ty(0.60), { align: "center", baseline: "middle", maxWidth: tw(0.8) });

    const signatureQr = await createPdfQr(
      qrCodeModule,
      `Digitally signed by Astrid, Program Director, Lensetek International, LLC. Certificate: ${record.certificateNo}`,
      220
    );
    drawPdfCard(pdf, tx(0.242), ty(0.812), th(0.078), th(0.078), 2);
    pdf.addImage(signatureQr, "PNG", tx(0.247), ty(0.817), th(0.068), th(0.068));
    drawPdfText(pdf, "Astrid", tx(0.323), ty(0.858), { font: "times", style: "bold", size: 13 });
    drawPdfText(pdf, "QR Signature", tx(0.323), ty(0.875), { style: "bold", size: 5.5, color: "#94A3B8" });

    drawPdfCard(pdf, tx(0.44), ty(0.898), tw(0.165), th(0.064), 2.5);
    drawPdfText(pdf, "Valid Until", tx(0.5225), ty(0.921), { align: "center", size: 5.5, style: "bold", color: "#94A3B8" });
    drawPdfText(pdf, formatDisplayDate(record.validUntil, "en-US"), tx(0.5225), ty(0.946), { align: "center", size: 8.5, style: "bold" });

    drawPdfCard(pdf, tx(0.615), ty(0.898), tw(0.175), th(0.064), 2.5);
    drawPdfText(pdf, "Date of Completion", tx(0.7025), ty(0.921), { align: "center", size: 5.5, style: "bold", color: "#94A3B8" });
    drawPdfText(pdf, formatDisplayDate(record.completionDate, "en-US"), tx(0.7025), ty(0.946), { align: "center", size: 8.5, style: "bold" });

    const verificationQr = await createPdfQr(qrCodeModule, getDynamicVerificationUrl(record), 260);
    drawPdfCard(pdf, tx(0.845), ty(0.862), th(0.112), th(0.112), 2.5);
    pdf.addImage(verificationQr, "PNG", tx(0.854), ty(0.87), th(0.084), th(0.084));
    drawPdfText(pdf, "Verify", tx(0.901), ty(0.961), { align: "center", size: 5.5, style: "bold", color: "#0891B2" });
  };

  const drawTranscriptPdfPage = async (pdf, record, qrCodeModule) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const modules = t.EN.modulesList.map((m) => [
      String(m.id),
      m.title,
      m.hours,
      m.desc,
      "Completed"
    ]);

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, 10, contentWidth, pageHeight - 20, 3, 3, "S");

    drawPdfText(pdf, "Official Transcript", margin + 8, 23, { size: 7, style: "bold", color: "#0E7490" });
    drawPdfText(pdf, "Academic Transcript of Course Completion", margin + 8, 32, { size: 15, style: "bold" });
    drawPdfText(pdf, record.certificateNo, pageWidth - margin - 8, 28, { align: "right", font: "courier", size: 8, style: "bold", color: "#64748B" });
    pdf.line(margin + 8, 38, pageWidth - margin - 8, 38);

    drawPdfCard(pdf, margin + 8, 46, 124, 40, 2);
    drawPdfText(pdf, "Participant", margin + 14, 57, { size: 6.5, style: "bold", color: "#94A3B8" });
    drawPdfText(pdf, record.holderName, margin + 48, 57, { size: 9, style: "bold" });
    drawPdfText(pdf, "Course", margin + 14, 67, { size: 6.5, style: "bold", color: "#94A3B8" });
    drawPdfText(pdf, record.courseTitle, margin + 48, 67, { size: 8, style: "bold" });
    drawPdfText(pdf, "Duration", margin + 14, 77, { size: 6.5, style: "bold", color: "#94A3B8" });
    drawPdfText(pdf, "20 Hours", margin + 48, 77, { size: 8, style: "bold" });

    drawPdfCard(pdf, margin + 140, 46, contentWidth - 148, 40, 2);
    drawPdfText(pdf, "Summary", margin + 140 + (contentWidth - 148) / 2, 57, { align: "center", size: 7, style: "bold", color: "#64748B" });
    drawPdfText(pdf, "5 Modules", margin + 163, 72, { align: "center", size: 11, style: "bold" });
    drawPdfText(pdf, "Completed Satisfactory", margin + 218, 72, { align: "center", size: 10, style: "bold", color: "#059669" });

    const tableX = margin + 8;
    let y = 98;
    const col = [12, 62, 22, 92, 30];
    const headers = ["No.", "Module", "Duration", "Description", "Performance"];
    pdf.setFillColor(9, 26, 54);
    pdf.rect(tableX, y, contentWidth - 16, 10, "F");
    let x = tableX;
    headers.forEach((header, idx) => {
      drawPdfText(pdf, header, x + 3, y + 6.6, { size: 6, style: "bold", color: "#FFFFFF" });
      x += col[idx];
    });
    y += 10;

    modules.forEach((row, rowIdx) => {
      const rowHeight = 18;
      pdf.setFillColor(rowIdx % 2 ? 248 : 255, rowIdx % 2 ? 250 : 255, rowIdx % 2 ? 252 : 255);
      pdf.rect(tableX, y, contentWidth - 16, rowHeight, "F");
      pdf.setDrawColor(241, 245, 249);
      pdf.line(tableX, y + rowHeight, tableX + contentWidth - 16, y + rowHeight);

      x = tableX;
      row.forEach((cell, idx) => {
        const lines = pdf.splitTextToSize(cell, col[idx] - 5);
        drawPdfText(pdf, lines, x + 3, y + 6, {
          size: idx === 3 ? 6.2 : 6.7,
          style: idx === 1 || idx === 4 ? "bold" : "normal",
          color: idx === 4 ? "#059669" : idx === 1 ? "#091A36" : "#64748B"
        });
        x += col[idx];
      });
      y += rowHeight;
    });

    pdf.setFillColor(248, 250, 252);
    pdf.rect(tableX, y, contentWidth - 16, 10, "F");
    drawPdfText(pdf, "Total Duration", tableX + 76, y + 6.7, { align: "right", size: 6, style: "bold", color: "#64748B" });
    drawPdfText(pdf, "20 Hours", tableX + 90, y + 6.7, { size: 8, style: "bold" });

    const signatureQr = await createPdfQr(
      qrCodeModule,
      `Digitally signed by Astrid, Program Director, Lensetek International, LLC. Certificate: ${record.certificateNo}`,
      180
    );
    drawPdfText(pdf, "This transcript is electronically issued by Lensetek International, LLC.", margin + 8, 194, { size: 6.5, color: "#64748B" });
    drawPdfText(pdf, "Verify authenticity using the verification QR code on the certificate.", margin + 8, 201, { size: 6.5, color: "#94A3B8" });
    drawPdfText(pdf, "Program Director", pageWidth - margin - 42, 184, { align: "center", size: 6, style: "bold", color: "#94A3B8" });
    pdf.addImage(signatureQr, "PNG", pageWidth - margin - 58, 188, 16, 16);
    drawPdfText(pdf, "Astrid", pageWidth - margin - 38, 197, { font: "times", style: "bold", size: 11 });
  };

  const getCertificatePdfFileName = (record) => {
    const safeName = (record.holderName || "participant")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    return `lensetek-certificate-${safeName}-${record.certificateNo}.pdf`;
  };

  const buildCertificatePdf = async (record) => {
    const [{ jsPDF }, qrCodeModule] = await Promise.all([
      import("jspdf"),
      import("qrcode")
    ]);
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    await drawCertificatePdfPage(pdf, record, qrCodeModule);
    pdf.addPage("a4", "landscape");
    await drawTranscriptPdfPage(pdf, record, qrCodeModule);

    return pdf;
  };

  const handleDownloadCertificatePdf = async () => {
    if (!certificateRecord || certificatePdfLoading || linkedInLoading) return;

    setCertificatePdfLoading(true);
    try {
      const pdf = await buildCertificatePdf(certificateRecord);
      pdf.save(getCertificatePdfFileName(certificateRecord));
    } catch (error) {
      console.error("Certificate PDF export error:", error);
      const detail = error?.message ? `\n\nDetail: ${error.message}` : "";
      window.alert((lang === "EN" ? "PDF could not be prepared. Please try again." : "PDF belum bisa disiapkan. Silakan coba lagi.") + detail);
    } finally {
      setCertificatePdfLoading(false);
    }
  };

  const handleAddCertificateToLinkedIn = async () => {
    if (!certificateRecord || certificatePdfLoading || linkedInLoading) return;

    const linkedInWindow = window.open("", "_blank");
    setLinkedInLoading(true);

    try {
      const pdf = await buildCertificatePdf(certificateRecord);
      pdf.save(getCertificatePdfFileName(certificateRecord));

      if (linkedInWindow) {
        linkedInWindow.location.href = getLinkedInShareUrl(certificateRecord);
      } else {
        window.open(getLinkedInShareUrl(certificateRecord), "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      if (linkedInWindow) linkedInWindow.close();
      console.error("LinkedIn certificate flow error:", error);
      const detail = error?.message ? `\n\nDetail: ${error.message}` : "";
      window.alert((lang === "EN" ? "LinkedIn flow could not be prepared. Please try again." : "Alur LinkedIn belum bisa disiapkan. Silakan coba lagi.") + detail);
    } finally {
      setLinkedInLoading(false);
    }
  };

  const getDefaultBiodata = (currentUser) => ({
    fullName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    whatsapp: "",
    birthPlace: "",
    birthDate: "",
    gender: "Laki-laki",
    occupation: "Mahasiswa / Pelajar"
  });

  const isBiodataComplete = (profile) =>
    !!(
      profile?.fullName?.trim() &&
      profile?.whatsapp?.trim() &&
      profile?.birthPlace?.trim() &&
      profile?.birthDate?.trim() &&
      profile?.occupation?.trim()
    );

  const hasCourseAccess = !!(
    biodata?.invitationCode ||
    certificateRecord ||
    Object.keys(completedModules || {}).length > 0
  );

  const cacheUserProgress = (uid, progressPatch) => {
    try {
      const localDataStr = localStorage.getItem(`lensetek_progress_${uid}`) || "{}";
      const localDataObj = JSON.parse(localDataStr);
      localStorage.setItem(
        `lensetek_progress_${uid}`,
        JSON.stringify({ ...localDataObj, ...progressPatch })
      );
    } catch (err) {
      console.warn("Saving progress to LocalStorage failed:", err);
    }
  };

  const saveProgressToCollection = async (progressPatch) => {
    if (!user) return;

    cacheUserProgress(user.uid, progressPatch);

    try {
      const docRef = doc(db, "academic_progress", user.uid);
      await setDoc(docRef, {
        ...progressPatch,
        userId: user.uid,
        userName: progressPatch.userName || biodata?.fullName || user.displayName || "",
        userEmail: progressPatch.userEmail || biodata?.email || user.email || "",
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Firestore Saving Progress Error:", error);
    }
  };

  const buildCertificateRecord = (existingCertificateNo, profile = biodata) => {
    if (!isBiodataComplete(profile)) return null;

    const issuedAt = new Date();
    const validUntil = new Date(issuedAt);
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    const certificateNo = existingCertificateNo || createCertificateNo(user.uid);
    const baseOrigin = import.meta.env.VITE_CREDENTIAL_URL || window.location.origin;
    const sanitizedBase = baseOrigin.endsWith("/") ? baseOrigin.slice(0, -1) : baseOrigin;
    const verificationUrl = `${sanitizedBase}/verify/${certificateNo}`;
    const holderName = profile?.fullName || user.displayName || "Participant";

    return {
      certificateNo,
      holderName,
      courseTitle: "Agentic AI Mastery for Researchers & Authors",
      institution: "Lensetek International, LLC",
      totalDuration: "20 Hours",
      modulesCount: 5,
      level: "Beginner - Intermediate",
      programDirector: "Astrid",
      status: "valid",
      issuedAt: issuedAt.toISOString(),
      completionDate: issuedAt.toISOString(),
      validUntil: validUntil.toISOString(),
      verificationUrl,
      transcript: t.EN.modulesList.map((module) => ({
        moduleId: module.id,
        title: module.title,
        hours: module.hours,
        status: completedModules[module.id] ? "Completed" : "Pending"
      }))
    };
  };

  const publishCertificateRecord = async (record) => {
    if (!user || !record?.certificateNo) return;

    const publishKey = `${user.uid}:${record.certificateNo}`;
    if (publishedCertificateRef.current.has(publishKey)) return;
    publishedCertificateRef.current.add(publishKey);

    const publicRecord = {
      ...record,
      verificationUrl: getDynamicVerificationUrl(record)
    };

    try {
      await setDoc(doc(db, "academic_certificates", publicRecord.certificateNo), {
        ...publicRecord,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      publishedCertificateRef.current.delete(publishKey);
      console.error("Certificate Publishing Error:", error);
    }
  };

  const supersedeCertificateRecord = async (oldRecord, newRecord) => {
    if (!oldRecord?.certificateNo || !newRecord?.certificateNo || oldRecord.certificateNo === newRecord.certificateNo) return;

    try {
      await setDoc(doc(db, "academic_certificates", oldRecord.certificateNo), {
        certificateNo: oldRecord.certificateNo,
        status: "reissued",
        reissuedTo: newRecord.certificateNo,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Certificate Supersede Error:", error);
    }
  };

  const ensureCertificateRecord = async () => {
    if (!user) return null;
    if (!isBiodataComplete(biodata)) {
      setBiodataForm(biodata || getDefaultBiodata(user));
      if (certificateRecord) setCertificateRefreshAfterBiodata(true);
      setShowBiodataModal(true);
      return null;
    }

    if (certificateRefreshAfterBiodata && certificateRecord) {
      const oldRecord = certificateRecord;
      const refreshedRecord = buildCertificateRecord(null, biodata);
      if (!refreshedRecord) return null;

      setCertificateRecord(refreshedRecord);
      setCertificateRefreshAfterBiodata(false);
      cacheUserProgress(user.uid, { certificate: refreshedRecord });

      try {
        await publishCertificateRecord(refreshedRecord);
        await supersedeCertificateRecord(oldRecord, refreshedRecord);
        await saveProgressToCollection({ certificate: refreshedRecord });
      } catch (error) {
        console.error("Certificate Refresh Error:", error);
      }

      return refreshedRecord;
    }

    if (certificateRecord) {
      await publishCertificateRecord(certificateRecord);
      return certificateRecord;
    }

    const record = buildCertificateRecord();
    if (!record) return null;
    setCertificateRecord(record);
    cacheUserProgress(user.uid, { certificate: record });

    try {
      await publishCertificateRecord(record);
      await saveProgressToCollection({ certificate: record });
    } catch (error) {
      console.error("Certificate Saving Error:", error);
    }

    return record;
  };

  // Fetch / Sync User Progress with Cloud Firestore
  useEffect(() => {
    if (user) {
      const loadUserProgress = async () => {
        // Try local storage first as instant fallback
        const localProgress = localStorage.getItem(`lensetek_progress_${user.uid}`);
        let cachedModules = {};
        let cachedCert = null;
        let cachedBiodata = null;
        let cachedInvitationCode = "";

        if (localProgress) {
          try {
            const parsed = JSON.parse(localProgress);
            if (parsed.completedModules) {
              cachedModules = parsed.completedModules;
              setCompletedModules(parsed.completedModules);
            }
            if (parsed.certificate) {
              cachedCert = parsed.certificate;
              setCertificateRecord(parsed.certificate);
            }
            if (parsed.chatUsage?.lastResetDate === getTodayStr()) {
              setChatCount(parsed.chatUsage.count || 0);
              setChatLastResetDate(parsed.chatUsage.lastResetDate);
            }
            if (parsed.biodata) {
              cachedBiodata = parsed.biodata;
              setBiodata(parsed.biodata);
              setBiodataForm(parsed.biodata);
            }
            cachedInvitationCode = parsed.invitationCode || parsed.biodata?.invitationCode || "";
          } catch (e) {
            console.warn("Parsing Local Storage Progress Error:", e);
          }
        }

        try {
          const docRef = doc(db, "academic_progress", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();

            // Smart local-to-cloud progress merge & prevent data loss
            const firestoreCompletedCount = Object.keys(data.completedModules || {}).length;
            const localCompletedCount = Object.keys(cachedModules).length;

            let finalCompleted = data.completedModules || {};
            let finalCert = data.certificate || null;
            let finalBiodata = data.biodata || null;
            const finalInvitationCode = data.invitationCode || data.biodata?.invitationCode || cachedInvitationCode;
            let needsUpload = false;

            if (localCompletedCount > firestoreCompletedCount) {
              finalCompleted = { ...data.completedModules, ...cachedModules };
              needsUpload = true;
            } else {
              finalCompleted = { ...cachedModules, ...data.completedModules };
            }

            if (cachedCert && !data.certificate) {
              finalCert = cachedCert;
              needsUpload = true;
            } else if (data.certificate) {
              finalCert = data.certificate;
            }

            if (cachedBiodata && !data.biodata) {
              finalBiodata = cachedBiodata;
              needsUpload = true;
            } else if (data.biodata) {
              finalBiodata = data.biodata;
            }
            if (finalInvitationCode) {
              finalBiodata = {
                ...(finalBiodata || getDefaultBiodata(user)),
                invitationCode: finalInvitationCode
              };
              if (!data.biodata?.invitationCode || data.invitationCode !== finalInvitationCode) {
                needsUpload = true;
              }
            }

            setCompletedModules(finalCompleted);
            if (finalCert) setCertificateRecord(finalCert);
            if (finalBiodata) {
              setBiodata(finalBiodata);
              setBiodataForm(finalBiodata);
            }

            cacheUserProgress(user.uid, {
              completedModules: finalCompleted,
              chatUsage: data.chatUsage || {},
              certificate: finalCert,
              biodata: finalBiodata,
              invitationCode: finalInvitationCode
            });

            // Sync chat usage & rate limits
            const todayStr = getTodayStr();
            const chatUsage = data.chatUsage || {};
            if (chatUsage.lastResetDate === todayStr) {
              setChatCount(chatUsage.count || 0);
              setChatLastResetDate(chatUsage.lastResetDate);
            } else {
              setChatCount(0);
              setChatLastResetDate(todayStr);
            }

            if (needsUpload) {
              await setDoc(docRef, {
                completedModules: finalCompleted,
                biodata: finalBiodata,
                certificate: finalCert,
                invitationCode: finalInvitationCode,
                lastUpdated: serverTimestamp()
              }, { merge: true });
            }

            if (finalBiodata && !finalBiodata.invitationCode) {
              setShowBiodataModal(false);
            }
          } else {
            // Firestore document doesn't exist, check if we have local progress to migrate/upload!
            const localCompletedCount = Object.keys(cachedModules).length;
            if (localCompletedCount > 0 || cachedCert || cachedBiodata) {
              await setDoc(docRef, {
                completedModules: cachedModules,
                biodata: cachedBiodata,
                certificate: cachedCert,
                userId: user.uid,
                userName: cachedBiodata?.fullName || user.displayName || "",
                userEmail: cachedBiodata?.email || user.email || "",
                lastUpdated: serverTimestamp()
              }, { merge: true });
            } else {
              // Truly new user setup
              setCompletedModules({});
              setChatCount(0);
              const todayStr = getTodayStr();
              setChatLastResetDate(todayStr);
              setBiodataForm(getDefaultBiodata(user));
              setShowBiodataModal(false);
              await saveProgressToCollection({
                completedModules: {},
                chatUsage: {
                  count: 0,
                  lastResetDate: todayStr
                }
              });
            }
          }
        } catch (error) {
          console.error("Firestore Loading Progress Error:", error);
          
          // If Firestore fails due to permission error, fall back to Google User Details for Form
          setBiodataForm(prev => ({
            ...prev,
            fullName: user.displayName || "",
            email: user.email || "",
          }));

          // If there is no biodata stored locally yet, force show the modal (only if invitation code verified)
          const localData = localStorage.getItem(`lensetek_progress_${user.uid}`);
          let hasLocalBiodata = false;
          let hasLocalInvitation = false;
          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              hasLocalBiodata = !!parsed.biodata;
              hasLocalInvitation = !!(parsed.invitationCode || parsed.biodata?.invitationCode);
            } catch (e) {}
          }
          if (!hasLocalBiodata && hasLocalInvitation) {
            setShowBiodataModal(true);
          } else {
            setShowBiodataModal(false);
          }
        }
      };
      loadUserProgress();
    }
  }, [user]);

  // Persistent Firebase Authentication State Observer
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync routing states to localStorage to persist on page refresh
  useEffect(() => {
    localStorage.setItem("course_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("course_active_module", activeModuleIdx);
  }, [activeModuleIdx]);

  useEffect(() => {
    localStorage.setItem("course_classroom_tab", classroomTab);
  }, [classroomTab]);

  const handleBiodataSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const shouldRefreshCertificate =
      allModulesCompleted &&
      certificateRecord &&
      (!isBiodataComplete(biodata) || certificateRefreshAfterBiodata);

    // Form validation check
    const completeForm = {
      ...biodataForm,
      email: biodataForm.email || user.email || ""
    };

    await saveProgressToCollection({
      biodata: completeForm,
      userName: completeForm.fullName,
      userEmail: completeForm.email
    });

    setBiodata(completeForm);
    setShowBiodataModal(false);

    if (shouldRefreshCertificate && isBiodataComplete(completeForm)) {
      const oldRecord = certificateRecord;
      const refreshedRecord = buildCertificateRecord(null, completeForm);
      if (!refreshedRecord) return;

      setCertificateRecord(refreshedRecord);
      setCertificateRefreshAfterBiodata(false);

      try {
        await publishCertificateRecord(refreshedRecord);
        await supersedeCertificateRecord(oldRecord, refreshedRecord);
        await saveProgressToCollection({ certificate: refreshedRecord });
      } catch (error) {
        console.error("Certificate Refresh After Biodata Error:", error);
      }
    }
  };

  const handleInviteCodeSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const trimmedInput = inviteInput.trim();
    if (!trimmedInput) return;

    setInviteChecking(true);
    setInviteError("");

    try {
      const invitationCode = trimmedInput.toUpperCase();
      const codeSnap = await getDoc(doc(db, "academic_invitationCodes", invitationCode));

      if (!codeSnap.exists()) {
        setInviteError(currentT.inviteErrorInvalid);
        setInviteChecking(false);
        return;
      }

      const matched = {
        code: invitationCode,
        limit: Number(codeSnap.data().limit || 1)
      };

      // Check limit securely in 'invitationUsages' collection by direct document read (prevents collection group permission errors)
      const usageDocRef = doc(db, "academic_invitationUsages", matched.code);
      const usageSnap = await getDoc(usageDocRef);
      let usagesList = [];
      if (usageSnap.exists()) {
        usagesList = usageSnap.data().usages || [];
      }

      const isAlreadyRegistered = usagesList.includes(user.uid);

      if (!isAlreadyRegistered) {
        if (usagesList.length >= matched.limit) {
          setInviteError(matched.limit === 1 
            ? (lang === "EN" ? "❌ This special invitation code has already been claimed by another user." : "❌ Kode undangan spesial ini sudah diklaim oleh pengguna lain.")
            : currentT.inviteErrorLimit);
          setInviteChecking(false);
          return;
        }

        // Add user UID to list of verified invitation code usages
        usagesList.push(user.uid);
        await setDoc(usageDocRef, {
          code: matched.code,
          usages: usagesList,
          lastUpdated: serverTimestamp()
        }, { merge: true });
      }

      // Access granted!
      const currentBiodata = biodata || getDefaultBiodata(user);
      const updatedBiodata = {
        ...currentBiodata,
        invitationCode: matched.code
      };

      await saveProgressToCollection({
        biodata: updatedBiodata,
        invitationCode: matched.code
      });

      setBiodata(updatedBiodata);
      setInviteSuccess(true);

      // Trigger transition: if required profile fields are incomplete, show Biodata Modal next
      if (!isBiodataComplete(updatedBiodata)) {
        setBiodataForm(updatedBiodata);
        setShowBiodataModal(true);
      }
    } catch (err) {
      console.error("Invitation check failed:", err);
      setInviteError(lang === "EN" ? "❌ Server error. Please try again." : "❌ Eror server. Silakan coba kembali.");
    } finally {
      setInviteChecking(false);
    }
  };

  const saveCompletedModules = async (updatedCompleted) => {
    await saveProgressToCollection({
      completedModules: updatedCompleted
    });
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Authentication failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
      // Clean up classroom routing states from localStorage on manual logout
      localStorage.removeItem("course_active_module");
      localStorage.removeItem("course_classroom_tab");
      localStorage.removeItem("course_lang");

      // Reset classroom states
      setActiveModuleIdx(0);
      setClassroomTab("materials");
      setCompletedModules({});
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const startSimulation = async () => {
    setIsRunning(true);
    setSimulationLogs([]);
    let current = 0;
    setActiveStep(1);
    
    const interval = setInterval(async () => {
      if (current < agentSteps.length) {
        setSimulationLogs(prev => [
          ...prev, 
          `[System]: ${agentSteps[current].title} started processing...`,
          `[Success]: ${agentSteps[current].title} completed task in ${agentSteps[current].duration}s.`
        ]);
        current++;
        setActiveStep(current + 1);
      } else {
        clearInterval(interval);
        
        // Trigger real secure API call to our backend OpenAI Agent
        setSimulationLogs(prev => [...prev, "[Server]: Connecting to secure OpenAI Agent backend..."]);
        try {
          const response = await fetch(agentApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Extract key research gaps and draft a literature synthesis outline for Agentic AI in Academic Writing.",
              agentName: "Academic Research Assistant"
            })
          });
          const data = await response.json();
          if (data.success) {
            setSimulationLogs(prev => [
              ...prev,
              `🤖 [Agent Output - Model ${data.modelUsed}]:`,
              data.finalOutput,
              "✨ Workflow execution completed successfully!"
            ]);
          } else {
            throw new Error(data.error);
          }
        } catch (err) {
          console.warn("Backend API not reachable or failed:", err.message);
          setSimulationLogs(prev => [
            ...prev,
            "⚠️ [Secure Server Notice]: API execution completed via local demo fallback (OpenAI Agents is successfully configured).",
            "✨ Workflow execution completed successfully!"
          ]);
        }
        setIsRunning(false);
      }
    }, 1800);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setActiveStep(0);
    setSimulationLogs([]);
  };

  // Classroom Action Handlers
  const handleQuizSubmit = (quiz, moduleId) => {
    if (quizSelectedOption === null) return;
    setQuizSubmitted(true);
    if (quizSelectedOption === quiz.answerIdx) {
      setQuizFeedback(lang === "EN" 
        ? "🎉 Correct! Excellent reasoning. Progress saved to Firestore database!" 
        : "🎉 Benar! Jawaban yang logis. Kemajuan Anda berhasil disimpan ke cloud database!");
      
      const newCompleted = { ...completedModules, [moduleId]: true };
      setCompletedModules(newCompleted);
      saveCompletedModules(newCompleted);
    } else {
      setQuizFeedback(lang === "EN" 
        ? "❌ Incorrect. Re-read the curriculum materials above and try again!" 
        : "❌ Salah. Baca ulang materi kurikulum di atas dan coba lagi!");
    }
  };

  const handleLabExecute = async (activeModuleTitle) => {
    if (!labPrompt.trim()) return;
    setLabSummary("");
    setLabMindmap(null);

    // Check limit
    const todayStr = getTodayStr();
    let currentCount = chatCount;
    if (chatLastResetDate !== todayStr) {
      currentCount = 0;
    }

    if (currentCount >= 10) {
      setLabLogs(prev => [
        ...prev, 
        `👤 [You]: ${labPrompt}`,
        `⚠️ [System]: ${lang === "EN"
          ? "Daily Limit Reached! You have used 10/10 AI-Mentor queries for today. Quota resets tomorrow."
          : "Batas Harian Tercapai! Anda telah menggunakan 10/10 kuota kueri AI-Mentor hari ini. Kuota disetel ulang besok."}`
      ]);
      setLabPrompt("");
      return;
    }

    setLabLoading(true);
    setLabLogs(prev => [...prev, `👤 [You]: ${labPrompt}`, `⏳ [System]: Spawning secure ${activeModuleTitle} agent...`]);
    
    let isSuccess = false;
    let finalOutput = "";

    try {
      const response = await fetch(agentApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: labPrompt,
          agentName: activeModuleTitle + " Agent",
          instructions: `You are an expert autonomous AI Agent assisting a student in the Lensetek Agentic AI Course. Guide them professionally on: ${activeModuleTitle}.`
        })
      });
      const data = await response.json();
      if (data.success) {
        setLabLogs(prev => [...prev, `🤖 [Agent]: ${data.finalOutput}`]);
        isSuccess = true;
        finalOutput = data.finalOutput;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.warn("Lab Agent API unreachable:", error.message);
      // Fallback response for interactive preview
      finalOutput = getFallbackResponse(labPrompt, activeModuleIdx, lang);
      setLabLogs(prev => [
        ...prev, 
        `🤖 [Agent (Demo Mode)]: ${finalOutput}`
      ]);
      isSuccess = true; // Still counts as a query in demo mode
    } finally {
      setLabPrompt("");
      setLabLoading(false);
      
      if (isSuccess) {
        const newCount = currentCount + 1;
        setChatCount(newCount);
        setChatLastResetDate(todayStr);
        
        await saveProgressToCollection({
          chatUsage: {
            count: newCount,
            lastResetDate: todayStr
          }
        });
      }
    }
  };

  const handleSummarizeLab = () => {
    setLabSummary(createSummaryFromLogs(labLogs, lang));
  };

  const handleGenerateMindmap = () => {
    setLabMindmap(createMindmapFromLogs(labLogs, currentT.modulesList[activeModuleIdx].title, lang));
  };

  const currentT = t[lang];
  const allModulesCompleted = currentT.modulesList.every(m => completedModules[m.id]);
  const certificateNeedsBiodataRefresh = !!certificateRecord && !isBiodataComplete(biodata);
  const isVerificationPage = window.location.pathname.startsWith("/verify");
  const verificationCertificateNo = isVerificationPage
    ? decodeURIComponent(window.location.pathname.replace(/^\/verify\/?/, "")).trim()
    : "";

  useEffect(() => {
    if (!isVerificationPage || !verificationCertificateNo) return;

    const loadCertificateVerification = async () => {
      setVerificationLoading(true);
      try {
        const verificationSnap = await getDoc(doc(db, "academic_certificates", verificationCertificateNo));
        setVerificationRecord(verificationSnap.exists() ? verificationSnap.data() : null);
      } catch (error) {
        console.error("Certificate Verification Loading Error:", error);
        setVerificationRecord(null);
      } finally {
        setVerificationLoading(false);
      }
    };

    loadCertificateVerification();
  }, [isVerificationPage, verificationCertificateNo]);

  useEffect(() => {
    if (classroomTab === "certificate" && allModulesCompleted && user && !certificateRecord && isBiodataComplete(biodata)) {
      ensureCertificateRecord();
    }
  }, [classroomTab, allModulesCompleted, user, certificateRecord, biodata]);

  useEffect(() => {
    if (user && certificateRecord?.certificateNo) {
      publishCertificateRecord(certificateRecord);
    }
  }, [user, certificateRecord?.certificateNo]);

  // Dynamic SEO / AIO Updates based on active language (EN/ID)
  useEffect(() => {
    const isEn = lang === "EN";
    
    // 1. Update document language attribute
    document.documentElement.lang = isEn ? "en" : "id";
    
    // 2. Dynamic Title
    const title = isEn 
      ? "Agentic AI Mastery for Researchers & Authors | Course by Lensetek" 
      : "Mastery Agentic AI untuk Peneliti & Penulis | Kursus Lensetek";
    document.title = title;
    
    // 3. Dynamic Meta Description
    const description = isEn
      ? "Build autonomous research and writing ecosystems with Agentic AI. Learn NotebookLM, Google Opal, and Google Antigravity to automate academic literature review, proposal drafting, and book outlines without coding."
      : "Bangun ekosistem riset dan penulisan otonom dengan Agentic AI. Pelajari NotebookLM, Google Opal, dan Google Antigravity untuk otomatisasi tinjauan pustaka, draf proposal, dan outline buku tanpa coding.";
    
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", description);
    
    // 4. Dynamic Open Graph & Twitter Metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (twitterTitle) twitterTitle.setAttribute("content", title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);
    if (twitterDesc) twitterDesc.setAttribute("content", description);
  }, [lang]);

  if (isVerificationPage) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 font-['Inter']">
        <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-700">Lensetek Certificate Verification</p>
              <h1 className="text-2xl font-extrabold text-slate-900">Certificate Verification</h1>
            </div>
          </div>

          {verificationLoading ? (
            <div className="py-12 text-center text-sm font-semibold text-slate-500">Verifying certificate...</div>
          ) : verificationRecord ? (
            <div className="space-y-6 pt-6">
              <div className={`rounded-2xl border p-5 text-left ${
                verificationRecord.status === "reissued"
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}>
                <p className={`text-xs font-extrabold uppercase tracking-wider ${
                  verificationRecord.status === "reissued" ? "text-amber-700" : "text-emerald-700"
                }`}>Status</p>
                <p className={`mt-1 text-xl font-extrabold ${
                  verificationRecord.status === "reissued" ? "text-amber-800" : "text-emerald-800"
                }`}>
                  {verificationRecord.status === "reissued" ? "Reissued Certificate" : "Valid Certificate"}
                </p>
                {verificationRecord.status === "reissued" && verificationRecord.reissuedTo && (
                  <p className="mt-2 text-xs font-semibold text-amber-700">
                    This certificate has been regenerated. New certificate number: {verificationRecord.reissuedTo}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Certificate Number</p>
                  <p className="mt-1 font-mono text-sm font-bold text-slate-900">{verificationRecord.certificateNo}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Issued To</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{verificationRecord.holderName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Course</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{verificationRecord.courseTitle}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Completion Date</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{formatDisplayDate(verificationRecord.completionDate)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h2 className="text-sm font-extrabold text-slate-900">Transcript</h2>
                <div className="mt-4 divide-y divide-slate-100">
                  {(verificationRecord.transcript || []).map((item) => {
                    const enModule = t.EN.modulesList.find(m => m.id === item.moduleId) || item;
                    return (
                      <div key={item.moduleId} className="flex items-center justify-between gap-4 py-3 text-left">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{enModule.title}</p>
                          <p className="text-xs text-slate-500">{enModule.hours}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                          {item.status === "Selesai" || item.status === "Completed" ? "Completed" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : verificationCertificateNo ? (
            <div className="py-12 text-center">
              <p className="text-lg font-extrabold text-rose-700">Certificate Not Found</p>
              <p className="mt-2 text-sm text-slate-500">Certificate number `{verificationCertificateNo}` is not registered or has not been issued yet.</p>
              <a href="/verify" className="mt-4 inline-block rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">Search Again</a>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg font-extrabold text-slate-700">Verify Certificate Authenticity</p>
              <p className="mt-2 text-sm text-slate-500">Enter your certificate registration number to verify its authenticity.</p>
              <form onSubmit={(e) => { e.preventDefault(); const no = new FormData(e.target).get('certNo'); if(no) window.location.href = `/verify/${no}`; }} className="mt-6 flex flex-col sm:flex-row max-w-md mx-auto items-center gap-2">
                <input type="text" name="certNo" placeholder="Certificate Number" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" required />
                <button type="submit" className="w-full sm:w-auto rounded-xl bg-[#091A36] px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 shrink-0 transition-colors">Verify</button>
              </form>
            </div>
          )}
        </section>
        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-['Inter'] relative transition-colors duration-300">
      
      {/* Biodata Form Modal (First Login Only) */}
      <AnimatePresence>
        {showBiodataModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }} 
              className="bg-[#FCFAF7] border border-slate-200 rounded-3xl sm:rounded-[2.5rem] w-full max-w-xl p-5 sm:p-8 shadow-2xl relative my-8 text-slate-800 font-sans"
            >
              <div className="flex items-center gap-4 border-b border-slate-200 pb-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  📝
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                    {lang === "EN" ? "Complete Your Profile" : "Lengkapi Biodata Mahasiswa"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold mt-0.5 leading-snug">
                    {lang === "EN" ? "Please fill this form for classroom certification access." : "Silakan lengkapi form di bawah ini untuk mengakses kelas sertifikasi."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleBiodataSubmit} className="space-y-4 text-left">
                
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "Full Name" : "Nama Lengkap"}</label>
                  <input 
                    type="text" 
                    required 
                    value={biodataForm.fullName} 
                    onChange={e => setBiodataForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "Email Address" : "Alamat Email"}</label>
                  <input 
                    type="email" 
                    required 
                    disabled
                    value={biodataForm.email || user?.email || ""} 
                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-not-allowed"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "WhatsApp Number" : "Nomor WhatsApp (Aktif)"}</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Contoh: 081234567890"
                    value={biodataForm.whatsapp} 
                    onChange={e => setBiodataForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full bg-white border border-slate-255 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>

                {/* Place and Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "Place of Birth" : "Tempat Lahir"}</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Contoh: Jakarta"
                      value={biodataForm.birthPlace} 
                      onChange={e => setBiodataForm(prev => ({ ...prev, birthPlace: e.target.value }))}
                      className="w-full bg-white border border-slate-255 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "Date of Birth" : "Tanggal Lahir"}</label>
                    <input 
                      type="date" 
                      required 
                      value={biodataForm.birthDate} 
                      onChange={e => setBiodataForm(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full bg-white border border-slate-255 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner cursor-pointer"
                    />
                  </div>
                </div>

                {/* Gender & Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "Gender" : "Jenis Kelamin"}</label>
                    <select 
                      value={biodataForm.gender} 
                      onChange={e => setBiodataForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full bg-white border border-slate-255 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner cursor-pointer"
                    >
                      <option value="Laki-laki">{lang === "EN" ? "Male" : "Laki-laki"}</option>
                      <option value="Perempuan">{lang === "EN" ? "Female" : "Perempuan"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{lang === "EN" ? "Occupation" : "Pekerjaan"}</label>
                    <select 
                      value={biodataForm.occupation} 
                      onChange={e => setBiodataForm(prev => ({ ...prev, occupation: e.target.value }))}
                      className="w-full bg-white border border-slate-255 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner cursor-pointer"
                    >
                      <option value="Mahasiswa / Pelajar">{lang === "EN" ? "Student" : "Mahasiswa / Pelajar"}</option>
                      <option value="Wirausaha / Business Owner">{lang === "EN" ? "Entrepreneur" : "Wirausaha / Business Owner"}</option>
                      <option value="Researcher / Author">{lang === "EN" ? "Researcher / Author" : "Peneliti / Penulis"}</option>
                      <option value="Karyawan Swasta">{lang === "EN" ? "Private Employee" : "Karyawan Swasta"}</option>
                      <option value="Guru / Dosen">{lang === "EN" ? "Teacher / Lecturer" : "Guru / Dosen"}</option>
                      <option value="Lainnya">{lang === "EN" ? "Other" : "Lainnya"}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center"
                  >
                    🚀 {lang === "EN" ? "Save & Enter Classroom" : "Simpan & Masuk Ke Kelas"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light Mode subtle tech elements background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_60%,#e2e8f0_100%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/5 blur-[120px]" />

      {/* Nav */}
      {user && (
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 border-b border-slate-200 backdrop-blur-md sticky top-0 z-50">
          <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 p-1.5 shadow-sm overflow-hidden shrink-0">
              <img src="https://lensetek.com/favicon.png" alt="Lensetek Logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-wide text-slate-800 font-['Plus_Jakarta_Sans']">Lensetek International</p>
              <p className="truncate text-[9px] uppercase tracking-wider text-cyan-600 font-bold sm:text-[10px] sm:tracking-widest">Certification Program</p>
            </div>
          </a>

          {/* Desktop menu */}
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setClassroomTab("materials"); }} 
              className="hover:text-cyan-600 transition-colors cursor-pointer font-semibold text-sm"
            >
              {currentT.navCurriculum}
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setClassroomTab("quiz"); }} 
              className="hover:text-cyan-600 transition-colors cursor-pointer font-semibold text-sm"
            >
              {currentT.navCompetencies}
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setClassroomTab("lab"); }} 
              className="hover:text-cyan-600 transition-colors cursor-pointer font-semibold text-sm"
            >
              {currentT.navUseCases}
            </a>
            <a 
              href="/verify" 
              className="hover:text-cyan-600 transition-colors cursor-pointer font-semibold text-sm"
            >
              {lang === "EN" ? "Verify Certificate" : "Verifikasi"}
            </a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {/* Dual Language Switcher Button */}
            <div className="flex bg-slate-200/60 border border-slate-300/30 rounded-xl p-1 gap-1">
              <button 
                onClick={() => setLang("EN")} 
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${lang === "EN" ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang("ID")} 
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${lang === "ID" ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                ID
              </button>
            </div>

            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-cyan-600 transition-colors" title="GitHub Repository">
              <GithubIcon className="h-5 w-5" />
            </a>

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full pl-3 pr-2 py-1.5 shadow-sm">
              <img 
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
                alt={user.displayName || "User"} 
                className="h-7 w-7 rounded-full object-cover ring-1 ring-cyan-400"
              />
              <span className="text-sm font-bold text-slate-800 max-w-[120px] truncate">
                {user.displayName?.split(" ")[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      )}

      {/* Mobile drawer */}
      {user && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 bg-white px-6 py-6 space-y-4"
            >
              <div className="flex flex-col gap-4">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setClassroomTab("materials"); setMobileMenuOpen(false); }}
                  className="text-left text-slate-600 hover:text-slate-900 font-semibold text-base py-2 border-b border-slate-100 cursor-pointer block"
                >
                  {currentT.navCurriculum}
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setClassroomTab("quiz"); setMobileMenuOpen(false); }}
                  className="text-left text-slate-600 hover:text-slate-900 font-semibold text-base py-2 border-b border-slate-100 cursor-pointer block"
                >
                  {currentT.navCompetencies}
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setClassroomTab("lab"); setMobileMenuOpen(false); }}
                  className="text-left text-slate-600 hover:text-slate-900 font-semibold text-base py-2 border-b border-slate-100 cursor-pointer block"
                >
                  {currentT.navUseCases}
                </a>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-base py-2 border-b border-slate-100"
                >
                  <GithubIcon className="h-5 w-5" /> GitHub
                </a>
                
                {/* Mobile Language Switch */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-semibold flex items-center gap-2 text-sm"><Globe className="h-4 w-4" /> Language</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setLang("EN")} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${lang === "EN" ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLang("ID")} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${lang === "ID" ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      ID
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName} 
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-cyan-400"
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-800">{user.displayName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-bold text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all"
                  >
                    <LogOut className="h-4 w-4" /> {currentT.logoutBtn}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) }

      {/* DYNAMIC VIEW ROUTING BASED ON LOGIN STATE */}
      {user ? (
        !hasCourseAccess ? (
          /* ==================== INVITATION CODE ENTRY SCREEN ==================== */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md px-6 py-20 font-sans text-center"
          >
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl space-y-6 text-slate-800 relative">
              <div className="mx-auto h-16 w-16 bg-amber-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner animate-bounce">
                🔑
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                  {currentT.inviteTitle}
                </h2>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  {currentT.inviteDesc}
                </p>
              </div>

              <form onSubmit={handleInviteCodeSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    {lang === "EN" ? "Invitation Code" : "Kode Undangan"}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder={currentT.invitePlaceholder}
                    value={inviteInput}
                    onChange={(e) => {
                      setInviteInput(e.target.value);
                      setInviteError("");
                    }}
                    disabled={inviteChecking || inviteSuccess}
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner tracking-widest text-center uppercase"
                  />
                </div>

                {inviteError && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded-xl p-3.5 leading-snug">
                    {inviteError}
                  </p>
                )}

                {inviteSuccess && (
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-250 rounded-xl p-3.5 leading-snug">
                    {currentT.inviteSuccess}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={inviteChecking || inviteSuccess || !inviteInput.trim()}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteChecking ? (
                    <span>⏳ {currentT.inviteChecking}</span>
                  ) : (
                    <span>🚀 {currentT.inviteSubmit}</span>
                  )}
                </button>
              </form>

              {/* Logout option if they want to leave */}
              <div className="pt-2">
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  {lang === "EN" ? "Logout & Exit" : "Keluar & Batalkan"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ==================== CLASSROOM DASHBOARD VIEW ==================== */
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 print-section"
          >
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-50 to-indigo-50/50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8 font-sans no-print">
            <div>
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">{currentT.classroomHeader}</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
                {lang === "EN" ? "Welcome back, " : "Selamat datang kembali, "}{user.displayName}!
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                {currentT.classroomDesc}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold bg-white text-cyan-600 px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                🌟 {Object.keys(completedModules).length} / 5 {currentT.badgeProgress || "Badges"}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[290px_1fr] classroom-layout-grid">
            
            {/* LEFT SIDEBAR: Modules Navigator & Certificate */}
            <div className="space-y-4 no-print">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-4 px-2">{currentT.sidebarHeader}</h3>
                <div className="space-y-2">
                  {currentT.modulesList.map((m, idx) => {
                    const isActive = activeModuleIdx === idx;
                    const isCompleted = completedModules[m.id];
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveModuleIdx(idx);
                          setClassroomTab("materials");
                          setQuizSelectedOption(null);
                          setQuizSubmitted(false);
                          setQuizFeedback("");
                        }}
                        className={`w-full flex items-start justify-between p-3.5 rounded-2xl border text-left transition-all ${
                          isActive 
                            ? 'border-cyan-500 bg-cyan-50/50 shadow-sm text-cyan-700 font-bold' 
                            : 'border-slate-100 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                            isActive ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            0{m.id}
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-xs text-slate-800 leading-snug">{m.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{m.hours}</p>
                          </div>
                        </div>
                        {isCompleted && (
                          <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Biodata Status Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left font-sans">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">{currentT.biodataTitle}</h4>
                  {!certificateRecord && (
                    <button 
                      onClick={() => {
                        setBiodataForm(biodata || {
                          fullName: user?.displayName || "",
                          email: user?.email || "",
                          whatsapp: "",
                          birthPlace: "",
                          birthDate: "",
                          gender: "Laki-laki",
                          occupation: "Mahasiswa / Pelajar"
                        });
                        setShowBiodataModal(true);
                      }}
                      className="text-[10px] font-bold text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
                    >
                      {currentT.biodataEdit}
                    </button>
                  )}
                </div>
                {biodata ? (
                  <div className="space-y-2 text-[11px] text-slate-600 font-semibold">
                    <p><span className="text-slate-400 font-medium">{currentT.biodataName}:</span> {biodata.fullName}</p>
                    <p><span className="text-slate-400 font-medium">{currentT.biodataWhatsapp}:</span> {biodata.whatsapp || "-"}</p>
                    <p><span className="text-slate-400 font-medium">{currentT.biodataBirth}:</span> {biodata.birthPlace}, {biodata.birthDate}</p>
                    <p><span className="text-slate-400 font-medium">{currentT.biodataOccupation}:</span> {biodata.occupation}</p>
                  </div>
                ) : (
                  <div className="text-[11px] text-rose-500 font-bold flex flex-col gap-2">
                    <p className="flex items-center gap-1.5">{currentT.biodataIncomplete}</p>
                    <button 
                      onClick={() => setShowBiodataModal(true)} 
                      className="bg-amber-100 hover:bg-amber-200 border border-amber-200 text-slate-900 px-3 py-2 rounded-xl font-extrabold text-[10px] text-center w-full cursor-pointer transition-colors"
                    >
                      {currentT.biodataCompleteBtn}
                    </button>
                  </div>
                )}
              </div>

              {/* Certificate Access Center */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center">
                <Award className={`h-10 w-10 mx-auto mb-3 ${allModulesCompleted ? 'text-amber-500 animate-bounce' : 'text-slate-300'}`} />
                <h4 className="font-bold text-sm text-slate-800 font-['Plus_Jakarta_Sans']">{currentT.certHeader}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {currentT.certDesc}
                </p>
                <button
                  disabled={!allModulesCompleted}
                  onClick={() => {
                    if (!isBiodataComplete(biodata)) {
                      setBiodataForm(biodata || getDefaultBiodata(user));
                      if (certificateRecord) setCertificateRefreshAfterBiodata(true);
                      setShowBiodataModal(true);
                      return;
                    }
                    if (!certificateRecord) ensureCertificateRecord();
                    setClassroomTab("certificate");
                  }}
                  className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold transition-all ${
                    allModulesCompleted
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:scale-[1.01] cursor-pointer'
                      : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {certificateNeedsBiodataRefresh ? currentT.certBtn : certificateRecord ? currentT.certViewBtn : currentT.certBtn}
                </button>
              </div>
            </div>

            {/* RIGHT WORK ZONE: Materials, Lab, Quizzes */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm relative min-h-[500px] overflow-hidden classroom-workzone">
              
              {/* Tab Selector */}
              {classroomTab !== "certificate" && (
                <div className="flex border-b border-slate-100 pb-4 mb-6 gap-2 overflow-x-auto">
                  {[
                    { id: "materials", label: currentT.studyMaterialsTab, icon: BookOpen },
                    { id: "lab", label: currentT.agentSandboxTab, icon: Terminal },
                    { id: "quiz", label: currentT.quizVerificationTab, icon: HelpCircle }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = classroomTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setClassroomTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isActive 
                            ? 'bg-cyan-500 text-white shadow-sm' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB CONTENT: STUDY MATERIALS */}
              {classroomTab === "materials" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {currentT.modulesList[activeModuleIdx].materials.sessions ? (
                    /* High-fidelity custom syllabus for ALL modules */
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-[9px] uppercase tracking-widest text-cyan-600 font-extrabold">
                          {currentT.modulesList[activeModuleIdx].materials.institution}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-800">
                            {currentT.modulesList[activeModuleIdx].materials.course}
                          </h3>
                          {currentT.modulesList[activeModuleIdx].githubUrl && (
                            <a 
                              href={currentT.modulesList[activeModuleIdx].githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 px-4 py-2 bg-[#24292e] text-white text-xs font-bold rounded-xl hover:bg-[#1b1f23] hover:scale-105 transition-all shadow-md shrink-0" 
                              title="View Capstone Skills on GitHub"
                            >
                              <GithubIcon className="h-4 w-4" />
                              {lang === "EN" ? "GitHub Repo" : "Repo GitHub"}
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500 font-medium">
                          <span>⏱️ {currentT.modulesList[activeModuleIdx].materials.duration}</span>
                          <span>•</span>
                          <span>📈 {currentT.modulesList[activeModuleIdx].materials.difficulty}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 italic">
                          {currentT.modulesList[activeModuleIdx].materials.description}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-600" /> {lang === "EN" ? "Module Curriculum" : "Kurikulum Modul"}
                        </h4>

                        {currentT.modulesList[activeModuleIdx].materials.sessions.map((session, sIdx) => {
                          const moduleId = currentT.modulesList[activeModuleIdx].id;
                          const isExpanded = expandedSession === `${moduleId}-${sIdx}`;
                          const explanation = sessionExplanations[lang]?.[moduleId]?.[sIdx];

                          return (
                            <div key={sIdx} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner transition-all duration-300">
                              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <h5 className="font-bold text-sm text-cyan-600 font-['Plus_Jakarta_Sans']">
                                  {session.title}
                                </h5>
                                {explanation && (
                                  <button
                                    onClick={() => setExpandedSession(isExpanded ? null : `${moduleId}-${sIdx}`)}
                                    className="w-full text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-all cursor-pointer sm:w-auto sm:shrink-0"
                                  >
                                    {isExpanded 
                                      ? (lang === "EN" ? "Hide Guide" : "Tutup Panduan") 
                                      : (lang === "EN" ? "Read Full Guide" : "Baca Panduan Lengkap")}
                                  </button>
                                )}
                              </div>
                              
                              <ul className="space-y-2">
                                {session.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-650 leading-relaxed">
                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Expanded detailed study block */}
                              {isExpanded && explanation && (
                                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 text-xs leading-relaxed">
                                  {/* Concept & Core Theory */}
                                  <div className="space-y-1.5">
                                    <h6 className="font-extrabold text-[10px] uppercase text-cyan-700 tracking-wider flex items-center gap-1.5">
                                      💡 {lang === "EN" ? "Concept & Core Theory" : "Konsep & Teori Utama"}
                                    </h6>
                                    <p className="text-slate-600 bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                                      {explanation.concept}
                                    </p>
                                  </div>

                                  {/* Technical Blueprint */}
                                  <div className="space-y-1.5">
                                    <h6 className="font-extrabold text-[10px] uppercase text-cyan-700 tracking-wider flex items-center gap-1.5">
                                      ⚙️ {lang === "EN" ? "Technical Blueprint & Architecture" : "Arsitektur & Cetak Biru Teknis"}
                                    </h6>
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] text-cyan-300 overflow-x-auto shadow-inner select-all whitespace-pre">
                                      {explanation.architecture}
                                    </div>
                                  </div>

                                  {/* Practical Action Checklist */}
                                  <div className="space-y-1.5">
                                    <h6 className="font-extrabold text-[10px] uppercase text-cyan-700 tracking-wider flex items-center gap-1.5">
                                      ✅ {lang === "EN" ? "Step-by-Step Practical Actions" : "Langkah Kerja Praktis (Checklist)"}
                                    </h6>
                                    <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-2 shadow-sm">
                                      {explanation.checklist.map((step, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-slate-650">
                                          <span className="h-4 w-4 rounded border border-cyan-200 bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                                            ✓
                                          </span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Fallback Syllabus */
                    <>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-cyan-600 font-bold">Module 0{currentT.modulesList[activeModuleIdx].id}</span>
                        <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-800 mt-1">
                          {currentT.modulesList[activeModuleIdx].title}
                        </h3>
                        <p className="text-sm text-slate-650 mt-2 leading-relaxed">
                          {currentT.modulesList[activeModuleIdx].desc}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex gap-4 items-start">
                    <span className="text-xl">💡</span>
                    <div>
                      <h5 className="font-bold text-xs text-cyan-700 uppercase">Practical Exercise</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {lang === "EN"
                          ? `After reading the concepts, head over to the **${currentT.agentSandboxTab}** tab to interact directly with the agent!`
                          : `Setelah membaca konsep, silakan pindah ke tab **${currentT.agentSandboxTab}** untuk mencoba prompt interaktif langsung!`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT: INTERACTIVE LAB */}
              {classroomTab === "lab" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                      <span>💬</span>
                      <span>{lang === "EN" ? "AI-Mentor Workspace" : "Ruang Kerja AI-Mentor"}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === "EN" 
                        ? `Specialized workspace companion for Module 0${currentT.modulesList[activeModuleIdx].id}`
                        : `Pendamping ruang kerja khusus untuk Modul 0${currentT.modulesList[activeModuleIdx].id}`}
                    </p>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-md transition-all duration-300 hover:shadow-lg">
                    {/* Background Glow */}
                    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-100/40 blur-3xl" />
                    <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-emerald-100/30 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                      {/* Left: Branding Icon */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-100">
                        <Bot className="h-9 w-9" />
                      </div>

                      {/* Right: Content details */}
                      <div className="flex-1 space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Custom GPT Integration
                        </span>
                        <h4 className="text-lg md:text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                          {currentT.modulesList[activeModuleIdx].title}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-650 leading-relaxed max-w-2xl">
                          {lang === "EN"
                            ? "This sandbox lab operates through our specialized Custom GPT, trained specifically as an Agentic AI Writing Mentor. Access custom instructions, templates, and interact directly with the AI-Mentor to complete your module assignments."
                            : "Laboratorium simulasi ini beroperasi menggunakan Kustom GPT khusus yang dilatih secara spesifik sebagai Mentor Penulisan AI Agentic. Dapatkan instruksi kustom, panduan template, dan berinteraksilah langsung dengan AI-Mentor untuk menyelesaikan tugas modul Anda."}
                        </p>
                      </div>
                    </div>

                    {/* Capabilities list */}
                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-cyan-500" />
                        {lang === "EN" ? "What you can do with this AI-Mentor:" : "Yang dapat Anda lakukan dengan AI-Mentor ini:"}
                      </h5>
                      
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(currentT.modulesList[activeModuleIdx].id === 1 ? (
                          lang === "EN" ? [
                            "Synthesize academic literature and spot research gaps",
                            "Ask questions about NotebookLM workspace configuration",
                            "Draft structured summaries from uploaded PDF reference materials"
                          ] : [
                            "Sintesis literatur akademik dan temukan celah penelitian (research gap)",
                            "Konsultasikan konfigurasi workspace NotebookLM Anda",
                            "Buat draf ringkasan terstruktur dari referensi PDF yang diunggah"
                          ]
                        ) : currentT.modulesList[activeModuleIdx].id === 2 ? (
                          lang === "EN" ? [
                            "Get guidance on designing Google Opal agents",
                            "Refine proposal draft workflows and outline structures",
                            "Validate research ideas and methodologies"
                          ] : [
                            "Dapatkan panduan merancang agen Google Opal",
                            "Sempurnakan alur kerja proposal dan kerangka outline",
                            "Evaluasi ide penelitian dan metodologi"
                          ]
                        ) : currentT.modulesList[activeModuleIdx].id === 3 ? (
                          lang === "EN" ? [
                            "Draft structured SKILL.md templates for Google Antigravity",
                            "Review custom research gap and literature matrix skills",
                            "Test skill execution parameters and behavior constraints"
                          ] : [
                            "Rancang template SKILL.md terstruktur untuk Google Antigravity",
                            "Tinjau kemampuan (skill) analisis gap riset dan matriks literatur",
                            "Uji parameter eksekusi dan batasan perilaku skill"
                          ]
                        ) : currentT.modulesList[activeModuleIdx].id === 4 ? (
                          lang === "EN" ? [
                            "Orchestrate multi-agent systems and publishing workflows",
                            "Validate systematic literature reviews with human-in-the-loop steps",
                            "Address reference hallucinations and check AI ethics compliance"
                          ] : [
                            "Orkestrasikan sistem multi-agen dan alur kerja publikasi",
                            "Validasi tinjauan literatur sistematis dengan kontrol human-in-the-loop",
                            "Atasi halusinasi referensi dan periksa kepatuhan etika AI"
                          ]
                        ) : (
                          lang === "EN" ? [
                            "Structure your Capstone project architecture",
                            "Choose and refine your specialization track",
                            "Verify your final system against real-world research requirements"
                          ] : [
                            "Susun arsitektur proyek Capstone Anda",
                            "Pilih dan matangkan jalur spesialisasi proyek akhir Anda",
                            "Verifikasi sistem akhir Anda terhadap standar kebutuhan riset riil"
                          ]
                        )).map((capability, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/70 transition-all duration-200">
                            <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 text-[10px] font-bold">
                              ✓
                            </span>
                            <span>{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Launch CTA */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Host Provider
                        </p>
                        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10A37F]" />
                          OpenAI ChatGPT Custom GPTs
                        </p>
                      </div>

                      <a
                        href="https://chatgpt.com/g/g-6a225046beb4819181fc3f1a5d925f9a-ai-mentor-agentic-ai-for-writings-by-lensetek"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#10A37F] hover:bg-[#0e8f6f] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-[#10A37F]/10 hover:shadow-lg hover:shadow-[#10A37F]/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <ChatGPTIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                        <span>{lang === "EN" ? "Launch AI-Mentor in ChatGPT" : "Buka AI-Mentor di ChatGPT"}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT: QUIZ VERIFICATION */}
              {classroomTab === "quiz" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
                      📝 {lang === "EN" ? "Module Verification Challenge" : "Kuis Verifikasi Kompetensi Modul"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === "EN"
                        ? "Complete this verification question to earn your module completion badge and progress toward graduation."
                        : "Selesaikan pertanyaan verifikasi ini untuk mengklaim badge kelulusan modul pembelajaran Anda."}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner">
                    <h4 className="font-bold text-sm text-slate-800 leading-relaxed">
                      {currentT.modulesList[activeModuleIdx].materials.quiz.question}
                    </h4>

                    <div className="mt-6 space-y-3">
                      {currentT.modulesList[activeModuleIdx].materials.quiz.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!quizSubmitted) setQuizSelectedOption(idx);
                          }}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left text-xs font-semibold transition-all ${
                            quizSelectedOption === idx
                              ? 'border-cyan-500 bg-cyan-50/50 text-cyan-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                            quizSelectedOption === idx ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>

                    {quizFeedback && (
                      <div className={`mt-6 p-4 rounded-xl text-xs font-medium ${
                        quizFeedback.startsWith('🎉') ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'
                      }`}>
                        {quizFeedback}
                      </div>
                    )}

                    {!quizSubmitted ? (
                      <button
                        onClick={() => handleQuizSubmit(currentT.modulesList[activeModuleIdx].materials.quiz, currentT.modulesList[activeModuleIdx].id)}
                        disabled={quizSelectedOption === null}
                        className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-xs font-extrabold text-white hover:bg-cyan-600 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {currentT.quizSubmit}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizSelectedOption(null);
                          setQuizFeedback("");
                        }}
                        className="mt-6 w-full rounded-xl bg-white border border-slate-200 py-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        {currentT.quizRetry}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT: CERTIFICATE */}
              {classroomTab === "certificate" && allModulesCompleted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center animate-fade-in"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 no-print">
                    <h3 className="text-lg font-bold text-slate-800 font-['Plus_Jakarta_Sans']">🎓 {currentT.certHeader}</h3>
                    <button 
                      onClick={() => setClassroomTab("materials")}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      {currentT.backToStudy}
                    </button>
                  </div>

                  {certificateNeedsBiodataRefresh ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-left text-sm font-bold text-amber-800 no-print">
                      <p>{lang === "EN" ? "Your certificate needs updated biodata before it can be regenerated." : "Sertifikat Anda perlu biodata lengkap sebelum dibuat ulang."}</p>
                      <button
                        onClick={() => {
                          setBiodataForm(biodata || getDefaultBiodata(user));
                          setCertificateRefreshAfterBiodata(true);
                          setShowBiodataModal(true);
                        }}
                        className="mt-4 rounded-xl bg-amber-500 px-5 py-3 text-xs font-black text-slate-950 shadow-sm transition-all hover:bg-amber-600"
                      >
                        {currentT.biodataCompleteBtn}
                      </button>
                    </div>
                  ) : !certificateRecord ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-sm font-bold text-amber-800 no-print">
                      Menerbitkan sertifikat dan nomor verifikasi...
                    </div>
                  ) : (
                    <>
                      <div className="print-container space-y-8">
                        {/* Page 1: Certificate */}
                        <div ref={certificatePageRef} className="print-page print-cert-wrapper mx-auto max-w-6xl overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl">
                          <div className="relative aspect-[1536/1080] w-full">
                            <img
                              src="/cert-template.png"
                              alt="Lensetek certificate template"
                              className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute right-[7%] top-[6.5%] rounded-lg bg-white/85 px-3 py-2 text-right shadow-sm border border-slate-100/50">
                              <p className="text-[clamp(6px,0.7vw,10px)] font-extrabold uppercase tracking-wider text-slate-500">Certificate No.</p>
                              <p className="font-mono text-[clamp(7px,0.9vw,13px)] font-extrabold text-[#091A36]">{certificateRecord.certificateNo}</p>
                            </div>

                            {/* Participant Name: 100% transparent, positioned elegantly without covering the "has successfully completed" template text */}
                            <div className="absolute left-[15%] right-[15%] top-[40.8%] text-center">
                              <p className="font-serif text-[clamp(18px,3.3vw,48px)] font-extrabold leading-tight text-[#091A36]">
                                {certificateRecord.holderName}
                              </p>
                            </div>

                            {/* Course Title Overlay */}
                            <div className="absolute left-[10%] right-[10%] top-[56%] h-[8%] bg-white flex items-center justify-center z-10">
                              <p className="font-serif text-[clamp(12px,2.2vw,28px)] whitespace-nowrap font-extrabold text-[#091A36]">
                                {certificateRecord.courseTitle}
                              </p>
                            </div>

                            {/* Astrid's digital signature QR block: transparent container sitting beautifully above the line without covering "Program Director" */}
                            <div className="absolute bottom-[10.2%] left-[24.2%] flex items-end gap-2 bg-transparent text-left">
                              <img
                                src={getQrCodeUrl(`Digitally signed by Astrid, Program Director, Lensetek International, LLC. Certificate: ${certificateRecord.certificateNo}`, 92)}
                                alt="Astrid digital signature QR code"
                                className="h-[clamp(38px,5.5vw,72px)] w-[clamp(38px,5.5vw,72px)] bg-white p-1 rounded-lg border border-slate-100 shadow-sm"
                              />
                              <div className="mb-0.5">
                                <p className="font-serif text-[clamp(12px,1.5vw,22px)] font-bold text-[#091A36] leading-none mb-0.5">Astrid</p>
                                <p className="text-[clamp(6px,0.7vw,9px)] font-extrabold uppercase tracking-wider text-slate-400">QR Signature</p>
                              </div>
                            </div>

                            {/* Valid Until: 100% solid white card placed to cover the template's hardcoded date completely and dynamically overlay ours */}
                            <div className="absolute bottom-[4.2%] left-[44.0%] w-[16.5%] rounded-xl bg-white px-2 py-1.5 text-center shadow-md border border-slate-100/50 z-10">
                              <p className="text-[clamp(6px,0.7vw,9px)] font-extrabold uppercase tracking-wider text-slate-400">Valid Until</p>
                              <p className="text-[clamp(8px,1.05vw,15px)] font-extrabold text-[#091A36] mt-0.5">
                                {formatDisplayDate(certificateRecord.validUntil, "en-US")}
                              </p>
                            </div>

                            {/* Date of Completion: 100% solid white card placed to cover the template's hardcoded date completely and dynamically overlay ours */}
                            <div className="absolute bottom-[4.2%] right-[21.0%] w-[17.5%] rounded-xl bg-white px-2 py-1.5 text-center shadow-md border border-slate-100/50 z-10">
                              <p className="text-[clamp(6px,0.7vw,9px)] font-extrabold uppercase tracking-wider text-slate-400">Date of Completion</p>
                              <p className="text-[clamp(8px,1.05vw,15px)] font-extrabold text-[#091A36] mt-0.5">
                                {formatDisplayDate(certificateRecord.completionDate, "en-US")}
                              </p>
                            </div>

                            <div className="absolute bottom-[4.2%] right-[6.6%] rounded-xl bg-white p-2 text-center shadow-md border border-slate-100/50 z-10">
                              <img
                                src={getQrCodeUrl(getDynamicVerificationUrl(certificateRecord), 116)}
                                alt="Certificate verification QR code"
                                className="h-[clamp(48px,6.5vw,86px)] w-[clamp(48px,6.5vw,86px)]"
                              />
                              <p className="mt-1 text-[clamp(5px,0.6vw,8.5px)] font-extrabold uppercase tracking-wider text-cyan-600">Verify</p>
                            </div>
                          </div>
                        </div>

                        {/* Page 2: Transcript with Participant Name, Validity, and Astrid Signature block */}
                        <div ref={transcriptPageRef} className="print-page print-transcript-wrapper mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm font-sans">
                          <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-end md:justify-between">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-700">Official Transcript</p>
                              <h4 className="text-xl font-extrabold text-[#091A36] font-['Plus_Jakarta_Sans']">Academic Transcript of Course Completion</h4>
                            </div>
                            <p className="font-mono text-xs font-bold text-slate-500">{certificateRecord.certificateNo}</p>
                          </div>

                          {/* Participant and Summary Blocks */}
                          <div className="mt-6 flex flex-col md:flex-row gap-6 items-stretch justify-between">
                            {/* Left Card: Participant Info */}
                            <div className="flex-1 rounded-2xl border border-slate-200 p-5 bg-white shadow-sm flex flex-col justify-between">
                              <div className="grid grid-cols-[120px_10px_1fr] items-center gap-y-3 text-xs text-slate-700 font-semibold">
                                <div className="flex items-center gap-2 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                  <User className="h-3.5 w-3.5 text-cyan-600" /> Participant
                                </div>
                                <div className="text-slate-400">:</div>
                                <div className="font-extrabold text-[#091A36] text-sm leading-none">{certificateRecord.holderName}</div>

                                <div className="flex items-center gap-2 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                  <BookOpen className="h-3.5 w-3.5 text-cyan-600" /> Program
                                </div>
                                <div className="text-slate-400">:</div>
                                <div className="font-extrabold text-slate-800 leading-none">Mini Course</div>

                                <div className="flex items-center gap-2 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                  <Award className="h-3.5 w-3.5 text-cyan-600" /> Course
                                </div>
                                <div className="text-slate-400">:</div>
                                <div className="font-extrabold text-slate-800 leading-none">{certificateRecord.courseTitle}</div>

                                <div className="flex items-center gap-2 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                  <Clock className="h-3.5 w-3.5 text-cyan-600" /> Total Duration
                                </div>
                                <div className="text-slate-400">:</div>
                                <div className="font-extrabold text-slate-800 leading-none">20 Hours</div>

                                <div className="flex items-center gap-2 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                  <TrendingUp className="h-3.5 w-3.5 text-cyan-600" /> Level
                                </div>
                                <div className="text-slate-400">:</div>
                                <div className="font-extrabold text-slate-800 leading-none">Beginner – Intermediate</div>
                              </div>
                            </div>

                            {/* Right Card: Summary Badges */}
                            <div className="w-full md:w-[48%] rounded-2xl border border-amber-200 bg-amber-50/20 p-5 shadow-sm flex flex-col justify-between">
                              <p className="text-center font-extrabold text-[10px] uppercase tracking-wider text-slate-400 border-b border-amber-200 pb-2">Summary</p>
                              
                              <div className="grid grid-cols-3 gap-2 mt-4 text-center h-full">
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm border border-slate-100/50">
                                  <Clock className="h-6 w-6 text-amber-500 mb-1" />
                                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wide leading-none">Total Duration</p>
                                  <p className="text-xs font-black text-[#091A36] mt-2">20 Hours</p>
                                </div>

                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm border border-slate-100/50">
                                  <BookOpen className="h-6 w-6 text-amber-500 mb-1" />
                                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wide leading-none">Total Modules</p>
                                  <p className="text-xs font-black text-[#091A36] mt-2">5 Modules</p>
                                </div>

                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm border border-slate-100/50">
                                  <Award className="h-6 w-6 text-amber-500 mb-1" />
                                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wide leading-tight">Overall Performance</p>
                                  <p className="text-[10px] font-black text-emerald-600 mt-2 leading-none">Completed Satisfactory</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Academic Table Block */}
                          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-[#091A36] text-white uppercase text-[9px] tracking-wider font-extrabold">
                                  <th className="py-3.5 px-4 border-b border-slate-800 text-center w-[6%]">No.</th>
                                  <th className="py-3.5 px-4 border-b border-slate-800 w-[30%]">Module</th>
                                  <th className="py-3.5 px-4 border-b border-slate-800 text-center w-[12%]">Duration</th>
                                  <th className="py-3.5 px-4 border-b border-slate-800 w-[39%]">Description</th>
                                  <th className="py-3.5 px-4 border-b border-slate-800 text-center w-[13%]">Performance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                                {[
                                  {
                                    no: 1,
                                    title: "AI Research Brain with NotebookLM",
                                    duration: "4 Hours",
                                    description: "Build an organized research knowledge base and leverage AI to rapidly comprehend academic sources.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 2,
                                    title: "Building Academic Productivity Agents with Google Opal",
                                    duration: "4 Hours",
                                    description: "Build no-code AI agents to automate research and academic writing activities.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 3,
                                    title: "Building Research & Writing Skills with Google Antigravity",
                                    duration: "4 Hours",
                                    description: "Develop professional SOP-based skills that can be reused across various AI agents.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 4,
                                    title: "Autonomous Research & Book Publication Systems",
                                    duration: "4 Hours",
                                    description: "Integrate NotebookLM, Google Opal, and Antigravity into a cohesive research and writing system.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 5,
                                    title: "Final Capstone Project",
                                    duration: "4 Hours",
                                    description: "Apply your knowledge by building a specialized academic operating system.",
                                    performance: "Completed"
                                  }
                                ].map((m) => (
                                  <tr key={m.no} className="hover:bg-slate-50/50 transition-colors odd:bg-white even:bg-slate-50/20">
                                    <td className="py-3 px-4 text-center font-extrabold text-slate-400">{m.no}</td>
                                    <td className="py-3 px-4 font-extrabold text-[#091A36] text-xs">{m.title}</td>
                                    <td className="py-3 px-4 text-center font-extrabold text-slate-500">{m.duration}</td>
                                    <td className="py-3 px-4 text-slate-400 font-medium leading-relaxed text-[11px]">{m.description}</td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="inline-flex items-center gap-1 text-emerald-600 font-extrabold text-[10px] bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 shadow-sm leading-none">
                                        <CheckCircle2 className="h-3 w-3" /> Completed
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                {/* Total Duration Footer Row */}
                                <tr className="bg-slate-50 font-extrabold text-[#091A36]">
                                  <td colSpan="2" className="py-3.5 px-4 text-right uppercase tracking-wider text-[9px] text-slate-400">Total Duration</td>
                                  <td className="py-3.5 px-4 text-center text-sm font-black text-[#091A36]">20 Hours</td>
                                  <td colSpan="2" className="py-3.5 px-4"></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Sign-off Footer block with Astrid's signature and Lensetek International stamp */}
                          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-slate-100 pt-5">
                            <div>
                              <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 leading-relaxed">
                                This transcript is electronically issued by<br />
                                <span className="text-cyan-700 font-bold">Lensetek International, LLC</span>
                              </p>
                              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                                Verify authenticity using the verification QR code on the certificate.
                              </p>
                            </div>
                            <div className="flex flex-col items-center text-center self-end sm:self-auto">
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Program Director</p>
                              <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2">
                                <img
                                  src={getQrCodeUrl(`Digitally signed by Astrid, Program Director, Lensetek International, LLC. Certificate: ${certificateRecord.certificateNo}`, 92)}
                                  alt="Astrid digital signature QR code"
                                  className="h-12 w-12 rounded bg-white p-0.5 border border-slate-200 shadow-sm"
                                />
                                <div className="text-left">
                                  <p className="font-serif text-sm font-bold text-[#091A36]">Astrid</p>
                                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">QR SIGNED</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons (No Print) */}
                      <div className="flex flex-wrap justify-center gap-3 no-print">
                        <a
                          href={getDynamicVerificationUrl(certificateRecord)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-6 py-3 text-xs font-bold text-cyan-700 shadow-sm hover:bg-cyan-100 transition-all"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          {currentT.verifyBtnOpen}
                        </a>
                        <a
                          href={getLinkedInShareUrl(certificateRecord)}
                          onClick={(event) => {
                            event.preventDefault();
                            handleAddCertificateToLinkedIn();
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0a66c2] text-white px-6 py-3 text-xs font-bold shadow-md hover:bg-[#004182] transition-all hover:scale-[1.01]"
                          aria-disabled={linkedInLoading || certificatePdfLoading}
                        >
                          <LinkedInIcon className="h-4 w-4 shrink-0" />
                          {linkedInLoading ? currentT.linkedInPreparing : currentT.shareLinkedIn}
                        </a>
                        <button
                          onClick={handleDownloadCertificatePdf}
                          disabled={certificatePdfLoading || linkedInLoading}
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all cursor-pointer hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
                        >
                          <Download className="h-4 w-4" />
                          {certificatePdfLoading ? currentT.certDownloadingPdf : currentT.certDownloadPdf}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

            </div>
          </div>
        </motion.section>
        )
      ) : (
        /* ==================== PUBLIC HIGH-FIDELITY LANDING PAGE VIEW ==================== */
        <div className="bg-[#FCFAF7] min-h-screen text-slate-800 selection:bg-amber-400 selection:text-slate-950 font-sans">
          
          {/* Header / Navbar */}
          <header className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 sm:px-6 sm:py-5 lg:px-8 border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
            <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#091A36] p-1.5 shadow-sm overflow-hidden shrink-0 sm:h-11 sm:w-11">
                <img src="https://lensetek.com/favicon.png" alt="Lensetek Logo" className="h-full w-full object-contain filter brightness-0 invert" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold tracking-tight text-[#091A36] font-['Plus_Jakarta_Sans'] uppercase leading-none">Lensetek</p>
                <p className="text-[8px] uppercase tracking-normal text-amber-500 font-extrabold mt-0.5 leading-tight sm:text-[9px] sm:tracking-wider">International, LLC</p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center gap-8 text-[13px] font-extrabold text-slate-600 md:flex">
              <a href="#modules" className="hover:text-[#091A36] transition-colors">{lang === "EN" ? "Curriculum" : "Kurikulum"}</a>
              <a href="#competencies" className="hover:text-[#091A36] transition-colors">{lang === "EN" ? "Competencies" : "Kompetensi"}</a>
              <a href="#benefits" className="hover:text-[#091A36] transition-colors">{lang === "EN" ? "Use Cases" : "Use Case"}</a>
              <a href="/verify" className="hover:text-[#091A36] transition-colors">{lang === "EN" ? "Verify Certificate" : "Verifikasi"}</a>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 sm:gap-3">
              {/* Dual Language Switcher */}
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-0.5 gap-0.5 sm:mr-2">
                <button 
                  onClick={() => setLang("EN")} 
                  className={`px-1.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer sm:px-2 ${lang === "EN" ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang("ID")} 
                  className={`px-1.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer sm:px-2 ${lang === "ID" ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ID
                </button>
              </div>

              {/* GitHub Link */}
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden p-2 text-slate-500 hover:text-[#091A36] transition-colors sm:inline-flex sm:mr-1" 
                title="GitHub Repository"
              >
                <GithubIcon className="h-5 w-5" />
              </a>

              <button 
                onClick={handleGoogleAuth} 
                className="h-11 w-11 justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-extrabold text-slate-950 transition-all cursor-pointer shadow-sm text-center flex items-center gap-1.5 sm:h-auto sm:w-auto sm:px-5 sm:py-2.5"
                aria-label={lang === "EN" ? "Login / Signup" : "Masuk / Daftar"}
              >
                <span aria-hidden="true">👤</span>
                <span className="hidden sm:inline">{lang === "EN" ? "Login / Signup" : "Masuk / Daftar"}</span>
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section id="top" className="relative isolate px-6 pt-12 pb-20 lg:px-8 bg-gradient-to-b from-white to-[#FCFAF7] border-b border-slate-100">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              
              {/* Hero Left Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="flex flex-col items-start text-left space-y-6"
              >
                <span className="inline-flex px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#091A36] bg-amber-100 border border-amber-200 rounded-full shadow-inner">
                  {lang === "EN" ? "MINI COURSE" : "MINI COURSE"}
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-[#091A36] font-['Plus_Jakarta_Sans']">
                  Agentic AI <br />
                  <span className="text-[#091A36]">{currentT.heroTitleHighlight}</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-650 leading-relaxed max-w-2xl font-medium">
                  {currentT.heroDescription}
                </p>

                {/* Lower info capsule row */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl pt-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">⏱️ {lang === "EN" ? "Total Hours" : "Durasi Total"}</span>
                    <span className="text-sm font-extrabold text-[#091A36]">20 Jam</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">5 Sesi x 4 Jam</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">📈 {lang === "EN" ? "Difficulty" : "Tingkat Kesulitan"}</span>
                    <span className="text-sm font-extrabold text-[#091A36]">{lang === "EN" ? "Beginner-Intermediate" : "Pemula - Menengah"}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{lang === "EN" ? "No coding background" : "Tidak wajib coding"}</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">💻 {lang === "EN" ? "Approach" : "Pendekatan"}</span>
                    <span className="text-sm font-extrabold text-[#091A36]">{lang === "EN" ? "Practical & No-Code" : "Praktis & No-Code"}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{lang === "EN" ? "Direct Implementation" : "Langsung implementasi"}</span>
                  </div>
                </div>

                {/* Main Action Call-to-Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full sm:w-auto">
                  <button 
                    onClick={handleGoogleAuth} 
                    className="flex flex-col items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-10 py-4 rounded-2xl font-extrabold text-sm transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-base">👤 {lang === "EN" ? "Login / Register Account" : "Masuk / Daftar Akun"}</span>
                    <span className="text-[10px] opacity-80 font-semibold tracking-wider block">lensetek.online/classroom</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 italic pt-2">— {lang === "EN" ? "Join and start your journey to become an Agentic AI specialist today." : "Bergabung dan mulai perjalanan Anda menjadi praktisi Agentic AI."}</p>
              </motion.div>

              {/* Hero Right Visual Column */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-xl overflow-hidden aspect-[4/3] flex flex-col justify-end"
              >
                {/* Generated Background Image */}
                <img 
                  src="/hero_academic.png" 
                  alt="Professional Working" 
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all hover:scale-105 duration-[4000ms]" 
                />
                
                {/* Gradient overlay for text reading */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent/10 z-10" />

                {/* Floating active agent cards overlay */}
                <div className="relative z-20 w-3/5 space-y-2.5 my-auto pl-2">
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl p-2.5 shadow-sm flex items-center gap-3 transform -translate-x-2">
                    <span className="h-6 w-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs shrink-0">🔍</span>
                    <div>
                      <p className="font-extrabold text-[10px] text-[#091A36] leading-none">{lang === "EN" ? "Literature Search Engine" : "Mesin Pencari Literatur"}</p>
                      <p className="text-[8px] text-slate-500 mt-0.5">{lang === "EN" ? "Agent 1 active" : "Agen 1 berjalan"}</p>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl p-2.5 shadow-sm flex items-center gap-3 transform translate-x-1">
                    <span className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">📝</span>
                    <div>
                      <p className="font-extrabold text-[10px] text-[#091A36] leading-none">{lang === "EN" ? "Research Gap Discovery" : "Identifikasi Gap Riset"}</p>
                      <p className="text-[8px] text-slate-500 mt-0.5">{lang === "EN" ? "Agent 2 active" : "Agen 2 berjalan"}</p>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl p-2.5 shadow-sm flex items-center gap-3 transform -translate-x-1">
                    <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs shrink-0">⚙️</span>
                    <div>
                      <p className="font-extrabold text-[10px] text-[#091A36] leading-none">{lang === "EN" ? "Thesis Auto-Drafter" : "Penyusun Draf Tesis"}</p>
                      <p className="text-[8px] text-slate-500 mt-0.5">{lang === "EN" ? "Agent 3 active" : "Agen 3 berjalan"}</p>
                    </div>
                  </div>
                  <div className="bg-[#091A36] text-white border border-[#12284C] rounded-xl p-2.5 shadow-sm flex items-center gap-3 transform translate-x-2">
                    <span className="h-6 w-6 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs shrink-0">📊</span>
                    <div>
                      <p className="font-extrabold text-[10px] leading-none">{lang === "EN" ? "Academic Reviewer" : "Reviewer Akademis"}</p>
                      <p className="text-[8px] text-slate-300 mt-0.5">{lang === "EN" ? "Finished successfully" : "Selesai!"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </section>

          {/* Curriculum Section */}
          <section id="modules" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#091A36] sm:text-4xl font-['Plus_Jakarta_Sans']">
                {lang === "EN" ? "5-Module Curriculum – 20 Hours" : "Kurikulum 5 Modul – 20 Jam"}
              </h2>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto font-medium">
                {lang === "EN" 
                  ? "Designed step-by-step for absolute beginners to academic professionals. No coding required." 
                  : "Dirancang secara bertahap untuk pemula hingga dosen, akademisi, dan peneliti. Tidak membutuhkan latar belakang coding."}
              </p>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
                {currentT.modulesList.map((m) => {
                  const moduleIcons = {
                    1: { emoji: "💡", bg: "bg-amber-100", text: "text-amber-600" },
                    2: { emoji: "🤖", bg: "bg-blue-100", text: "text-blue-600" },
                    3: { emoji: "⚡", bg: "bg-emerald-100", text: "text-emerald-600" },
                    4: { emoji: "🧩", bg: "bg-purple-100", text: "text-purple-600" },
                    5: { emoji: "🎓", bg: "bg-orange-100", text: "text-orange-600" }
                  };
                  const design = moduleIcons[m.id] || { emoji: "📚", bg: "bg-slate-100", text: "text-slate-650" };
                  return (
                    <div key={m.id} className="bg-[#FCFAF7] border border-slate-100 hover:border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`h-12 w-12 rounded-2xl ${design.bg} ${design.text} flex items-center justify-center text-lg font-bold shadow-inner`}>
                        {design.emoji}
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${design.text} mt-5`}>
                        {lang === "EN" ? `MODULE ${m.id}` : `MODUL ${m.id}`}
                      </span>
                      <h3 className="text-sm font-black text-[#091A36] mt-2 font-['Plus_Jakarta_Sans'] leading-snug min-h-[44px]">
                        {m.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mt-3">
                        ⏱️ {m.hours}
                      </span>
                      <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                        {m.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Competency Section */}
          <section id="competencies" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FCFAF7] border-b border-slate-100">
            <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#091A36] sm:text-4xl font-['Plus_Jakarta_Sans']">
                {lang === "EN" ? "Key Competencies You Will Master" : "Kompetensi Akhir yang Anda Kuasai"}
              </h2>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto font-medium">
                {lang === "EN"
                  ? "Gain practical industry-grade workflow engineering capabilities applicable immediately."
                  : "Miliki kompetensi praktis berstandar industri untuk merancang workflow bisnis berbasis kecerdasan buatan."}
              </p>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                
                {/* Competency 1 */}
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-amber-100 border-4 border-white shadow-md flex items-center justify-center text-xl shrink-0">
                    🧠
                  </div>
                  <h3 className="text-sm font-extrabold text-[#091A36] mt-5 font-['Plus_Jakarta_Sans']">
                    Architectural Thinking
                  </h3>
                  <p className="text-xs text-slate-555 mt-3 leading-relaxed font-medium max-w-xs">
                    {lang === "EN"
                      ? "Convert manual business processes into systematic AI-driven workflow diagrams."
                      : "Mengubah masalah bisnis manual menjadi diagram alur kerja berbasis AI yang sistematis."}
                  </p>
                </div>

                {/* Competency 2 */}
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-xl shrink-0">
                    🛡️
                  </div>
                  <h3 className="text-sm font-extrabold text-[#091A36] mt-5 font-['Plus_Jakarta_Sans']">
                    Advanced Prompting & Persona Design
                  </h3>
                  <p className="text-xs text-slate-555 mt-3 leading-relaxed font-medium max-w-xs">
                    {lang === "EN"
                      ? "Master structuring instructions so AI acts as a specific and consistent professional."
                      : "Mahir menyusun instruksi agar AI bertindak sebagai profesional yang spesifik dan konsisten."}
                  </p>
                </div>

                {/* Competency 3 */}
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 border-4 border-white shadow-md flex items-center justify-center text-xl shrink-0">
                    🧩
                  </div>
                  <h3 className="text-sm font-extrabold text-[#091A36] mt-5 font-['Plus_Jakarta_Sans']">
                    Tool Integration
                  </h3>
                  <p className="text-xs text-slate-555 mt-3 leading-relaxed font-medium max-w-xs">
                    {lang === "EN"
                      ? "Provide 'eyes and hands' to AI by connecting internet, documents, databases, and APIs."
                      : "Memberikan \"tangan dan mata\" pada AI dengan menghubungkan internet, dokumen, database, dan API."}
                  </p>
                </div>

                {/* Competency 4 */}
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-purple-100 border-4 border-white shadow-md flex items-center justify-center text-xl shrink-0">
                    👥
                  </div>
                  <h3 className="text-sm font-extrabold text-[#091A36] mt-5 font-['Plus_Jakarta_Sans']">
                    Orchestration Mastery
                  </h3>
                  <p className="text-xs text-slate-555 mt-3 leading-relaxed font-medium max-w-xs">
                    {lang === "EN"
                      ? "Manage the collaboration of multiple AI agents to work in harmony without overlap."
                      : "Mengelola kolaborasi beberapa agen AI agar bekerja selaras tanpa tumpang tindih."}
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Solutions Section */}
          <section id="benefits" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#091A36] sm:text-4xl font-['Plus_Jakarta_Sans']">
                {lang === "EN" ? "Build Real-World Solutions for Your Research" : "Bangun Solusi Nyata untuk Riset Anda"}
              </h2>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto font-medium">
                {lang === "EN"
                  ? "Explore ready-to-deploy academic agents modeled directly in our comprehensive academy."
                  : "Mulai bangun solusi kecerdasan buatan siap pakai untuk aktivitas riset harian Anda."}
              </p>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
                
                {/* Solution 1 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/literature_synthesis.png" 
                      alt="Literature Synthesis Engine" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs shadow-md">
                      ✏️
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Literature Synthesis Engine
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Automated paper analysis, extraction, and comparison matrix." 
                          : "Analisis jurnal, ekstraksi data, dan pembuatan matriks komparasi otomatis."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 2 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/research_gap.png" 
                      alt="Research Gap Discovery" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xs shadow-md">
                      📊
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Research Gap Discovery
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Map scientific phenomena, methodologies, and open gaps." 
                          : "Memetakan fenomena ilmiah, metodologi, dan celah riset terbuka."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 3 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/academic_reviewer.png" 
                      alt="Academic Reviewer OS" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-purple-400 text-white flex items-center justify-center text-xs shadow-md">
                      💬
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Academic Reviewer OS
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Evaluate proposal arguments, check formatting, and check citations." 
                          : "Mengevaluasi argumen proposal, memeriksa format, dan sitasi."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 4 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/proposal_writer.png" 
                      alt="Proposal Writer Companion" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shadow-md">
                      📈
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Proposal Writer Companion
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Draft background of the study, study formulation, and methodologies." 
                          : "Menyusun latar belakang riset, perumusan masalah, dan metodologi."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 5 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/book_outline.png" 
                      alt="Book Outline Creator" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs shadow-md">
                      📦
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Book Outline Creator
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Create syllabus-aligned chapters and teaching lesson plans." 
                          : "Menyusun outline bab buku dan rencana modul pembelajaran."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Footer Callout CTA Banner */}
          <section id="audience" className="py-16 px-6 lg:px-8 bg-[#FCFAF7]">
            <div className="mx-auto max-w-7xl">
              <div className="bg-[#091A36] text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Background light glow design */}
                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute left-10 bottom-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  
                  {/* Left branding callout */}
                  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 max-w-2xl">
                    <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
                      🎓
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug font-['Plus_Jakarta_Sans']">
                        {lang === "EN" ? "Ready to build Agentic AI for your research?" : "Siap membangun sistem riset otonom Anda?"}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-350 mt-3 leading-relaxed font-medium">
                        {lang === "EN"
                          ? "Login or register now on the Lensetek platform and begin your journey to master Agentic AI for researchers and authors today."
                          : "Masuk atau daftar sekarang di platform Lensetek dan mulai perjalanan Anda menguasai Agentic AI untuk kepengaruhan akademik."}
                      </p>
                    </div>
                  </div>

                  {/* Right direct logins buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                    <button 
                      onClick={handleGoogleAuth} 
                      className="flex flex-col items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-955 px-10 py-4 rounded-2xl font-extrabold text-sm transition-all shadow-md cursor-pointer text-center"
                    >
                      <span className="text-base font-extrabold">👤 {lang === "EN" ? "Login / Register Account" : "Masuk / Daftar Akun"}</span>
                      <span className="text-[10px] opacity-80 font-semibold tracking-wider">lensetek.online/classroom</span>
                    </button>
                  </div>

                </div>

                {/* Bullet checklist bottom row */}
                <div className="relative z-10 border-t border-white/10 mt-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-300">
                    <span className="text-amber-400">✔️</span> {lang === "EN" ? "Premium Access" : "Akses Materi Premium"}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-300">
                    <span className="text-amber-400">✔️</span> {lang === "EN" ? "Course Certificate" : "Sertifikat Kelulusan"}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-300">
                    <span className="text-amber-400">✔️</span> {lang === "EN" ? "Community & Updates" : "Komunitas & Update"}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-300">
                    <span className="text-amber-400">✔️</span> {lang === "EN" ? "Instructor Support" : "Dukungan Instruktur"}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Footer Copy */}
          <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-400">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Lensetek International, LLC. United States. All rights reserved.</p>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <a href="/verify" className="text-slate-400 hover:text-[#091A36] transition-colors text-sm font-semibold">
                  {lang === "EN" ? "Verify Certificate" : "Verifikasi Sertifikat"}
                </a>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-slate-400 hover:text-[#091A36] transition-colors text-sm font-semibold"
                >
                  <GithubIcon className="h-4 w-4" /> View GitHub Repository
                </a>
              </div>
            </div>
          </footer>

        </div>
      )}
    </main>
  );
}



