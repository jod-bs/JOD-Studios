import ProjectForm from "../components/ProjectForm";
import StudioConsole from "../components/StudioConsole";
import AmbientField from "../components/AmbientField";
import SiteHeader from "../components/SiteHeader";
import OurWorks from "../components/OurWorks";
import Link from "next/link";
import { whatsappUrl } from "../lib/site";

const disciplines = [
  ["Sound", "Dubbing, SFX, original music, mix & master"],
  ["Picture", "Editorial, colour and finishing"],
  ["Worlds", "VFX, 2D motion and 3D animation"],
];
const layer = { position: "relative" as const, zIndex: 1 };

export default function Home() {
  return (
    <>
      <main>
        <SiteHeader />
        <section id="top" className="hero" style={{ position: "relative" }}>
          <AmbientField variant="nebula" />
          <div className="shell hero-grid" style={layer}>
            <div className="hero-copy">
              <p className="kicker">Independent post-production studio · India</p>
              <h1>
                Give the story
                <br />
                <i>its final form.</i>
              </h1>
              <p className="intro">
                Sound, picture and movement crafted under one roof — for work that must hold attention
                long after the screen goes dark.
              </p>
              <a className="text-link" href="#work">
                Enter the studio <span>↓</span>
              </a>
            </div>
            <StudioConsole />
          </div>
        </section>
        <section className="manifesto" style={{ position: "relative", overflow: "hidden" }}>
          <AmbientField variant="bloom" />
          <div className="shell narrow" style={layer}>
            <p className="kicker">What we believe</p>
            <h2>
              A good finish is not an effect.
              <br />
              <i>It is a feeling.</i>
            </h2>
            <p>
              We bring restraint to the technical, and precision to the emotional. Every frame,
              frequency and transition earns its place.
            </p>
          </div>
        </section>
        <OurWorks />
        <section id="rooms" className="rooms" style={{ position: "relative", overflow: "hidden" }}>
          <AmbientField variant="wave" />
          <div className="shell" style={layer}>
            <p className="kicker">One studio, three disciplines</p>
            <div className="discipline-list">
              {disciplines.map(([title, description], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <b>↗</b>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="proof" style={{ position: "relative", overflow: "hidden" }}>
          <AmbientField variant="wave" />
          <div className="shell proof-grid" style={layer}>
            <div>
              <p className="kicker">Inside the process</p>
              <h2>
                Designed to be
                <br />
                <i>heard, not noticed.</i>
              </h2>
            </div>
            <div className="waveform" aria-label="Decorative audio waveform">
              {Array.from({ length: 34 }, (_, i) => (
                <i key={i} style={{ height: `${18 + ((i * 31) % 78)}%` }} />
              ))}
            </div>
            <p>
              From clean dialogue to dense cinematic soundscapes, we give each project a single,
              intentional point of view.
            </p>
          </div>
        </section>
        <section id="start" className="contact" style={{ position: "relative", overflow: "hidden" }}>
          <AmbientField variant="bloom" />
          <div className="shell contact-grid" style={layer}>
            <div>
              <p className="kicker">Start a project</p>
              <h2>
                Something worth
                <br />
                <i>remembering?</i>
              </h2>
              <p>Bring us the brief, the rushes, the rough idea. We will help shape what comes next.</p>
            </div>
            <ProjectForm />
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
      <footer className="shell footer">
        <span>JOD STUDIOS © 2026</span>
        <Link href="/admin" className="admin-footer-link">
          Studio Admin Portal ↗
        </Link>
        <span>Sound · Picture · Motion</span>
      </footer>
    </>
  );
}
