import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a08; --surface: #111110; --surface2: #1a1a18;
    --border: #2a2a26; --accent: #c8f060; --accent2: #f0a030;
    --text: #e8e8e0; --muted: #787870; --dim: #444440;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.6; overflow-x: hidden; cursor: none; }

  .portfolio-root { background: var(--bg); min-height: 100vh; color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  .cursor { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; position: fixed; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); transition: width .2s, height .2s; mix-blend-mode: difference; }
  .cursor.expanded { width: 40px; height: 40px; }

  .noise-overlay { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 1000; opacity: 0.4; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1.5rem 3rem; display: flex; justify-content: space-between; align-items: center; transition: border-color .3s, background .3s; }
  nav.scrolled { background: rgba(10,10,8,.88); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: .08em; color: var(--accent); }
  .nav-links { display: flex; gap: 2.5rem; }
  .nav-links a { font-family: 'DM Mono', monospace; font-size: .78rem; color: var(--muted); text-decoration: none; letter-spacing: .12em; text-transform: uppercase; transition: color .2s; cursor: none; }
  .nav-links a:hover { color: var(--accent); }

  /* HERO */
  .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 8rem 3rem 4rem; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 70% 50%, rgba(200,240,96,.06) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(240,160,48,.04) 0%, transparent 60%); }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 60px 60px; opacity: .3; mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%); }
  .hero-left { position: relative; z-index: 2; }
  .hero-tag { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--accent); letter-spacing: .2em; text-transform: uppercase; margin-bottom: 1.5rem; opacity: 0; animation: fadeUp .8s .2s forwards; }
  .hero-name { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.5rem,7vw,6.5rem); line-height: .92; letter-spacing: .02em; margin-bottom: 1.5rem; opacity: 0; animation: fadeUp .8s .4s forwards; }
  .hero-name span { color: var(--accent); }
  .hero-sub { font-size: 1.05rem; color: var(--muted); max-width: 440px; line-height: 1.8; margin-bottom: 3rem; opacity: 0; animation: fadeUp .8s .6s forwards; }
  .hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; opacity: 0; animation: fadeUp .8s .8s forwards; }
  .btn { padding: .85rem 2rem; font-family: 'DM Mono', monospace; font-size: .78rem; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; border-radius: 2px; transition: all .2s; display: inline-block; cursor: none; border: 1px solid transparent; }
  .btn-primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .btn-primary:hover { background: transparent; color: var(--accent); }
  .btn-outline { background: transparent; color: var(--text); border-color: var(--border); }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .hero-right { position: relative; z-index: 2; display: flex; justify-content: center; align-items: center; opacity: 0; animation: fadeIn 1.2s 1s forwards; }
  .hero-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 2rem; width: 100%; max-width: 360px; position: relative; }
  .hero-card::before { content: ''; position: absolute; top: -1px; left: 40px; right: 40px; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
  .card-row { display: flex; align-items: center; gap: .75rem; padding: .7rem 0; border-bottom: 1px solid var(--border); }
  .card-row:last-child { border-bottom: none; }
  .card-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .card-dot.orange { background: var(--accent2); }
  .card-dot.dim { background: var(--dim); }
  .card-label { font-family: 'DM Mono', monospace; font-size: .7rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; width: 90px; flex-shrink: 0; }
  .card-value { font-size: .85rem; color: var(--text); }
  .status-badge { display: inline-flex; align-items: center; gap: .5rem; font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--accent); letter-spacing: .1em; text-transform: uppercase; margin-top: 1.2rem; padding: .4rem .8rem; border: 1px solid rgba(200,240,96,.2); border-radius: 2px; background: rgba(200,240,96,.05); }
  .status-badge .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }

  /* SECTIONS */
  section { padding: 6rem 3rem; }
  .section-label { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--accent); letter-spacing: .25em; text-transform: uppercase; margin-bottom: .75rem; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem,5vw,4rem); line-height: 1; letter-spacing: .03em; margin-bottom: 3rem; }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5px; background: var(--border); border: 1.5px solid var(--border); }
  .skill-card { background: var(--surface); padding: 2rem; transition: background .2s; }
  .skill-card:hover { background: var(--surface2); }
  .skill-icon { font-family: 'DM Mono', monospace; font-size: 1.3rem; margin-bottom: 1rem; color: var(--accent); }
  .skill-name { font-size: 1rem; font-weight: 500; margin-bottom: .5rem; }
  .skill-desc { font-size:.85rem; color:var(--muted); margin-top:.4rem; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .75rem; }
  .tag { font-family: 'DM Mono', monospace; font-size: .65rem; padding: .25rem .6rem; background: var(--bg); border: 1px solid var(--border); color: var(--muted); letter-spacing: .05em; border-radius: 2px; }

  /* PROJECTS */
  .projects-list { display: flex; flex-direction: column; gap: 1.5px; background: var(--border); border: 1.5px solid var(--border); }
  .project-item { background: var(--surface); padding: 2.5rem; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start; transition: background .2s; position: relative; overflow: hidden; }
  .project-item::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); transform: scaleY(0); transform-origin: bottom; transition: transform .3s ease; }
  .project-item:hover { background: var(--surface2); }
  .project-item:hover::after { transform: scaleY(1); }
  .project-num { font-family: 'DM Mono', monospace; font-size: .7rem; color: var(--dim); letter-spacing: .1em; margin-bottom: .5rem; }
  .project-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: .05em; margin-bottom: .5rem; }
  .project-desc { font-size: .9rem; color: var(--muted); max-width: 600px; line-height: 1.75; margin-bottom: .75rem; }
  .project-bullets { list-style: none; margin-bottom: 1rem; }
  .project-bullets li { font-size: .85rem; color: var(--muted); padding: .2rem 0 .2rem 1rem; position: relative; }
  .project-bullets li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: .75rem; }
  .project-links { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .project-link { display: inline-flex; align-items: center; gap: .4rem; font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--accent); text-decoration: none; letter-spacing: .1em; text-transform: uppercase; border-bottom: 1px solid rgba(200,240,96,.3); padding-bottom: 1px; transition: border-color .2s; cursor: none; }
  .project-link:hover { border-color: var(--accent); }
  .project-link.gh { color: var(--muted); border-color: rgba(120,120,112,.3); }
  .project-link.gh:hover { color: var(--text); border-color: var(--muted); }
  .project-badges { display: flex; flex-direction: column; align-items: flex-end; gap: .5rem; }
  .badge-live { font-family: 'DM Mono', monospace; font-size: .65rem; padding: .3rem .7rem; border: 1px solid rgba(200,240,96,.3); color: var(--accent); border-radius: 2px; background: rgba(200,240,96,.05); display: flex; align-items: center; gap: .4rem; }
  .badge-live .dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }

  /* EDUCATION */
  .edu-list { display: flex; flex-direction: column; gap: 1.5px; background: var(--border); border: 1.5px solid var(--border); }
  .edu-item { background: var(--surface); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; gap: 2rem; transition: background .2s; }
  .edu-item:hover { background: var(--surface2); }
  .edu-degree { font-size: 1rem; font-weight: 500; margin-bottom: .25rem; }
  .edu-school { font-size: .85rem; color: var(--muted); }
  .edu-year { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--dim); letter-spacing: .08em; white-space: nowrap; }

  /* CONTACT */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .contact-links { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
  .contact-link { display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--text); transition: border-color .2s, background .2s; border-radius: 2px; cursor: none; }
  .contact-link:hover { border-color: var(--accent); background: var(--surface2); }
  .contact-link-icon { font-family: 'DM Mono', monospace; font-size: .9rem; color: var(--accent); width: 24px; text-align: center; }
  .contact-link-label { font-size: .9rem; }
  .contact-link-sub { font-family: 'DM Mono', monospace; font-size: .7rem; color: var(--muted); margin-top: .1rem; letter-spacing: .04em; }
  .contact-form { display: flex; flex-direction: column; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: .4rem; }
  .form-label { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--muted); letter-spacing: .12em; text-transform: uppercase; }
  .form-input, .form-textarea { background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: .9rem; padding: .85rem 1rem; border-radius: 2px; outline: none; transition: border-color .2s; resize: none; width: 100%; }
  .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-input.error, .form-textarea.error { border-color: #f06060; }
  .form-textarea { height: 130px; }
  .form-msg { font-family: 'DM Mono', monospace; font-size: .72rem; letter-spacing: .08em; margin-top: .25rem; }
  .form-msg.success { color: var(--accent); }
  .form-msg.error-msg { color: #f06060; }
  .send-btn { align-self: flex-start; }
  .send-btn:disabled { opacity: 0.7; }

  /* FOOTER */
  footer { border-top: 1px solid var(--border); padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center; }
  .footer-copy { font-family: 'DM Mono', monospace; font-size: .7rem; color: var(--dim); letter-spacing: .1em; }
  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: var(--dim); }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.3; } }
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); }

  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; padding: 7rem 1.5rem 3rem; }
    .hero-right { display: none; }
    section { padding: 4rem 1.5rem; }
    nav { padding: 1.2rem 1.5rem; }
    .nav-links { gap: 1.5rem; }
    .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    footer { padding: 1.5rem; flex-direction: column; gap: 1rem; text-align: center; }
    .project-item { grid-template-columns: 1fr; }
    .edu-item { flex-direction: column; align-items: flex-start; gap: .5rem; }
  }
`;

// ── data ──────────────────────────────────────────────────────────────────────
const skills = [
  {
    icon: "{py}",
    name: "Backend Development",
    desc: "Secure REST APIs, auth flows, and scalable architecture with Django and DRF.",
    tags: ["Python", "Django", "DRF", "REST APIs", "Django ORM"],
  },
  {
    icon: "</>",
    name: "Frontend Development",
    desc: "Responsive, component-driven UIs with React and modern styling libraries.",
    tags: ["React.js", "Redux Toolkit", "Tailwind CSS", "Bootstrap", "Axios"],
  },
  {
    icon: "DB→",
    name: "Databases",
    desc: "Relational and document-based databases for production-grade data management.",
    tags: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    icon: "🔐",
    name: "Auth & Integrations",
    desc: "Secure auth systems, payment gateways, and AI integrations.",
    tags: ["JWT", "HTTP-only Cookies", "RBAC", "Razorpay API", "OpenAI API", "Supabase Auth", "Google OAuth"],
  },
  {
    icon: "⬡ OPS",
    name: "DevOps & Deployment",
    desc: "Shipping and maintaining full-stack apps across cloud platforms.",
    tags: ["AWS EC2", "AWS S3", "Render", "Vercel", "Git", "Postman"],
  },
  {
    icon: "{ }",
    name: "Languages",
    desc: "Comfortable across paradigms. 100+ LeetCode problems solved.",
    tags: ["Python", "JavaScript", "Java", "C"],
  },
  {
    icon: "☁ CDN",
    name: "Cloud & Media",
    desc: "Media storage, optimization, and BaaS integrations for production apps.",
    tags: ["Cloudinary", "Supabase", "FastAPI", "MongoDB Atlas", "Serverless"],
  },
];

const projects = [
  {
    num: "01 /",
    name: "CampuSync",
    desc: "A multi-feature SaaS school management platform — now live at campusync.online — with secure auth, role-based dashboards, and real-time features.",
    bullets: [
      "Secure backend APIs built with Django REST Framework",
      "JWT authentication using HTTP-only cookies",
      "Role-based dashboards for admins, teachers, students, and parents",
      "PostgreSQL with Django ORM for robust data management",
    ],
    tags: ["Django", "DRF", "React", "PostgreSQL", "JWT", "HTTP-only Cookies"],
    links: [
      { label: "campusync.online ↗", href: "https://campusync.online", className: "project-link" },
      { label: "GitHub →", href: "https://github.com/AdhilSiyad780/CampuSync", className: "project-link gh" },
    ],
    badges: [{ type: "live", label: "Live" }, { type: "tag", label: "SaaS" }],
  },
  {
    num: "02 /",
    name: "TrillionDollarClub",
    desc: "A futuristic black-and-white e-commerce platform for premium product discovery and curation — live at trilliondollarclub.vercel.app — with admin controls, Supabase auth, and Cloudinary media.",
    bullets: [
      "Supabase authentication with email/password and Google OAuth, JWT verified via RS256 JWKS",
      "Role-based access control — admin panel to manage users, promote/demote roles, and curate products",
      "Multi-image upload with drag-and-drop (up to 10 images) stored on Cloudinary with auto-optimization",
      "FastAPI backend deployed serverless on Vercel with MongoDB Atlas for users and products",
    ],
    tags: ["React", "FastAPI", "MongoDB", "Supabase", "Cloudinary", "Redux Toolkit", "Vite"],
    links: [
      { label: "trilliondollarclub.vercel.app ↗", href: "https://trilliondollarclub.vercel.app", className: "project-link" },
      { label: "GitHub →", href: "https://github.com/AdhilSiyad780/TrillionDollarClub2.0", className: "project-link gh" },
    ],
    badges: [{ type: "live", label: "Live" }, { type: "tag", label: "SaaS" }, { type: "tag", label: "E-Commerce" }],
  },
  {
    num: "03 /",
    name: "Evara Shopping",
    desc: "A full-stack e-commerce platform with product listing, cart management, Razorpay payment integration, and order tracking.",
    bullets: [
      "Product browsing, cart, and checkout features end-to-end",
      "Razorpay payment gateway for secure transactions",
      "Backend logic built with Django and PostgreSQL",
      "User authentication and order tracking system",
    ],
    tags: ["Django", "PostgreSQL", "Razorpay API", "HTML · CSS"],
    links: [
      { label: "GitHub →", href: "https://github.com/AdhilSiyad780", className: "project-link gh" },
    ],
    badges: [{ type: "tag", label: "E-Commerce" }],
  },
];
const education = [
  { degree: "B.Sc Computer Science", school: "CM College of Arts and Science, Nadavayal, Wayanad", year: "2020 – 2023" },
  { degree: "Higher Secondary (12th)", school: "MTDMHSS Thondernad, Korome", year: "2018 – 2020" },
  { degree: "High School (10th)", school: "MTDMHSS Thondernad, Korome", year: "2015 – 2018" },
];

const contactLinks = [
  { icon: "@", label: "Email", sub: "adhilziyad780@gmail.com", href: "mailto:adhilziyad780@gmail.com" },
  { icon: "in", label: "LinkedIn", sub: "linkedin.com/in/adhilsiyad", href: "https://linkedin.com/in/adhilsiyad" },
  { icon: "GH", label: "GitHub", sub: "github.com/AdhilSiyad780", href: "https://github.com/AdhilSiyad780" },
  { icon: "#", label: "Phone", sub: "+91 8921671200", href: "tel:+918921671200" },
];

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Cursor ────────────────────────────────────────────────────────────────────
function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    const expand = () => ref.current?.classList.add("expanded");
    const shrink = () => ref.current?.classList.remove("expanded");
    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .project-item, .skill-card, .contact-link, .edu-item").forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });
    return () => document.removeEventListener("mousemove", move);
  }, []);
  return <div className="cursor" ref={ref} />;
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <div className="nav-logo">AS</div>
      <div className="nav-links">
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#education">Education</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-left">
        <div className="hero-tag">// Python Django &amp; React — Full Stack Developer</div>
        <h1 className="hero-name">ADHIL<br /><span>SIYAD</span><br />A.</h1>
        <p className="hero-sub">Building secure REST APIs, scalable backends, and responsive frontends. Currently shipping CampuSync — a live SaaS school management platform.</p>
        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="mailto:adhilziyad780@gmail.com" className="btn btn-outline">Get in Touch</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-card">
          {[
            { dot: "", label: "Stack", value: "Django · React · PostgreSQL" },
            { dot: "orange", label: "Focus", value: "APIs · Auth · SaaS" },
            { dot: "", label: "Deploy", value: "AWS · Render · Vercel" },
            { dot: "dim", label: "Location", value: "Kozhikode, Kerala" },
            { dot: "", label: "LeetCode", value: "100+ Problems Solved" },
          ].map(({ dot, label, value }) => (
            <div className="card-row" key={label}>
              <div className={`card-dot${dot ? " " + dot : ""}`} />
              <div className="card-label">{label}</div>
              <div className="card-value">{value}</div>
            </div>
          ))}
          <div className="status-badge">
            <span className="dot" />
            Open to opportunities
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills">
      <div className="section-label">// 02 — Expertise</div>
      <h2 className="section-title reveal">Technical Skills</h2>
      <div className="skills-grid reveal">
        {skills.map((s) => (
          <div className="skill-card" key={s.name}>
            <div className="skill-icon">{s.icon}</div>
            <div className="skill-name">{s.name}</div>
            <p className="skill-desc">{s.desc}</p>
            <div className="skill-tags">
              {s.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects">
      <div className="section-label">// 03 — Work</div>
      <h2 className="section-title reveal">Projects</h2>
      <div className="projects-list reveal">
        {projects.map((p) => (
          <div className="project-item" key={p.name}>
            <div>
              <div className="project-num">{p.num}</div>
              <div className="project-name">{p.name}</div>
              <p className="project-desc">{p.desc}</p>
              <ul className="project-bullets">
                {p.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <div className="skill-tags" style={{ marginBottom: "1.25rem" }}>
                {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="project-links">
                {p.links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={l.className}>{l.label}</a>
                ))}
              </div>
            </div>
            <div className="project-badges">
              {p.badges.map((b) =>
                b.type === "live"
                  ? <div className="badge-live" key={b.label}><span className="dot" />{b.label}</div>
                  : <span className="tag" key={b.label}>{b.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education">
      <div className="section-label">// 04 — Background</div>
      <h2 className="section-title reveal">Education</h2>
      <div className="edu-list reveal">
        {education.map((e) => (
          <div className="edu-item" key={e.degree}>
            <div>
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-school">{e.school}</div>
            </div>
            <div className="edu-year">{e.year}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: false }));
  };

  const sendEmail = async () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim() || !form.email.includes("@")) newErrors.email = true;
    if (!form.message.trim()) newErrors.message = true;
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setStatus("error");
      setMsg("// Please fill in all fields correctly.");
      return;
    }
    setStatus("sending");
    setMsg("");
    try {
      // emailjs global loaded via CDN — dynamically import if needed
      const emailjs = window.emailjs;
      if (!emailjs) throw new Error("EmailJS not loaded");
      await emailjs.send("service_uegtbnb", "template_tjspoz8", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setStatus("success");
      setMsg("// Message sent — I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus("error");
      setMsg("// Failed to send. Please try emailing directly.");
    }
  };

  return (
    <section id="contact">
      <div className="section-label">// 05 — Connect</div>
      <h2 className="section-title reveal">Get in Touch</h2>
      <div className="contact-grid reveal">
        <div>
          <p style={{ color: "var(--muted)", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 380 }}>
            Open to freelance work, collaborations, and full-time opportunities. If you have an interesting project or role, let's talk.
          </p>
          <div className="contact-links">
            {contactLinks.map((l) => (
              <a key={l.label} href={l.href} className="contact-link" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <div className="contact-link-icon">{l.icon}</div>
                <div>
                  <div className="contact-link-label">{l.label}</div>
                  <div className="contact-link-sub">{l.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="contact-form">
          {["name", "email"].map((field) => (
            <div className="form-group" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                className={`form-input${errors[field] ? " error" : ""}`}
                name={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field === "email" ? "your@email.com" : "Your name"}
                value={form[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className={`form-textarea${errors.message ? " error" : ""}`}
              name="message"
              placeholder="Tell me about your project or opportunity..."
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <button
            className="btn btn-primary send-btn"
            onClick={sendEmail}
            disabled={status === "sending"}
            style={
              status === "success"
                ? { background: "var(--surface)", color: "var(--accent)", borderColor: "var(--accent)" }
                : {}
            }
          >
            {status === "sending" ? "Sending..." : status === "success" ? "Sent ✓" : "Send Message"}
          </button>
          {msg && (
            <div className={`form-msg${status === "success" ? " success" : " error-msg"}`}>{msg}</div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  useReveal();

  // inject EmailJS
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => window.emailjs?.init({ publicKey: "TfXLZl3ovOD4ixEwX" });
    document.head.appendChild(s);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="portfolio-root">
        <div className="noise-overlay" />
        <Cursor />
        <Nav />
        <Hero />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <footer>
          <div className="footer-copy">© 2026 Adhil Siyad A — Kozhikode, Kerala</div>
          <div className="footer-logo">AS</div>
        </footer>
      </div>
    </>
  );
}