import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize carriage returns to match content file format
const normalize = (str) => str.replace(/\r\n/g, '\n');
content = normalize(content);

// Helper function to safely replace all occurrences
const replaceAllOccurrences = (search, replacement) => {
  const normalizedSearch = normalize(search);
  const normalizedReplacement = normalize(replacement);
  if (content.includes(normalizedSearch)) {
    content = content.split(normalizedSearch).join(normalizedReplacement);
    console.log(`Replaced: ${search.substring(0, 40)}...`);
  } else {
    console.warn(`Warning: Could not find: ${search.substring(0, 40)}...`);
  }
};

// 1. Update githubUrl
replaceAllOccurrences(
  'const githubUrl = "https://github.com/lensetek/Mini-Course-Agentic-AI-for-Marketing-Business";',
  'const githubUrl = "https://github.com/lensetek/Mini-Course-Agentic-AI-for-Writing";'
);

// 2. Update Firestore Collections
replaceAllOccurrences('const docRef = doc(db, "progress", user.uid);', 'const docRef = doc(db, "academic_progress", user.uid);');
replaceAllOccurrences('await setDoc(doc(db, "certificates", publicRecord.certificateNo), {', 'await setDoc(doc(db, "academic_certificates", publicRecord.certificateNo), {');
replaceAllOccurrences('await setDoc(doc(db, "certificates", oldRecord.certificateNo), {', 'await setDoc(doc(db, "academic_certificates", oldRecord.certificateNo), {');
replaceAllOccurrences('const codeSnap = await getDoc(doc(db, "invitationCodes", invitationCode));', 'const codeSnap = await getDoc(doc(db, "academic_invitationCodes", invitationCode));');
replaceAllOccurrences('const usageDocRef = doc(db, "invitationUsages", matched.code);', 'const usageDocRef = doc(db, "academic_invitationUsages", matched.code);');
replaceAllOccurrences('const verificationSnap = await getDoc(doc(db, "certificates", verificationCertificateNo));', 'const verificationSnap = await getDoc(doc(db, "academic_certificates", verificationCertificateNo));');

// 3. Update courseTitle default in certificate record
replaceAllOccurrences('courseTitle: "Agentic AI for Marketing & Business",', 'courseTitle: "Agentic AI Mastery for Researchers & Authors",');

// 4. Update t.EN translations
replaceAllOccurrences('heroTitleHighlight: "Marketing & Business",', 'heroTitleHighlight: "Researchers & Authors",');
replaceAllOccurrences(
  'heroDescription: "Learn how to build autonomous AI agents for market intelligence, scale high-converting content writing engines, streamline support, and automate spreadsheets. No coding experience required. Practical focus: master core architecture, orchestrate agent teams, and launch with modern low-code systems.",',
  'heroDescription: "Learn how to build autonomous AI agents for literature analysis, design custom research proposal assistants, build reusable academic writing skills, and orchestrate publishing ecosystems. No coding experience required. Practical focus: master source-grounded workspaces, build Opal agents, and write skills with Antigravity.",'
);
replaceAllOccurrences('sandboxSub: "Marketing Intelligence Engine",', 'sandboxSub: "Academic Research Assistant",');
replaceAllOccurrences(
  'curriculumSub: "Our structures are systematically constructed to take you step-by-step: core conceptual agent framework, system architecture, marketing automatons, operational support, all the way to cloud orchestration and cost calculations.",',
  'curriculumSub: "Our program is systematically structured to take you step-by-step: AI research brains, no-code academic agents, reusable skill libraries, autonomous writing workflows, all the way to ethical capstone implementations.",'
);
replaceAllOccurrences(
  'competencyDescription: "This intensive program is crafted from the ground up for modern marketing heads, business owners, operational managers, technical consultants, educators, and enterprise teams seeking to deploy AI strategically.",',
  'competencyDescription: "This program is crafted from the ground up for modern researchers, authors, lecturers, students, and academic professionals seeking to deploy AI strategically in their research and publishing workflows.",'
);
replaceAllOccurrences('useCasesTitle: "AI Solutions engineered for real-life business workflows.",', 'useCasesTitle: "AI Solutions engineered for real-life academic workflows.",');
replaceAllOccurrences(
  'useCasesDescription: "Forget theoretical coding exercises. Every single use case is built directly around actual, critical operational responsibilities: high-speed market research, custom SEO contents, scalable sales qualification, inventory intelligence, and quick administrative solutions.",',
  'useCasesDescription: "Forget theoretical coding exercises. Every single use case is built directly around actual, critical academic responsibilities: literature synthesis, gap creation, methodology validation, book outlines, and responsible AI-assisted draft writing.",'
);
replaceAllOccurrences(
  'ctaDescription: "Register for the Lensetek Certification Program, enter our digital sandbox academy, and master Agentic AI frameworks designed specifically for business scale.",',
  'ctaDescription: "Register for the Lensetek Certification Program, enter our digital sandbox academy, and master Agentic AI frameworks designed specifically for research and academic writing.",'
);
replaceAllOccurrences(
  'certBody: "For successfully mastering the concepts and engineering parameters of Agentic AI for Marketing & Business, completing all 5 technical verification sessions, and demonstrating hands-on proficiency in server-side AI Agent Orchestration.",',
  'certBody: "For successfully mastering the concepts and engineering parameters of Agentic AI Mastery for Researchers & Authors, completing all 5 technical verification sessions, and demonstrating hands-on proficiency in server-side AI Agent Orchestration.",'
);

// 5. Update t.ID certBody and landing copy
replaceAllOccurrences(
  'certBody: "Atas keberhasilannya menguasai konsep dan rekayasa parameter Agentic AI untuk Marketing & Bisnis, menyelesaikan 5 sesi verifikasi teknis kompetensi, serta mendemonstrasikan kecakapan praktis dalam Orkestrasi Agen AI pada sisi server.",',
  'certBody: "Atas keberhasilannya menguasai konsep dan rekayasa parameter Agentic AI Mastery for Researchers & Authors, menyelesaikan 5 sesi verifikasi teknis kompetensi, serta mendemonstrasikan kecakapan praktis dalam Orkestrasi Agen AI pada sisi server.",'
);
replaceAllOccurrences('heroTitleHighlight: "Marketing & Bisnis",', 'heroTitleHighlight: "Researchers & Authors",');
replaceAllOccurrences('sandboxSub: "Marketing Intelligence Engine",', 'sandboxSub: "Academic Research Assistant",');
replaceAllOccurrences(
  'curriculumSub: "Struktur belajar dirancang bertahap: konsep dasar agen, arsitektur sistem, marketing automation, operasional bisnis, hingga orkestrasi cloud dan penghitungan biaya operasional.",',
  'curriculumSub: "Struktur program dirancang bertahap: basis riset AI, agen akademik no-code, pustaka skill reusable, sistem penulisan otonom, hingga implikasi etika capstone.",'
);

// 6. Replace t.EN.modulesList
const newEnModulesList = `    modulesList: [
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
    ]`;

// Find modulesList inside EN and replace
const enStartIndex = content.indexOf('EN: {');
if (enStartIndex !== -1) {
  const modulesListIndex = content.indexOf('modulesList: [', enStartIndex);
  if (modulesListIndex !== -1) {
    let bracketCount = 1;
    let index = modulesListIndex + 'modulesList: ['.length;
    while (bracketCount > 0 && index < content.length) {
      if (content[index] === '[') bracketCount++;
      else if (content[index] === ']') bracketCount--;
      index++;
    }
    if (bracketCount === 0) {
      const before = content.slice(0, modulesListIndex);
      const after = content.slice(index);
      content = before + normalize(newEnModulesList) + after;
      console.log("Successfully replaced EN modulesList!");
    }
  }
}

// 7. Replace t.ID.modulesList
const newIdModulesList = `    modulesList: [
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
    ]`;

const idStartIndex = content.indexOf('ID: {');
if (idStartIndex !== -1) {
  const modulesListIndex = content.indexOf('modulesList: [', idStartIndex);
  if (modulesListIndex !== -1) {
    let bracketCount = 1;
    let index = modulesListIndex + 'modulesList: ['.length;
    while (bracketCount > 0 && index < content.length) {
      if (content[index] === '[') bracketCount++;
      else if (content[index] === ']') bracketCount--;
      index++;
    }
    if (bracketCount === 0) {
      const before = content.slice(0, modulesListIndex);
      const after = content.slice(index);
      content = before + normalize(newIdModulesList) + after;
      console.log("Successfully replaced ID modulesList!");
    }
  }
}

// 8. Update drawTranscriptPdfPage modules list to load dynamically
const oldDrawTranscriptModules = `    const modules = [
      ["1", "Foundations of Agentic AI & Paradigm Shift", "3 Hours", "Understand core concepts of Agentic AI, agent architecture, memory, tools, and autonomous action.", "Completed"],
      ["2", "Core Skills & Workflow Architecture", "4 Hours", "Master advanced prompt engineering, persona design, guardrails, and workflow orchestration.", "Completed"],
      ["3", "Agentic AI for Marketing Automation", "5 Hours", "Build autonomous systems for content marketing, SEO research, competitor intelligence, and reporting.", "Completed"],
      ["4", "Agentic AI for Business Operations & SMEs", "5 Hours", "Design agents for support, lead qualification, data analysis, and business operations automation.", "Completed"],
      ["5", "No-Code Implementation & Final Evaluation", "3 Hours", "Deploy workflows using no-code platforms, evaluate performance, manage costs, and present a showcase.", "Completed"]
    ];`;

const newDrawTranscriptModules = `    const modules = t.EN.modulesList.map((m) => [
      String(m.id),
      m.title,
      m.hours,
      m.desc,
      "Completed"
    ]);`;

content = content.replace(normalize(oldDrawTranscriptModules), newDrawTranscriptModules);

// 9. Update drawTranscriptPdfPage course title
replaceAllOccurrences(
  'drawPdfText(pdf, "Agentic AI for Marketing & Business", margin + 48, 67, { size: 8, style: "bold" });',
  'drawPdfText(pdf, "Agentic AI Mastery for Researchers & Authors", margin + 48, 67, { size: 8, style: "bold" });'
);

// 10. Update UI transcript preview course title
replaceAllOccurrences(
  '<div className="font-extrabold text-slate-800 leading-none">Agentic AI for Marketing & Business</div>',
  '<div className="font-extrabold text-slate-800 leading-none">Agentic AI Mastery for Researchers & Authors</div>'
);

// 11. Update UI transcript preview modules table to load dynamically
const oldUiTranscriptTable = `                                [
                                  {
                                    no: 1,
                                    title: "Foundations of Agentic AI & Paradigm Shift",
                                    duration: "3 Hours",
                                    description: "Understand core concepts of Agentic AI, agent architecture, memory, tools, and how agents think and act autonomously.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 2,
                                    title: "Core Skills & Workflow Architecture",
                                    duration: "4 Hours",
                                    description: "Master advanced prompt engineering, persona design, guardrails, and multi-agent workflow orchestration.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 3,
                                    title: "Agentic AI for Marketing Automation",
                                    duration: "5 Hours",
                                    description: "Build autonomous systems for content marketing, SEO research, competitor intelligence, and automated reporting.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 4,
                                    title: "Agentic AI for Business Operations & SMEs",
                                    duration: "5 Hours",
                                    description: "Design agents for customer support, lead qualification, data analysis, and business operations automation.",
                                    performance: "Completed"
                                  },
                                  {
                                    no: 5,
                                    title: "No-Code Implementation & Final Evaluation",
                                    duration: "3 Hours",
                                    description: "Deploy workflows using no-code platforms, evaluate performance, manage costs, and present final showcase.",
                                    performance: "Completed"
                                  }
                                ].map`;

const newUiTranscriptTable = `                                t.EN.modulesList.map((m) => ({
                                  no: m.id,
                                  title: m.title,
                                  duration: m.hours,
                                  description: m.desc,
                                  performance: "Completed"
                                })).map`;

content = content.replace(normalize(oldUiTranscriptTable), newUiTranscriptTable);

// 12. Update Custom GPT link
replaceAllOccurrences(
  'https://chatgpt.com/g/g-6a1d5f5c450881919e9bbee90b26818b-agentic-ai-for-marketing-and-business-mini-course',
  'https://chatgpt.com'
);

// 13. Update simulation messages and agentName
replaceAllOccurrences(
  'message: "Perform trend research and SWOT content brief for Agentic AI in Marketing.",',
  'message: "Extract key research gaps and draft a literature synthesis outline for Agentic AI in Academic Writing.",'
);
replaceAllOccurrences(
  'agentName: "Marketing Intelligence Agent"',
  'agentName: "Academic Research Assistant"'
);

// 14. Update occupation select options
replaceAllOccurrences(
  '<option value="Marketing Specialist">{lang === "EN" ? "Marketing" : "Marketing Specialist"}</option>',
  '<option value="Researcher / Author">{lang === "EN" ? "Researcher / Author" : "Peneliti / Penulis"}</option>'
);

// 15. Update hardcoded hero title and description in JSX
const oldHeroTitleJSX = `                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-[#091A36] font-['Plus_Jakarta_Sans']">
                  Agentic AI <br />
                  <span className="text-[#091A36]">{lang === "EN" ? "for Marketing & Business" : "for Marketing & Business"}</span>
                </h1>`;

const newHeroTitleJSX = `                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-[#091A36] font-['Plus_Jakarta_Sans']">
                  Agentic AI <br />
                  <span className="text-[#091A36]">{currentT.heroTitleHighlight}</span>
                </h1>`;

content = content.replace(normalize(oldHeroTitleJSX), newHeroTitleJSX);

const oldHeroDescriptionJSX = `                <p className="text-base sm:text-lg text-slate-650 leading-relaxed max-w-2xl font-medium">
                  {lang === "EN"
                    ? "Build autonomous AI agents working directly for you. Automate marketing operations, competitor SWOT engines, customer support workflows, and day-to-day operations in a much smarter, automated style."
                    : "Bangun Agen AI Otonom yang bekerja untuk Anda. Otomatisasi Pemasaran, Analisis Kompetitor, Layanan Pelanggan, dan Operasional Bisnis dengan cara yang lebih cerdas."}
                </p>`;

const oldHeroDescriptionJSX2 = `                <p className="text-base sm:text-lg text-slate-650 leading-relaxed max-w-2xl font-medium">
                  {lang === "EN"
                    ? "Build autonomous AI agents working directly for you. Automate marketing operations, competitor SWOT engines, customer support workflows, and day-to-day operations in a much smarter, automated style."
                    : "Bangun Agen AI Otonom yang bekerja untuk Anda. Otomatisasi pemasaran, analisis kompetitor, layanan pelanggan, dan operasional bisnis dengan cara yang lebih cerdas."}
                </p>`;

const newHeroDescriptionJSX = `                <p className="text-base sm:text-lg text-slate-650 leading-relaxed max-w-2xl font-medium">
                  {currentT.heroDescription}
                </p>`;

if (content.includes(normalize(oldHeroDescriptionJSX))) {
  content = content.replace(normalize(oldHeroDescriptionJSX), newHeroDescriptionJSX);
} else if (content.includes(normalize(oldHeroDescriptionJSX2))) {
  content = content.replace(normalize(oldHeroDescriptionJSX2), newHeroDescriptionJSX);
}

// 16. Update hardcoded landing page module grid to be fully dynamic using map
const oldModulesGridJSX = `              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 justify-center">
                
                {/* Module 1 */}
                <div className="bg-[#FCFAF7] border border-slate-100 hover:border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg font-bold shadow-inner">
                    💡
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 mt-5">
                    {lang === "EN" ? "MODULE 1" : "MODUL 1"}
                  </span>
                  <h3 className="text-sm font-black text-[#091A36] mt-2 font-['Plus_Jakarta_Sans'] leading-snug min-h-[44px]">
                    {lang === "EN" ? "Foundations of Agentic AI & Paradigm Shift" : "Fondasi Agentic AI & Pergeseran Paradigma"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mt-3">
                    ⏱️ 3 {lang === "EN" ? "Hours" : "Jam"}
                  </span>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                    {lang === "EN"
                      ? "Understand core concepts of Agentic AI, agent architecture, memory, tools, and how agents think."
                      : "Memahami konsep dasar Agentic AI, arsitektur agen, memori, tools, serta cara agen berpikir dan bertindak otonom."}
                  </p>
                </div>

                {/* Module 2 */}
                <div className="bg-[#FCFAF7] border border-slate-100 hover:border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold shadow-inner">
                    🕸️
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 mt-5">
                    {lang === "EN" ? "MODULE 2" : "MODUL 2"}
                  </span>
                  <h3 className="text-sm font-black text-[#091A36] mt-2 font-['Plus_Jakarta_Sans'] leading-snug min-h-[44px]">
                    {lang === "EN" ? "Core Skills & Workflow Architecture" : "Core Skills & Arsitektur Alur Kerja (Workflow)"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mt-3">
                    ⏱️ 4 {lang === "EN" ? "Hours" : "Jam"}
                  </span>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                    {lang === "EN"
                      ? "Master advanced prompt engineering, persona building, guardrails, and designing multi-agent flows."
                      : "Kuasai prompt engineering tingkat lanjut, persona, guardrails, serta merancang workflow multi-agent yang efektif."}
                  </p>
                </div>

                {/* Module 3 */}
                <div className="bg-[#FCFAF7] border border-slate-100 hover:border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold shadow-inner">
                    📢
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 mt-5">
                    {lang === "EN" ? "MODULE 3" : "MODUL 3"}
                  </span>
                  <h3 className="text-sm font-black text-[#091A36] mt-2 font-['Plus_Jakarta_Sans'] leading-snug min-h-[44px]">
                    {lang === "EN" ? "Agentic AI for Marketing Automation" : "Agentic AI untuk Marketing Automation"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mt-3">
                    ⏱️ 5 {lang === "EN" ? "Hours" : "Jam"}
                  </span>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                    {lang === "EN"
                      ? "Build autonomous content writing engines, competitor tracking setups, and marketing automation."
                      : "Bangun engine konten otonom, riset kompetitor, dan market intelligence yang berjalan otomatis dan terintegrasi."}
                  </p>
                </div>

                {/* Module 4 */}
                <div className="bg-[#FCFAF7] border border-slate-100 hover:border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold shadow-inner">
                    👥
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 mt-5">
                    {lang === "EN" ? "MODULE 4" : "MODUL 4"}
                  </span>
                  <h3 className="text-sm font-black text-[#091A36] mt-2 font-['Plus_Jakarta_Sans'] leading-snug min-h-[44px]">
                    {lang === "EN" ? "Agentic AI for Business & SMB Operations" : "Agentic AI untuk Operasional Bisnis & UMKM"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mt-3">
                    ⏱️ 5 {lang === "EN" ? "Hours" : "Jam"}
                  </span>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                    {lang === "EN"
                      ? "Enhance customer service systems, lead qualification, sales analytics, and business optimization."
                      : "Tingkatkan layanan pelanggan, qualify lead, analisis data penjualan, dan rekomendasi bisnis otomatis dengan AI."}
                  </p>
                </div>

                {/* Module 5 */}
                <div className="bg-[#FCFAF7] border border-slate-100 hover:border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold shadow-inner">
                    🚀
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 mt-5">
                    {lang === "EN" ? "MODULE 5" : "MODUL 5"}
                  </span>
                  <h3 className="text-sm font-black text-[#091A36] mt-2 font-['Plus_Jakarta_Sans'] leading-snug min-h-[44px]">
                    {lang === "EN" ? "No-Code Implementation & Final Evaluation" : "Implementasi Tanpa Coding & Evaluasi Akhir"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mt-3">
                    ⏱️ 3 {lang === "EN" ? "Hours" : "Jam"}
                  </span>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                    {lang === "EN"
                      ? "Deploy robust multi-agent flows on no-code tools, manage API costs, and join the showcase."
                      : "Deploy workflow di platform no-code, evaluasi performa, mengelola biaya, dan final showcase."}
                  </p>
                </div>

              </div>`;

const newModulesGridJSX = `              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mt-12 justify-center items-stretch">
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
                      <div className={\`h-12 w-12 rounded-2xl \${design.bg} \${design.text} flex items-center justify-center text-lg font-bold shadow-inner\`}>
                        {design.emoji}
                      </div>
                      <span className={\`text-[10px] font-extrabold uppercase tracking-wider \${design.text} mt-5\`}>
                        {lang === "EN" ? \`MODULE \${m.id}\` : \`MODUL \${m.id}\`}
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
              </div>`;

content = content.replace(normalize(oldModulesGridJSX), newModulesGridJSX);

// 17. Clean up sessionExplanations to be academic
// EN explanations
const oldEnExplanations = `  EN: {
    1: [
      {
        concept: "Gemini Gems allow business users to design dedicated, custom role personas without coding. By defining a Gem's profile, system instructions, and target output style, you bypass generic chat limitations and build a reliable operational tool.",
        architecture: "Generic ChatGPT ──> Customize Gemini Gem Profile ──> Direct System Instructions ──> Specialized AI Assistant",
        checklist: [
          "Create your first custom Gem in the Gemini interface.",
          "Write a strict system instruction profile defining boundaries and roles.",
          "Test custom outputs and analyze how specific persona guidelines shape responses."
        ]
      },
      {
        concept: "Chain-of-Thought (CoT) prompting trains Gems to outline and explain their steps before presenting an answer. ReAct (Reasoning + Acting) guides them to evaluate if they need to call web search tools, search information otonomously, and refine drafts based on actual observations.",
        architecture: "User Prompt ──> CoT Planning Step ──> Real-time Search Check ──> Analyze Snippets ──> High-Quality Report",
        checklist: [
          "Apply CoT outlines to your Gem prompt instructions.",
          "Test real-time search tool behaviors within Gems.",
          "Compile a SEO trend briefing otonomously using search-enabled Gems."
        ]
      }
    ],
    2: [
      {
        concept: "Structure a multi-persona pipeline where each Gem plays a contrasting, rigid role. The SEO Gem harvests trends, the Copywriter Gem drafts CTAs, and the Editor Gem enforces grammar rules to guarantee outstanding content output.",
        architecture: "Define SEO Persona ──> Design Copywriter Persona ──> Design Editor Persona ──> Unified Output Schema",
        checklist: [
          "Configure strict system persona instruction files for Gems.",
          "Enforce clear markdown output blueprints for consistent UI layouts.",
          "Apply response limits and iteration limits as a guardrail."
        ]
      },
      {
        concept: "Coordinate Gems to work in sequence, where one Gem's output becomes the input for the next. Insert a supervisor reviewer Gem to audit final drafts and implement a human approval step before anything gets launched publicly.",
        architecture: "SEO Gem Output ──> Writer Gem Drafting ──> Editor Gem Audit ──> User Approval Verification Screen",
        checklist: [
          "Connect Gems sequentially to pass text drafts between personas.",
          "Set up context-passing blueprints to maintain document details.",
          "Design an 'Approve / Reject' visual checkpoint for manual human reviews."
        ]
      }
    ],
    3: [
      {
        concept: "Use the Antigravity assistant to search search trends, extract competitive landing page keywords, and draft long-form markdown blog articles that fit modern SEO best practices automatically.",
        architecture: "Search Trends ──> Crawl Competitor Headers ──> Antigravity SEO Outliner ──> Draft Rich SEO Article",
        checklist: [
          "Scout competitor keyword densities using search-enabled agents.",
          "Draft article structures dynamically using outlined SEO blueprints.",
          "Generate finished SEO-optimized blog drafts automatically."
        ]
      },
      {
        concept: "Instruct Antigravity to gather competitive specifications, synthesize strengths and threats into a clean SWOT grid, and route finished executive briefs directly to Slack channels using simple automation pathways.",
        architecture: "Gather Rival Data ──> Compile SWOT Grid ──> Format PDF / Brief ──> Automatic slack Delivery Channel",
        checklist: [
          "Program Antigravity to run competitor analysis sweeps.",
          "Customize visual SWOT matrices and reporting templates.",
          "Route finished briefs directly to communications channels like Slack."
        ]
      }
    ],
    4: [
      {
        concept: "Build visual AI mini-apps inside Google Opal's Labs canvas. Map input boxes, drag-and-drop Gemini-powered processing steps, and outline custom output views to create travel planners, data compilers, or outline tools visually.",
        architecture: "Map Input Box ──> Drag-and-drop Gemini Step ──> Connect Workflow Logic ──> Instant App Share Link",
        checklist: [
          "Design custom inputs and outputs visually on the Google Opal canvas.",
          "Map drag-and-drop AI steps to structure data processing workflows.",
          "Generate app share links to distribute visual AI tools with your team."
        ]
      },
      {
        concept: "Create a custom Opal app to score incoming customer inquiries otonomously based on budget and goals. Have Gemini draft personalized email follow-ups automatically to scale customer service for small businesses.",
        architecture: "Client Inquiry Form ──> Opal Lead Scorer step ──> Custom Email Drafter step ──> Ready-to-send Email draft",
        checklist: [
          "Build a lead filtering app on Opal's visual drag-and-drop canvas.",
          "Configure automated personalized email outreach and follow-up templates.",
          "Scale daily customer management tasks visually without code."
        ]
      }
    ],
    5: [
      {
        concept: "Connect Gems and Opal visual tools to visual low-code pipelines. Trigger automations to run otonomously whenever a customer sends an email or fills out a form, defining simple visual retry loops to manage minor connection drops.",
        architecture: "Email Trigger event ──> Launch Visual Gems pipeline ──> Process Assets ──> Visual error handler step",
        checklist: [
          "Configure visual trigger events from external platforms like sheets or email.",
          "Map visual low-code automation paths to transfer data.",
          "Design visual error handling and retry steps to manage API timeouts."
        ]
      },
      {
        concept: "Execute pre-launch audits. Track daily query quotas and prompt sizes to manage running token fees, execute team dry-runs (UAT) to confirm output quality, and complete the security checklist to protect workspace credentials.",
        architecture: "Track Daily Queries ──> Prune Prompt steps ──> Team Dry-Runs (UAT) ──> Secure Workspace Credentials",
        checklist: [
          "Audit prompt token fees and daily query costs.",
          "Run user acceptance test (UAT) dry-runs with team members.",
          "Complete the 10-point launch checklist covering access control and keys."
        ]
      }
    ]
  }`;

const newEnExplanations = `  EN: {
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
  }`;

content = content.replace(normalize(oldEnExplanations), newEnExplanations);

// ID explanations
const oldIdExplanations = `  ID: {
    1: [
      {
        concept: "Gemini Gems memungkinkan pengguna bisnis merancang persona kustom khusus tanpa coding. Dengan mendefinisikan instruksi sistem, kepribadian peran, dan gaya output, Anda dapat melewati batasan chat AI standar dan membuat alat kerja yang andal.",
        architecture: "Chat AI Generik ──> Kustomisasi Profil Gemini Gems ──> Instruksi Sistem Rigid ──> Asisten AI Spesialis",
        checklist: [
          "Buat Gemini Gems pertama Anda melalui antarmuka Gemini.",
          "Tulis instruksi sistem yang mendetail untuk menetapkan tugas dan batasan Gems.",
          "Uji respon kustom Gems dan evaluasi seberapa konsisten persona AI tersebut."
        ]
      },
      {
        concept: "Prompt Chain-of-Thought (CoT) melatih Gems untuk menjabarkan langkah berpikir mereka sebelum memberikan jawaban. Logika ReAct membimbing asisten AI untuk memikirkan solusi, memanggil alat pencari web otonom, dan merevisi draf berdasarkan data nyata.",
        architecture: "Prompt User ──> Perencanaan Langkah CoT ──> Pencarian Web Real-time ──> Observasi Data ──> Laporan Berkualitas",
        checklist: [
          "Terapkan instruksi berpikir CoT pada prompt asisten Gems Anda.",
          "Uji fungsionalitas pencarian web real-time yang terintegrasi pada Gems.",
          "Susun ringkasan tren pasar secara otomatis menggunakan Gems yang memiliki akses web."
        ]
      }
    ],
    2: [
      {
        concept: "Rancang kolaborasi multi-persona di mana setiap asisten Gems memegang peran rigid yang kontras. Gems SEO fokus pada tren pencarian, Gems Writer menyusun draf konten, dan Gems Editor mengoreksi tata bahasa untuk hasil tulisan premium.",
        architecture: "Persona Gems SEO ──> Persona Gems Writer ──> Persona Gems Editor ──> Output Selaras",
        checklist: [
          "Susun instruksi rigid untuk masing-masing persona asisten Gems.",
          "Terapkan panduan format markdown agar hasil kerja Gems selalu rapi.",
          "Pasang pembatasan panjang teks dan iterasi untuk mengontrol jalannya Gems."
        ]
      },
      {
        concept: "Hubungkan asisten Gems untuk bekerja berurutan, di mana hasil kerja Gems pertama menjadi data masukan bagi Gems berikutnya. Tambahkan Gems Supervisor sebagai editor peninjau dan terapkan pos persetujuan manual manusia sebelum dipublikasikan.",
        architecture: "Output Gems SEO ──> Draf Gems Writer ──> Audit Editor Gems ──> Pos Persetujuan Manusia (HITL)",
        checklist: [
          "Hubungkan alur kerja Gems secara berurutan untuk mengirim data draf tulisan.",
          "Terapkan pedoman pemindahan konteks informasi agar detail dokumen tidak hilang.",
          "Bangun pos persetujuan manual (Setujui / Tolak) sebelum eksekusi rilis publik."
        ]
      }
    ],
    3: [
      {
        concept: "Gunakan asisten cerdas Antigravity untuk mencari tren kata kunci Google, merayap kata kunci kompetitor teratas secara otonom, dan merakit draf artikel blog panjang yang teroptimasi SEO secara otomatis.",
        architecture: "Riset Tren ──> Deteksi Kata Kunci Kompetitor ──> Analisis Outliner Antigravity ──> Draf Blog SEO",
        checklist: [
          "Analisis kepadatan kata kunci kompetitor secara otomatis menggunakan asisten AI.",
          "Rancang struktur artikel blog secara dinamis menggunakan outline buatan agen.",
          "Otomatiskan penyusunan blog artikel teroptimasi SEO yang siap pakai."
        ]
      },
      {
        concept: "Instruksikan Antigravity untuk mengumpulkan data pesaing, menyusun kelebihan dan kelemahan mereka ke dalam matriks SWOT yang rapi, dan mengirimkan laporan briefing otomatis ke saluran Slack tim Anda secara instan.",
        architecture: "Kumpulkan Data Pesaing ──> Kompilasi Tabel SWOT ──> Format Dokumen Laporan ──> Pengiriman Otomatis ke Slack",
        checklist: [
          "Program asisten Antigravity untuk menyapu dan menganalisis situs produk pesaing.",
          "Kustomisasi format tabel analisis SWOT dan template pelaporan.",
          "Salurkan laporan analisis SWOT secara otomatis ke platform komunikasi Slack."
        ]
      }
    ],
    4: [
      {
        concept: "Bangun aplikasi mini AI secara visual di kanvas Labs Google Opal. Desain kotak input, letakkan langkah pemrosesan AI Gemini secara drag-and-drop, dan atur visual output untuk merakit alat pembuat konten, perencana, atau kuesioner tanpa kode.",
        architecture: "Kotak Input Pengguna ──> Langkah Pemrosesan AI ──> Hubungkan Logika Alur ──> Link Akses Aplikasi",
        checklist: [
          "Desain elemen input dan output visual di kanvas drag-and-drop Google Opal.",
          "Pasang langkah pemrosesan bertenaga AI Gemini untuk memproses data visual.",
          "Hasilkan link akses aplikasi mini untuk membagikan tool buatan Anda ke rekan kerja."
        ]
      },
      {
        concept: "Buat aplikasi mini di Google Opal untuk menguji dan memberi skor calon prospek penjualan secara otonom. Biarkan asisten AI mendraf email penawaran personal secara otomatis untuk menghemat waktu operasional UMKM.",
        architecture: "Formulir Masuk ──> Langkah Penilai Prospek Opal ──> Langkah Pembuat Email ──> Draf Email Siap Kirim",
        checklist: [
          "Bangun aplikasi kualifikasi prospek pada kanvas visual Google Opal.",
          "Konfigurasikan asisten pembuat draf email penawaran personal otomatis.",
          "Otomatiskan pengelolaan komunikasi email pelanggan secara visual tanpa coding."
        ]
      }
    ],
    5: [
      {
        concept: "Sambungkan asisten Gems dan aplikasi visual Opal Anda ke pipa integrasi visual low-code. Otomatisasi alur kerja agar terpicu saat ada email baru masuk atau baris tabel diisi, serta pasang langkah retry visual jika jaringan lambat.",
        architecture: "Email Masuk ──> Picu Otomatisasi Gems/Opal ──> Proses Informasi ──> Langkah Retry Ulang",
        checklist: [
          "Konfigurasikan pemicu otomatisasi visual dari platform eksternal seperti email.",
          "Hubungkan alur data secara visual antar-aplikasi no-code Anda.",
          "Rancang langkah penanganan error visual jika terdapat koneksi API terputus."
        ]
      },
      {
        concept: "Jalankan evaluasi pra-rilis. Pantau batas kueri harian dan token prompt untuk menghemat biaya operasional bulanan, lakukan uji coba bersama tim (UAT), dan terapkan checklist keamanan untuk melindungi kredensial akun.",
        architecture: "Lacak Batas Kueri ──> Rapikan Instruksi Prompt ──> Uji Coba Tim (UAT) ──> Checklist Keamanan Akun",
        checklist: [
          "Audit konsumsi token prompt dan kuota kueri harian.",
          "Lakukan uji coba simulasi draf buatan asisten bersama rekan kerja tim Anda.",
          "Selesaikan 10 poin checklist peluncuran untuk memastikan keamanan akun."
        ]
      }
    ]
  }`;

const newIdExplanations = `  ID: {
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
  }`;

content = content.replace(normalize(oldIdExplanations), newIdExplanations);

// Write changes back to App.jsx
fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated App.jsx!");
