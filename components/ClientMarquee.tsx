type Mark = { name: string; mark: string };

export default function ClientMarquee({ clients }: { clients: Mark[] }) {
  const row = (hidden = false) => (
    <ul className="spa-logo-row" aria-hidden={hidden || undefined}>
      {clients.map((client) => (
        <li key={`${hidden ? "copy-" : ""}${client.name}`}>
          <span aria-hidden="true">{client.mark}</span>
          {client.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="spa-marquee" aria-label="Sample client marks">
      <div className="spa-marquee-track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
