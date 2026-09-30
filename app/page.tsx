import ProjectForm from "../components/ProjectForm";
import SiteHeader from "../components/SiteHeader";
import OurWorks from "../components/OurWorks";
import HeroStage from "../components/HeroStage";
import Marquee from "../components/Marquee";
import Reveal from "../components/Reveal";
import Link from "next/link";
import { whatsappUrl } from "../lib/site";

const marks = ["Features", "Series", "Ads", "Docs", "Music", "Games", "Shorts", "Brand films"];

const services = [
  {
    n: "01",
    title: "Dubbing",
    copy: "Language, breath and performance shaped until the picture believes the voice was always there.",
    note: "Dialogue",
  },
  {
    n: "02",
    title: "Music, mix & master",
    copy: "Score, stems and the final polish that holds a mix together from a whisper to full scale.",
    note: "Sound",
  },
  {
    n: "03",
    title: "SFX",
    copy: "Designed sound for impact, space and detail. Every hit, room and texture earns its weight.",
    note: "Design",
  },
  {
    n: "04",
    title: "VFX",
    copy: "Shots that stay invisible, or impossible, on purpose. Finish that serves the story first.",
    note: "Picture",
  },
  {
    n: "05",
    title: "Video editing",
    copy: "Rhythm, structure and picture cut to the pulse of the story — nothing left that doesn’t belong.",
    note: "Editorial",
  },
  {
    n: "06",
    title: "2D & 3D animation",
    copy: "Characters and worlds drawn and built to move with intent, from a sketch to a finished scene.",
    note: "Motion",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=70",
];

const steps = [
  {
    n: "01",
    title: "Analyze",
    copy: "We sit with the brief, the rushes and the feeling the work has to leave behind.",
  },
  {
    n: "02",
    title: "Execute",
    copy: "Sound, picture and motion are finished under one roof, with a single point of view.",
  },
  {
    n: "03",
    title: "Scale",
    copy: "Versions, languages and deliveries are prepared so the story holds on every screen.",
  },
];

const quotes = [
  {
    quote: "The mix felt finished the first time we played it back in the theatre. Nothing asked for attention. Everything held.",
    name: "Aarav Sharma",
    role: "Director, short film",
  },
  {
    quote: "They treated the language pass with the same care as the picture. Our cast sounded like they had always spoken it.",
    name: "Priya Nair",
    role: "Producer, brand film",
  },
  {
    quote: "Editorial and VFX stayed in step. The impossible shots never outgrew the story they were serving.",
    name: "Rohan Deshmukh",
    role: "Documentary editor",
  },
  {
    quote: "A calm room, precise notes, and a master that still sounds expensive months later.",
    name: "Meera Iyer",
    role: "Music supervisor",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section id="top" className="ag-hero">
          <div className="ag-wrap ag-center">
            <p className="ag-kicker">Independent post-production · India</p>
            <h1>
              Picture and sound
              <br />
              <em>finished to last.</em>
            </h1>
            <p className="ag-lead">
              Dubbing, music, effects, editorial and animation crafted under one roof — for work that
              must hold attention long after the screen goes dark.
            </p>
            <div className="ag-actions">
              <a className="ag-pill" href="#start">
                Start a project
              </a>
              <a className="ag-ghost" href="#work">
                View the work
              </a>
            </div>
          </div>
          <HeroStage />
        </section>

        <section className="ag-section ag-trust" id="clients">
          <Reveal className="ag-wrap ag-center">
            <p className="ag-kicker">The work</p>
            <h2>
              Trusted across pictures
              <br />
              <em>in every category.</em>
            </h2>
          </Reveal>
          <Marquee className="ag-logo-marquee" duration={36}>
            {marks.map((mark) => (
              <span className="ag-logo-card" key={mark}>
                {mark}
              </span>
            ))}
          </Marquee>
          <Marquee className="ag-logo-marquee" reverse duration={42}>
            {[...marks].reverse().map((mark) => (
              <span className="ag-logo-card ag-logo-card-soft" key={mark}>
                {mark}
              </span>
            ))}
          </Marquee>
        </section>

        <section className="ag-section" id="services">
          <Reveal className="ag-wrap ag-center">
            <p className="ag-kicker">Services</p>
            <h2>
              Everything the picture
              <br />
              <em>needs to hold.</em>
            </h2>
            <p className="ag-lead ag-narrow">
              Six disciplines, one finish. Each room is built to disappear into the story.
            </p>
          </Reveal>
          <div className="ag-wrap">
            <div className="ag-service-grid">
              {services.map((service, index) => (
                <Reveal key={service.n} delay={index * 0.05} className="ag-service-card">
                  <div className="ag-card-top">
                    <span>{service.n}</span>
                    <small>{service.note}</small>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Marquee className="ag-chip-marquee" duration={28}>
            {services.map((service) => (
              <span className="ag-chip" key={service.n}>
                {service.n} {service.title}
              </span>
            ))}
          </Marquee>
        </section>

        <OurWorks />

        <section className="ag-section ag-statement">
          <Reveal className="ag-wrap ag-center">
            <h2>
              We don’t decorate the picture.
              <br />
              <em>We finish it.</em>
            </h2>
            <p className="ag-lead ag-narrow">
              Restraint on the technical side. Precision on the emotional side. Every frame, frequency
              and transition earns its place.
            </p>
          </Reveal>
          <Marquee duration={48}>
            {gallery.map((src) => (
              <img key={src} className="ag-still" src={src} alt="" loading="lazy" />
            ))}
          </Marquee>
        </section>

        <section className="ag-section" id="process">
          <Reveal className="ag-wrap ag-center">
            <p className="ag-kicker">Process</p>
            <h2>
              Three steps from
              <br />
              <em>brief to screen.</em>
            </h2>
          </Reveal>
          <div className="ag-wrap">
            <div className="ag-steps">
              <div className="ag-steps-line" aria-hidden="true" />
              {steps.map((step, index) => (
                <Reveal key={step.n} delay={index * 0.08} className="ag-step">
                  <span className="ag-step-index">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="ag-section" id="notes">
          <Reveal className="ag-wrap ag-center">
            <p className="ag-kicker">Notes from the room</p>
            <h2>
              Every project leaves
              <br />
              <em>a quieter cut.</em>
            </h2>
          </Reveal>
          <Marquee className="ag-quote-marquee" duration={55}>
            {quotes.map((item) => (
              <article className="ag-quote" key={item.name}>
                <div className="ag-stars" aria-label="5 stars">
                  ★★★★★
                </div>
                <p>{item.quote}</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </article>
            ))}
          </Marquee>
        </section>

        <section id="start" className="ag-section ag-contact">
          <div className="ag-wrap ag-contact-grid">
            <Reveal>
              <p className="ag-kicker">Start a project</p>
              <h2>
                Something worth
                <br />
                <em>remembering?</em>
              </h2>
              <p className="ag-lead">
                Bring us the brief, the rushes, the rough idea. We will help shape what comes next.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ProjectForm />
            </Reveal>
          </div>
        </section>
      </main>
      <a
        className="whatsapp"
        href={whatsappUrl("Hi JOD Studios, I would like to discuss my project.")}
        aria-label="Message JOD Studios on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        WA
      </a>
      <footer className="ag-footer">
        <span>JOD Studios © 2026</span>
        <Link href="/admin">Studio admin</Link>
        <span>Sound · Picture · Motion</span>
      </footer>
    </>
  );
}
