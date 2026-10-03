import ProjectForm from "../components/ProjectForm";
import AmbientField from "../components/AmbientField";
import { Scene } from "../components/HeroField";
import { ServicesField } from "../components/ServicesField";
import SiteHeader from "../components/SiteHeader";
import ClientMarquee from "../components/ClientMarquee";
import Reveal from "../components/Reveal";
import Link from "next/link";
import { whatsappUrl } from "../lib/site";

const services = [
  {
    title: "Dubbing",
    copy: "Language, breath and performance shaped until the picture believes the voice was always there.",
    icon: "mic",
  },
  {
    title: "Music, mix & master",
    copy: "Score, stems and the final polish that holds a mix together from a whisper to full scale.",
    icon: "wave",
  },
  {
    title: "SFX",
    copy: "Designed sound for impact, space and detail. Every hit, room and texture earns its weight.",
    icon: "spark",
  },
  {
    title: "VFX",
    copy: "Shots that stay invisible, or impossible, on purpose. Finish that serves the story first.",
    icon: "frame",
  },
  {
    title: "Video editing",
    copy: "Rhythm, structure and picture cut to the pulse of the story, with nothing left that does not belong.",
    icon: "cut",
  },
  {
    title: "2D & 3D animation",
    copy: "Characters and worlds drawn and built to move with intent, from a sketch to a finished scene.",
    icon: "cube",
  },
] as const;

const clients = [
  { name: "Abirami media works", mark: "NF", logo: "/clients/Abirami.webp" },
  { name: "Accenture", mark: "LR", logo: "/clients/Accenture.webp" },
  { name: "L&T", mark: "HD", logo: "/clients/L & T  values.webp" },
  { name: "ZEE5", mark: "KA", logo: "/clients/Zee 5.webp" },
  { name: "Times Of India", mark: "OG", logo: "/clients/Times Of India.webp" },
  { name: "Kuviyam media works", mark: "VS", logo: "/clients/Kuviyam media works.webp" },
  { name: "ANC jewellery", mark: "OG", logo: "/clients/ANC Jewellery.webp" },
  { name: "Cocoplaynut", mark: "PS", logo: "/clients/Cocoplaynut.webp" },
  { name: "Inner wheel", mark: "FM", logo: "/clients/Inner Wheel.webp" },
  { name: "Rotary", mark: "RT", logo: "/clients/Rotary.webp" }
]; 

const quotes = [
  {
    quote: "The mix felt finished the first time we played it back in the theatre. Nothing asked for attention. Everything held.",
    name: "Aarav Sharma",
    role: "Director, short film",
    initials: "AS",
  },
  {
    quote: "They treated the language pass with the same care as the picture. Our cast sounded like they had always spoken it.",
    name: "Priya Nair",
    role: "Producer, brand film",
    initials: "PN",
  },
  {
    quote: "Editorial and VFX stayed in step. The impossible shots never outgrew the story they were serving.",
    name: "Rohan Deshmukh",
    role: "Documentary editor",
    initials: "RD",
  },
];

const wa = whatsappUrl("Hi JOD Studios, I would like to discuss my project.");

function Icon({ name }: { name: (typeof services)[number]["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      {name === "mic" && (
        <>
          <rect x="12" y="4" width="8" height="14" rx="4" {...common} />
          <path d="M8 15a8 8 0 0 0 16 0M16 23v5" {...common} />
        </>
      )}
      {name === "wave" && <path d="M4 16h3l2-7 4 14 3-9 2 5h10" {...common} />}
      {name === "spark" && (
        <path d="M16 4l1.8 8.2L26 14l-8.2 1.8L16 24l-1.8-8.2L6 14l8.2-1.8L16 4z" {...common} />
      )}
      {name === "frame" && (
        <>
          <rect x="5" y="7" width="22" height="16" rx="2" {...common} />
          <path d="M5 20l6-5 4 3 4-4 8 6" {...common} />
        </>
      )}
      {name === "cut" && <path d="M9 24l14-16M20 24L6 8M9 22a3 3 0 1 0 0.01 0M20 22a3 3 0 1 0 0.01 0" {...common} />}
      {name === "cube" && <path d="M16 4l11 6v12L16 28 5 22V10L16 4zM16 16l11-6M16 16v12M16 16L5 10" {...common} />}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="spa">
      <SiteHeader />
      <main>
        <section id="hero" className="spa-hero" aria-labelledby="hero-title">
          <Scene />
          <div className="spa-wrap spa-hero-grid">
            <div className="spa-hero-copy">
              <p className="spa-kicker">Independent post-production · India</p>
              <h1 id="hero-title">
                Give the story
                <br />
                <em>its final form.</em>
              </h1>
              <p>
                Sound, picture and movement crafted under one roof — for work that must hold attention
                long after the screen goes dark.
              </p>
              <div className="spa-actions">
                <a className="button dark" href="#start">
                  Start your project
                </a>
                <a className="spa-ghost" href="#services">
                  See the services
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="spa-section spa-about" aria-labelledby="about-title">
          <div className="spa-wrap spa-about-grid">
            <Reveal>
              <p className="spa-kicker">About</p>
              <h2 id="about-title">
                A finish you feel,
                <br />
                <em>not a finish you notice.</em>
              </h2>
              <p className="spa-lead">
                JOD Studios is an independent post-production room in India. We dub, mix, cut and
                animate so the story can hold a room.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="services" className="spa-section spa-services" aria-labelledby="services-title">
          <ServicesField />
          <div className="spa-wrap">
            <Reveal className="spa-center">
              <p className="spa-kicker">Our services</p>
              <h2 id="services-title">
                Six rooms.
                <em> One finish.</em>
              </h2>
            </Reveal>
            <div className="spa-cards">
              {services.map((service, index) => (
                <Reveal key={service.title} delay={index * 50}>
                  <article className="spa-card">
                    <span className="spa-icon">
                      <Icon name={service.icon} />
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="clients" className="spa-section spa-clients" aria-labelledby="clients-title">
          <div className="spa-wrap spa-center">
            <Reveal>
              <p className="spa-kicker">Our clients</p>
              <h2 id="clients-title">
                Trusted across pictures
                <em> in every category.</em>
              </h2>
              <p className="spa-lead">Sample marks. The loop stands in for the rooms we regularly finish.</p>
            </Reveal>
          </div>
          <ClientMarquee clients={clients} />
        </section>

        <section id="testimonials" className="spa-section" aria-labelledby="notes-title">
          <div className="spa-wrap">
            <Reveal className="spa-center">
              <p className="spa-kicker">Testimonials</p>
              <h2 id="notes-title">
                Notes from the room
                <em> after the lights come up.</em>
              </h2>
            </Reveal>
            <div className="spa-quotes">
              {quotes.map((item, index) => (
                <Reveal key={item.name} delay={index * 70}>
                  <article className="spa-quote">
                    <div className="spa-stars" aria-label="5 stars">
                      ★★★★★
                    </div>
                    <p>{item.quote}</p>
                    <footer>
                      <span className="spa-avatar" aria-hidden="true">
                        {item.initials}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        {item.role}
                      </span>
                    </footer>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="start" className="spa-section spa-cta" aria-labelledby="start-title">
          <AmbientField variant="bloom" />
          <div className="spa-wrap spa-cta-grid">
            <Reveal>
              <p className="spa-kicker">Start a project</p>
              <h2 id="start-title">
                Something worth
                <br />
                <em>remembering?</em>
              </h2>
              <p className="spa-lead">
                Bring the brief, the rushes, or the rough idea. We will help shape what comes next.
              </p>
              <a className="button dark" href="#project-form">
                Start your project
              </a>
            </Reveal>
            <Reveal delay={80}>
              <div id="project-form">
                <ProjectForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <a className="whatsapp" href={wa} aria-label="Message JOD Studios on WhatsApp" target="_blank" rel="noopener noreferrer">
        WA
      </a>

      <footer className="spa-footer">
        <div className="spa-wrap spa-footer-grid">
          <div>
            <a className="spa-brand" href="#hero">
              JOD <em>Studios</em>
            </a>
            <p>Sound, picture and motion. India.</p>
          </div>
          <nav aria-label="Footer">
            <a href="#about">About</a>
            <a href="#services">Our Services</a>
            <a href="#clients">Our Clients</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#start">Start a Project</a>
            <Link href="/admin">Studio admin</Link>
          </nav>
          <div className="spa-contact">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href="#start">Start a project</a>
            <div className="spa-social" aria-label="Social">
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 19l1.2-3.4A8 8 0 1 1 8.6 18L5 19z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
              <a href="#start" aria-label="Contact the studio">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
            </div>
          </div>
          <p className="spa-copy">© {new Date().getFullYear()} JOD Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
