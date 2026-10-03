type Mark = {
  name: string;
  mark: string;
  logo?: string;
};

const SPARKS = Array.from({ length: 8 }, (_, index) => index);

function logoSrc(logo: string) {
  return logo
    .split("/")
    .map((part, index) => (index === 0 ? part : encodeURIComponent(part)))
    .join("/");
}

export default function ClientMarquee({ clients }: { clients: Mark[] }) {
  const row = (hidden = false) => (
    <ul className="spa-logo-row" aria-hidden={hidden || undefined}>
      {clients.map((client) => (
        <li key={`${hidden ? "copy-" : ""}${client.name}`}>
          <div className="spa-logo-card">
            <div className="spa-logo-face">
              {client.logo ? (
                <img
                  className="spa-logo-cover"
                  src={logoSrc(client.logo)}
                  alt={hidden ? "" : client.name}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="spa-logo-fallback" aria-hidden="true">
                  {client.mark}
                </span>
              )}
            </div>
            {SPARKS.map((spark) => (
              <span key={spark} className="spa-logo-spark" aria-hidden="true" />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="spa-marquee" aria-label="Client logos">
      <div className="spa-marquee-track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
