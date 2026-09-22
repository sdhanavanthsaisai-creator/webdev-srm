import Script from "next/script";

export default function Home() {
  return (
    <>
      {/* import map: vendored three.js resolves without any network dependency */}
      <script
        type="importmap"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            imports: {
              three: "/vendor/three/three.module.js",
              "three/addons/": "/vendor/three/addons/",
            },
          }),
        }}
      />

      {/* intro */}
      <div id="intro">
        <div className="i-in">
          <svg className="i-mark" viewBox="0 0 32 32" fill="none">
            <rect x="1.5" y="1.5" width="29" height="29" rx="7" stroke="#FF6A3D" strokeWidth="1.6" />
            <path className="dr" d="M21.5 10.5a7.5 7.5 0 1 0 0 11" stroke="#F2EDE2" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21.5" cy="16" r="2.2" fill="#FF6A3D" />
          </svg>
          <span className="i-word">CLUBCRAFT</span>
        </div>
      </div>

      {/* fixed 3D + interaction stage */}
      <canvas id="scene"></canvas>
      <div id="stage" aria-hidden="true"></div>
      <div id="grain"></div>

      {/* cursor */}
      <div id="cursor"><div className="c-ring"><span className="c-lab"></span></div><div className="c-dot"></div></div>

      <header id="top">
        <a className="brand" href="#hero" aria-label="ClubCraft — back to top">
          <svg viewBox="0 0 32 32" fill="none"><rect x="1.5" y="1.5" width="29" height="29" rx="7" stroke="#FF6A3D" strokeWidth="2" /><path d="M21.5 10.5a7.5 7.5 0 1 0 0 11" stroke="#F2EDE2" strokeWidth="2.4" strokeLinecap="round" /><circle cx="21.5" cy="16" r="2.3" fill="#FF6A3D" /></svg>
          <span>ClubCraft</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#floor">FLOOR</a><a href="#method">METHOD</a><a href="#blueprint">BLUEPRINT</a>
        </nav>
        <div className="nav-r" id="navAuth">
          {/* filled by landing-ui.js: guest → auth buttons; user → who pill */}
          <button className="btn-p sm" id="navSignIn">Sign in / Join</button>
          <button className="seats" id="seatsChip">SEATS <b id="seatsN">00</b>/<span id="seatsTotal">06</span></button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="hero" className="clear">
          <div className="wrap h-top">
            <p className="kick hf" style={{ ["--d" as string]: ".05s" }}>CLUBCRAFT · A WORKSHOP PLATFORM FOR THE BUILD CLUB</p>
            <h1>
              <span className="hl"><span style={{ ["--d" as string]: ".14s" }}>Craft the room.</span></span>
              <span className="hl"><span style={{ ["--d" as string]: ".24s" }}>Claim your <em>seat.</em></span></span>
            </h1>
          </div>
          <div className="wrap h-bot">
            <div className="h-left">
              <p className="sub hf" style={{ ["--d" as string]: ".34s" }}>Live sessions on the ring — one tap to claim a seat, and a registration list that never lies. Real accounts, real seats, real time.</p>
              <div className="cta-row hf" style={{ ["--d" as string]: ".44s" }}>
                <a className="btn-p" href="#floor">Explore the floor
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                </a>
                <a className="btn-g" href="#blueprint">Read the blueprint
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7 7 7 7-7" /></svg>
                </a>
              </div>
            </div>
            <p className="hint hf" style={{ ["--d" as string]: ".54s" }}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m18 8 4 4-4 4M6 8l-4 4 4 4M2 12h20" /></svg>
              DRAG THE RING · TAP A PLATE
            </p>
          </div>
        </section>

        {/* FLOOR */}
        <section id="floor" className="solid">
          <div className="wrap">
            <div className="sec-head rv">
              <div>
                <p className="kick">THE FLOOR — SOONEST FIRST</p>
                <h2>Six sessions.<br /><em>One ring.</em></h2>
              </div>
              <div className="fl-ctl">
                <div className="seg" role="group" aria-label="Filter sessions">
                  <button className="on" data-f="all" aria-pressed="true">ALL</button>
                  <button data-f="mine" aria-pressed="false">MY SEATS <span id="segCount">0</span></button>
                </div>
                <p className="fl-note mono" id="srcNote">LOADING…</p>
              </div>
            </div>
            <div id="rows" className="rv" style={{ ["--d" as string]: ".1s" }}></div>
            <div id="mineEmpty" hidden>
              <svg className="me-arr" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 56C16 36 28 22 52 10" /><path d="M52 10 39 9m13 1-4 13" /></svg>
              <p className="me-t">Nothing claimed yet.</p>
              <p className="me-s mono">PICK A SESSION — ONE TAP AND IT&apos;S YOURS.</p>
            </div>
          </div>
        </section>

        {/* INTERLUDE */}
        <section id="interlude" className="clear">
          <blockquote id="quote">A seat isn&apos;t a ticket — it&apos;s a promise the room keeps.</blockquote>
          <div className="q-cap mono"><span>ONE TAP — THE MONEY MOMENT</span><span>OPTIMISTIC BY DEFAULT</span><span>409-AWARE</span></div>
        </section>

        {/* METHOD */}
        <section id="method" className="solid">
          <div className="wrap">
            <div className="sec-head rv">
              <div>
                <p className="kick">THE METHOD</p>
                <h2>Built in <em>demo order.</em></h2>
              </div>
              <p className="lead">Three moves, sequenced exactly the way you&apos;ll watch them — nothing on this page that isn&apos;t wired.</p>
            </div>
            <div className="steps">
              <article className="step rv">
                <div className="s-no" aria-hidden="true">01</div>
                <div className="s-body">
                  <div className="s-tags"><span className="tag">AUTH</span><span className="tag">SUPABASE</span></div>
                  <h3>Sign in like you mean it</h3>
                  <p>Email, password, one button. Validation fires before the request, errors land inline, and the demo credentials are pre-filled so nobody types live. Sessions persist — a refresh never locks you out.</p>
                </div>
              </article>
              <article className="step rv">
                <div className="s-no" aria-hidden="true">02</div>
                <div className="s-body">
                  <div className="s-tags"><span className="tag">EXPRESS API</span></div>
                  <h3>Read the floor</h3>
                  <p>Sessions, soonest first, rendered in your local time. The list comes straight from the Express API reading Supabase Postgres — and registration state is correct on first paint, no flash of the wrong button, ever.</p>
                </div>
              </article>
              <article className="step rv">
                <div className="s-no" aria-hidden="true">03</div>
                <div className="s-body">
                  <div className="s-tags"><span className="tag">REGISTER</span><span className="tag">MY SEATS</span></div>
                  <h3>Claim the seat</h3>
                  <p>The money moment. One tap flips the button to Registered before the round-trip finishes; a 409 just means you were already in. Your seats survive the refresh because they live in Postgres — never local memory.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* BLUEPRINT */}
        <section id="blueprint" className="solid">
          <div className="wrap bp-grid">
            <div className="bp-left rv">
              <p className="kick">THE BLUEPRINT</p>
              <h2>Non-<em>negotiables.</em></h2>
              <p className="lead">The floor the demo stands on. Every number here is checked before anything ships.</p>
              <div className="nums">
                <div className="num"><b>375px</b><span>the smallest stage — zero horizontal scroll, primary action always reachable.</span></div>
                <div className="num"><b>4.5:1</b><span>the contrast floor — every label, every state, every focus ring.</span></div>
                <div className="num"><b>150ms</b><span>the motion floor — ease-out, and never blocking a click on an animation.</span></div>
                <div className="num"><b>0</b><span>lorem, TODOs and dead buttons on the demo path. Real copy only.</span></div>
              </div>
            </div>
            <div className="bp-right">
              <div className="codewrap rv">
                <div className="code-head"><span>API CONTRACT</span><span>EXPRESS + SUPABASE POSTGRES</span></div>
                <pre className="code"><span className="m">GET</span>  /api/workshops
  <span className="a">→ 200</span> { `[{ id, title, description, speaker,
           location, starts_at }]` }      <span className="c">// ISO timestamptz</span>

<span className="m">POST</span> /api/register  { `{ workshop_id }` }
  <span className="a">→ 200</span> { `{ registered: true }` }
  <span className="a">→ 409</span> { `{ error: "already registered" }` }
  <span className="a">→ 401</span> { `{ error: "unauthenticated" }` }
  <span className="a">→ *</span>   { `{ error, code? }` }             <span className="c">// one shape, always</span></pre>
              </div>
              <div className="mx-wrap rv" style={{ ["--d" as string]: ".1s" }}>
                <div className="code-head"><span>STATE MATRIX</span><span>ALL FOUR · EVERY VIEW</span></div>
                <table className="matrix">
                  <thead><tr><th>STATE</th><th>SPECIMEN — AS SHIPPED</th><th>WHAT IT MEANS</th></tr></thead>
                  <tbody>
                    <tr>
                      <td className="st">LOADING</td>
                      <td><div className="sk" aria-hidden="true"><i></i><i style={{ width: "76%" }}></i><i style={{ width: "54%" }}></i></div></td>
                      <td className="nt">Skeleton plates before data — never a blank page.</td>
                    </tr>
                    <tr>
                      <td className="st">EMPTY</td>
                      <td><div className="spec-empty">No upcoming workshops yet</div></td>
                      <td className="nt">Intentional space, not a dead end.</td>
                    </tr>
                    <tr>
                      <td className="st">ERROR</td>
                      <td><div className="spec-err"><span>Couldn&apos;t load the floor</span><button className="spec-retry" id="specRetry"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /></svg>Retry</button></div></td>
                      <td className="nt">Inline message plus Retry. The button reverts; the toast apologizes.</td>
                    </tr>
                    <tr>
                      <td className="st">SUCCESS</td>
                      <td><div className="spec-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Registered</div></td>
                      <td className="nt">The flip — optimistic, disabled after, 409-aware.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ENTER */}
      <footer id="enter" className="clear">
        <div className="wrap e-in">
          <p className="kick hf" style={{ ["--d" as string]: ".05s" }}>FINAL CALL</p>
          <h2 className="hf" style={{ ["--d" as string]: ".12s" }}>Ready when<br /><em>you are.</em></h2>
          <button className="btn-p big hf" style={{ ["--d" as string]: ".2s", maxWidth: 340 }} id="enterCta">Claim your first seat
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </button>
        </div>
        <div className="e-meta">
          <div className="wrap">
            <div className="em-cols">
              <div><h4>STACK</h4><p>Next.js · React · Express API · Supabase Postgres + Auth — PERN, minus the rented rooms.</p></div>
              <div><h4>THEME</h4><p>Deep-slate cyber glass — ember ring, violet auth glow, ambient embers. Drag it, tap it.</p></div>
              <div><h4>DISCIPLINE</h4><p>Not in this build: admin tools, search, email confirmations, QR codes, realtime. A refresh is fine.</p></div>
            </div>
            <div className="em-bar">
              <span>© 2026 CLUBCRAFT — BUILT IN THE OPEN</span>
              <span>FRAUNCES · SPACE GROTESK · JETBRAINS MONO</span>
              <a href="#hero">BACK TO TOP
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5m-7 7 7-7 7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* detail overlay */}
      <div id="scrim"></div>
      <aside id="detail" role="dialog" aria-modal="true" aria-label="Workshop details">
        <div className="d-top">
          <span className="mono" id="dNum"></span>
          <button className="d-close" id="dClose" aria-label="Close details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="d-body">
          <h3 id="dTitle"></h3>
          <ul className="d-meta">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg><div><b>SPEAKER</b><span id="dSpeaker"></span></div></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg><div><b>WHEN — YOUR LOCAL TIME</b><span id="dWhen"></span></div></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><div><b>LENGTH</b><span id="dLen"></span></div></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg><div><b>WHERE</b><span id="dWhere"></span></div></li>
          </ul>
          <p id="dDesc"></p>
        </div>
        <div className="d-foot">
          <div id="regZone"></div>
          <p className="d-note mono">ONE TAP · NO FORMS · 409-PROOF</p>
        </div>
      </aside>

      {/* auth modal */}
      <div id="authScrim"></div>
      <div id="auth" role="dialog" aria-modal="true" aria-label="Sign in or join the club">
        <div className="a-kick">
          <span>CLUBCRAFT · ACCESS</span>
          <button id="authClose" aria-label="Close">✕</button>
        </div>
        <h3 id="authTitle">Welcome to the room.</h3>
        <p className="a-sub" id="authSub">Sign in to claim seats — your list follows you to any device.</p>
        <div className="a-tabs" role="group" aria-label="Auth mode">
          <button id="tabIn" className="on">SIGN IN</button>
          <button id="tabUp">JOIN THE CLUB</button>
        </div>
        <div className="a-field" id="nameField" hidden>
          <label htmlFor="authName">FULL NAME</label>
          <input id="authName" type="text" placeholder="Ada Lovelace" autoComplete="name" />
        </div>
        <div className="a-field">
          <label htmlFor="authEmail">EMAIL</label>
          <input id="authEmail" type="email" placeholder="you@college.edu" autoComplete="email" />
        </div>
        <div className="a-field">
          <label htmlFor="authPass">PASSWORD</label>
          <input id="authPass" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>
        <p className="a-err" id="authErr"></p>
        <button className="a-submit" id="authSubmit">Sign in</button>
        <div className="demo-pill" id="demoPill" hidden>
          <span>DEMO · { "{...}" } demo@clubcraft.test</span>
          <button id="demoFill">USE DEMO LOGIN</button>
        </div>
      </div>

      <div id="toasts" aria-live="polite"></div>

      {/* behavior layers — classic scripts, WebGL module loads after data resolves */}
      <Script src="/landing-ui.js" strategy="afterInteractive" />
      <Script src="/landing-3d.js" type="module" strategy="afterInteractive" />
    </>
  );
}
