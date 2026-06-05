export function ProductCover({ large = false }: { large?: boolean }) {
  const rows: Array<[string, boolean, number]> = [
    ["Aimbot", true, 85],
    ["Through smoke", false, 36],
    ["Wall flashed", true, 72],
    ["FOV", true, 62],
    ["Smoothing", true, 48],
    ["Minimum damage", true, 80],
    ["Hitchance", true, 68]
  ];

  return (
    <div className={`traceless-cover ${large ? "traceless-cover-large" : ""}`}>
      <div className="traceless-tabs">
        {["Rage", "Anti-aim", "Legit", "ESP", "Visuals", "Misc"].map((tab) => (
          <span className={tab === "Legit" ? "tab-active" : ""} key={tab}>
            {tab}
          </span>
        ))}
      </div>
      <div className="traceless-grid">
        <div className="traceless-panel">
          <h4>Traceless</h4>
          {rows.slice(0, 5).map(([label, enabled, value]) => (
            <div className="cheat-row" key={String(label)}>
              <span>{label}</span>
              <b>{value}</b>
              <i className={enabled ? "enabled" : ""} />
            </div>
          ))}
          <div className="knife-hand" />
        </div>
        <div className="traceless-panel">
          <h4>Weapon config</h4>
          {rows.slice(2).map(([label, enabled, value]) => (
            <div className="cheat-slider" key={String(label)}>
              <div>
                <span>{label}</span>
                <b>{value}</b>
              </div>
              <em style={{ width: `${value}%` }} />
              <i className={enabled ? "enabled" : ""} />
            </div>
          ))}
        </div>
      </div>
      <div className="cover-brand">Traceless</div>
    </div>
  );
}
