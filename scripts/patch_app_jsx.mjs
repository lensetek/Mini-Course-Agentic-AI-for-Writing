import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const normalize = (str) => str.replace(/\r\n/g, '\n');
content = normalize(content);

const replaceExact = (search, replacement) => {
  const normSearch = normalize(search);
  const normReplacement = normalize(replacement);
  if (content.includes(normSearch)) {
    content = content.split(normSearch).join(normReplacement);
    console.log(`Replaced: ${search.substring(0, 50)}...`);
  } else {
    console.error(`ERROR: Could not find: ${search.substring(0, 50)}...`);
  }
};

// 1. Replace agentSteps
const oldAgentSteps = `const agentSteps = [
  {
    id: 1,
    title: "Trend Research Agent",
    desc: "Mencari tren, keyword, dan peluang SEO",
    details: "Menganalisis Google Trends & SERP terbaru untuk mengidentifikasi topik bernilai tinggi.",
    status: "success",
    duration: 1.5
  },
  {
    id: 2,
    title: "Content Writer Agent",
    desc: "Menulis konten sesuai brand voice",
    details: "Membuat draft artikel, postingan sosial media, dan email newsletter terstruktur.",
    status: "success",
    duration: 2.0
  },
  {
    id: 3,
    title: "QA & Fact-Check Agent",
    desc: "Memeriksa akurasi dan keterbacaan",
    details: "Memvalidasi sumber data, memeriksa kesalahan tata bahasa, dan memverifikasi keterbacaan SEO.",
    status: "success",
    duration: 1.0
  },
  {
    id: 4,
    title: "Report Agent",
    desc: "Mengirim ringkasan ke email/dashboard",
    details: "Secara otomatis mempublikasikan ke CMS dan mengirimkan KPI performa ke tim Anda.",
    status: "success",
    duration: 0.8
  },
];`;

const newAgentSteps = `const agentSteps = [
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
];`;

replaceExact(oldAgentSteps, newAgentSteps);

// 2. Replace ID translation values
replaceExact(
  `    heroDescription: "Belajar membangun agen AI otonom untuk riset pasar, produksi konten, customer support, analisis data penjualan, dan workflow bisnis harian. Tidak wajib coding. Fokus praktis: memahami arsitektur, merancang alur kerja agen, lalu menjalankannya dengan platform no-code/low-code.",`,
  `    heroDescription: "Pelajari cara membangun agen AI otonom untuk analisis literatur, rancang asisten proposal penelitian kustom, bangun skill penulisan akademik yang dapat digunakan kembali, dan orkestrasikan ekosistem penerbitan. Tidak wajib coding. Fokus praktis: kuasai workspace berbasis sumber data, bangun agen Opal, dan tulis skill dengan Antigravity.",`
);

replaceExact(
  `    competencyDescription: "Kursus intensif ini dirancang khusus untuk marketer, pemilik bisnis, manajer operasional, konsultan teknis, dosen/trainer, dan tim profesional yang ingin menerapkan AI secara strategis.",`,
  `    competencyDescription: "Program ini dirancang khusus untuk dosen, peneliti, penulis, mahasiswa, dan profesional akademik yang ingin menerapkan kecerdasan buatan (AI) secara strategis dalam penelitian ilmiah dan alur kerja publikasi mereka.",`
);

replaceExact(
  `    useCasesHeader: "Business Use Cases",`,
  `    useCasesHeader: "Academic Use Cases",`
);

replaceExact(
  `    useCasesTitle: "Solusi AI yang dirancang untuk pekerjaan bisnis nyata harian.",`,
  `    useCasesTitle: "Solusi AI yang dirancang untuk alur kerja akademik nyata harian.",`
);

replaceExact(
  `    useCasesDescription: "Lupakan latihan coding teoretis. Setiap use case dibangun langsung di sekitar tanggung jawab operasional penting: riset pasar instan, optimasi konten SEO, kualifikasi prospek penjualan, analitik stok pintar, dan keputusan operasional cepat.",`,
  `    useCasesDescription: "Lupakan latihan coding teoretis. Setiap use case dibangun langsung di sekitar tanggung jawab akademik penting: sintesis literatur otomatis, identifikasi gap riset, metodologi proposal, outline bab naskah, dan penulisan draf berbasis etika.",`
);

replaceExact(
  `    ctaHeader: "Siap membangun alur kerja multi-agent AI pertama Anda?",`,
  `    ctaHeader: "Siap membangun sistem riset dan penulisan akademik otonom Anda?",`
);

replaceExact(
  `    ctaDescription: "Daftar di Lensetek Certification Program, masuk ke akademi simulasi digital kami, dan kuasai framework Agentic AI yang dirancang khusus untuk skala bisnis Anda.",`,
  `    ctaDescription: "Daftar di Lensetek Certification Program, masuk ke akademi simulasi digital kami, dan kuasai framework Agentic AI yang dirancang khusus untuk riset ilmiah dan kepengaruhan akademik.",`
);

// 3. Replace skillsList and useCasesList
const oldSkillsAndUseCases = `const skillsList = [
  "Architectural thinking to translate complex business challenges into automated AI workflows",
  "Advanced prompting & persona design for copywriters, market analysts, and compliance checks",
  "Seamless tool integration: web search engines, knowledge bases, custom APIs, and live dashboards",
  "Orchestration mastery to design, control, and sync collaboration among multiple specialized agents",
];

const useCasesList = [
  "Automated content marketing engines",
  "Competitor tracking & auto SWOT reports",
  "Smart customer support with human escalation",
  "Lead qualification systems for sales teams",
  "Autonomous CSV/Excel sales data analytics",
  "Smart inventory & demand recommendations",
];`;

const newSkillsAndUseCases = `const skillsList = [
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
];`;

replaceExact(oldSkillsAndUseCases, newSkillsAndUseCases);

// 4. Replace moduleQuestions
const moduleQuestionsStartIndex = content.indexOf('const moduleQuestions = {');
const getFallbackResponseIndex = content.indexOf('const getFallbackResponse =');

if (moduleQuestionsStartIndex !== -1 && getFallbackResponseIndex !== -1) {
  const beforeQuestions = content.slice(0, moduleQuestionsStartIndex);
  const afterQuestions = content.slice(getFallbackResponseIndex);
  
  const newModuleQuestions = `const moduleQuestions = {
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
};`;

  content = beforeQuestions + newModuleQuestions + afterQuestions;
  console.log("Successfully replaced moduleQuestions!");
} else {
  console.error("ERROR: Could not find moduleQuestions start/end indices.");
}

// 5. Replace getFallbackResponse
const getFallbackResponseStartIndex = content.indexOf('const getFallbackResponse =');
const landingPageClassStartIndex = content.indexOf('export default function LensetekAgenticAiLandingPage()');

if (getFallbackResponseStartIndex !== -1 && landingPageClassStartIndex !== -1) {
  const beforeFallback = content.slice(0, getFallbackResponseStartIndex);
  const afterFallback = content.slice(landingPageClassStartIndex);

  const newFallbackResponse = `const getFallbackResponse = (prompt, moduleIdx, lang) => {
  const isId = lang === "ID";
  const p = prompt.toLowerCase();
  
  if (moduleIdx === 0) {
    if (p.includes("maksud") || p.includes("apa") || p.includes("jelas")) {
      return isId 
        ? "Tentu! Di Modul 1 ini, maksud dari **Agentic AI** adalah teknologi kecerdasan buatan yang tidak hanya pasif menjawab pertanyaan (seperti ChatGPT biasa), melainkan bisa bertindak mandiri secara otonom untuk menyelesaikan tugas penelitian Anda. Prakteknya kita menggunakan **NotebookLM** untuk mengunggah berbagai sumber referensi akademik dan menganalisis polanya secara otonom tanpa perlu mengerti pemrograman sama sekali."
        : "Sure! In Module 1, **Agentic AI** refers to AI systems that don't just passively answer questions, but can actively plan, reason, and use tools autonomously to achieve research goals. We will practice this by using **NotebookLM** to upload various academic sources and analyze patterns autonomously without coding.";
    }
    return isId
      ? \`Pertanyaan yang bagus sekali tentang Fondasi Agentic AI! Di sesi ini, kita belajar merancang basis pengetahuan terorganisasi pada **NotebookLM** agar kustom asisten Anda bisa memetakan dan menyintesis literatur secara otomatis. Anda tidak perlu coding, cukup unggah dokumen referensi Anda.\`
      : \`That is a wonderful question about Agentic AI Foundations! In this session, we learn how to structure organized research workspaces using **NotebookLM** to synthesize journals and books. No coding required, just upload your reference sources.\`;
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

`;

  content = beforeFallback + newFallbackResponse + afterFallback;
  console.log("Successfully replaced getFallbackResponse!");
} else {
  console.error("ERROR: Could not find getFallbackResponse start/end indices.");
}

// 6. Replace fallback course title in getLinkedInUrl
replaceExact(
  `      name: record.courseTitle || "Agentic AI for Marketing & Business",`,
  `      name: record.courseTitle || "Agentic AI Mastery for Researchers & Authors",`
);

// 7. Replace UI Transcript Preview Table (33 spaces of indentation)
const oldUiTable = `                                 {[
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
                                 ].map((m) => (`;

const newUiTable = `                                 {[
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
                                 ].map((m) => (`;

replaceExact(oldUiTable, newUiTable);

// 8. Replace landing page curriculum description text
replaceExact(
  `              <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto font-medium">
                {lang === "EN" 
                  ? "Designed step-by-step for absolute beginners to business professionals. No coding required." 
                  : "Dirancang secara bertahap untuk pemula hingga profesional bisnis. Tidak membutuhkan latar belakang coding."}
              </p>`,
  `              <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto font-medium">
                {lang === "EN" 
                  ? "Designed step-by-step for absolute beginners to academic professionals. No coding required." 
                  : "Dirancang secara bertahap untuk pemula hingga dosen, akademisi, dan peneliti. Tidak membutuhkan latar belakang coding."}
              </p>`
);

// 9. Replace landing page modules grid
const oldModulesGrid = `              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
                
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

const newModulesGrid = `              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
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

replaceExact(oldModulesGrid, newModulesGrid);

// 10. Replace solutions cards section (using original "Business" values)
const oldSolutionsHeader = `            <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#091A36] sm:text-4xl font-['Plus_Jakarta_Sans']">
                {lang === "EN" ? "Build Real-World Solutions for Your Business" : "Bangun Solusi Nyata untuk Bisnis Anda"}
              </h2>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto font-medium">
                {lang === "EN"
                  ? "Explore ready-to-deploy core agents modeled directly in our comprehensive academy."
                  : "Mulai bangun solusi kecerdasan buatan siap pakai untuk operasional bisnis harian Anda."}
              </p>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
                
                {/* Solution 1 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/content_marketing.png" 
                      alt="Content Marketing Engine" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-amber-400 text-slate-955 flex items-center justify-center text-xs shadow-md">
                      ✏️
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Content Marketing Engine
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Automated trend research, copywriting, and QA check." 
                          : "Riset tren, penulisan, dan QA konten berjalan otomatis."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 2 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/competitor_tracking.png" 
                      alt="Competitor Tracking" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xs shadow-md">
                      📊
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Competitor Tracking
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Monitor competitor prices, reviews, and activities periodically." 
                          : "Pantau harga, ulasan, dan aktivitas kompetitor secara berkala."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 3 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/customer_support.png" 
                      alt="Customer Support Cerdas" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-purple-400 text-white flex items-center justify-center text-xs shadow-md">
                      💬
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Customer Support Cerdas
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Answer FAQs, route escalations, and integrate order lookups via API." 
                          : "Jawab FAQ, routing eskalasi, dan integrasi cek pesanan via API."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 4 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/sales_analytics.png" 
                      alt="Analisis Penjualan" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shadow-md">
                      📈
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Analisis Penjualan
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Read data, identify trends, and generate automated business suggestions." 
                          : "Baca data, temukan tren, dan dapatkan rekomendasi otomatis."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution 5 */}
                <div className="bg-[#FCFAF7] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src="/warehouse_boxes.png" 
                      alt="Rekomendasi Stok & Promosi" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs shadow-md">
                      📦
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-xs font-black text-[#091A36] font-['Plus_Jakarta_Sans']">
                        Rekomendasi Stok & Promosi
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Optimize stock inventory and data-driven promotion strategies." 
                          : "Optimalkan stok barang dan strategi promosi berbasis data."}
                      </p>
                    </div>
                  </div>
                </div>`;

const newSolutionsHeader = `            <div className="mx-auto max-w-7xl text-center">
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
                    <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-amber-400 text-slate-955 flex items-center justify-center text-xs shadow-md">
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
                          : "Riset tren, penulisan, dan QA konten berjalan otomatis."}
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
                        {lang === "EN" ? "Academic Reviewer OS" : "Academic Reviewer OS"}
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
                        {lang === "EN" ? "Proposal Writer Companion" : "Asisten Penulisan Proposal"}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Draft background of the study, formulation of the problem, and methodologies." 
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
                        {lang === "EN" ? "Book Outline Creator" : "Pembuat Outline Buku"}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
                        {lang === "EN" 
                          ? "Create syllabus-aligned chapters and teaching lesson plans." 
                          : "Menyusun outline bab buku dan rencana modul pembelajaran."}
                      </p>
                    </div>
                  </div>
                </div>`;

replaceExact(oldSolutionsHeader, newSolutionsHeader);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully completed all app replacements!");
