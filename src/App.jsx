import { useState } from 'react';

/* ------------------------------------------------------------------ *
 * Business English — Status Meeting (Apple foldable scenario)
 * A 5-screen guided flow: choose → brief → reveal → teach → build.
 * Mechanic for the build step is TAP-TO-BUILD (subway-friendly):
 * tap pieces in order to place them; tap a placed piece to remove it.
 * ------------------------------------------------------------------ */

// ---- palette -------------------------------------------------------
const C = {
  bg: '#EEF1F6',
  card: '#FFFFFF',
  ink: '#1B2230',
  muted: '#6B7382',
  faint: '#9AA2B1',
  line: '#E3E7EE',
  accent: '#3B5BD9',
  accentInk: '#FFFFFF',
  green: '#2E9E5B',
  amber: '#DE9210',
  red: '#D6453D',
  lockBg: '#F4F6F9',
};

// ---- build-step content -------------------------------------------
const ALL_BLOCKS = [
  { id: 'c1', text: 'The current status is Yellow' },
  { id: 'c2', text: "It's still in progress" },
  { id: 'c3', text: "We're about 80% complete" },
  { id: 'd2', text: 'Everything is going smoothly' },
  { id: 'd4', text: 'The crease fails at 400,000 fold cycles' },
];
const CORRECT_ORDER = ['c1', 'c2', 'c3'];

const SCENARIO_EN =
  "You're on the team launching Apple's new foldable iPhone. The crease still has some durability issues, and today you're giving a status update to the team.";
const SCENARIO_ZH =
  '你在苹果新款折叠屏 iPhone 的发布团队里。折叠处的耐用性还有一些问题,今天你要向团队做一次进展汇报。';

// ---- small style helpers ------------------------------------------
const eyebrow = {
  fontSize: 13,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: C.faint,
  fontWeight: 600,
};
const h1 = {
  fontSize: 26,
  lineHeight: 1.15,
  fontWeight: 700,
  color: C.ink,
  margin: 0,
};
const body = { fontSize: 17, lineHeight: 1.55, color: C.ink, margin: 0 };

function StatusDot({ color, size = 12 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        flex: 'none',
      }}
    />
  );
}

export default function App() {
  const [screen, setScreen] = useState('start'); // start | brief | reveal | teach | build | summary
  const [showZh, setShowZh] = useState(false);
  const [overviewShown, setOverviewShown] = useState(false);
  const [activeCard, setActiveCard] = useState(null); // teach: null | "color" | "time"

  // build-step state
  const [shuffled] = useState(() => {
    const a = [...ALL_BLOCKS];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });
  const [placed, setPlaced] = useState([null, null, null]); // 3 fixed slots, each an id or null
  const [check, setCheck] = useState(null); // null | "wrong" | "correct"

  const pool = shuffled.filter((b) => !placed.includes(b.id));
  const textOf = (id) => ALL_BLOCKS.find((b) => b.id === id).text;

  const place = (id) => {
    if (check === 'correct') return;
    const slot = placed.findIndex((p) => p === null);
    if (slot === -1) return; // all three slots already filled
    const next = [...placed];
    next[slot] = id;
    setPlaced(next);
    setCheck(null);
  };
  const unplace = (index) => {
    if (check === 'correct') return;
    const next = [...placed];
    next[index] = null;
    setPlaced(next);
    setCheck(null);
  };
  const runCheck = () => {
    const ok = placed.every((id, i) => id === CORRECT_ORDER[i]);
    setCheck(ok ? 'correct' : 'wrong');
  };

  const steps = ['start', 'brief', 'reveal', 'teach', 'build', 'summary'];
  const stepIdx = steps.indexOf(screen);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        padding: '20px 14px 40px',
      }}
    >
      <StyleTag />
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* header: back button + progress dots (hidden on start) */}
        {screen !== 'start' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 16,
              minHeight: 26,
            }}
          >
            <button
              className="back"
              onClick={() => setScreen(steps[stepIdx - 1])}
            >
              ‹ Back
            </button>
            <div
              style={{
                display: 'flex',
                gap: 7,
                justifyContent: 'center',
                flex: 1,
              }}
            >
              {steps.slice(1).map((s, i) => (
                <span
                  key={s}
                  style={{
                    width: i + 1 === stepIdx ? 22 : 7,
                    height: 7,
                    borderRadius: 99,
                    background: i + 1 <= stepIdx ? C.accent : C.line,
                    transition: 'all .3s',
                  }}
                />
              ))}
            </div>
            {/* spacer to keep dots centered against the Back button */}
            <span style={{ width: 56, flex: 'none' }} />
          </div>
        )}

        {/* ---------------- SCREEN 1 — START ---------------- */}
        {screen === 'start' && (
          <div className="fade">
            <div style={eyebrow}>Business English · Meeting practice</div>
            <h1 style={{ ...h1, marginTop: 8, marginBottom: 6 }}>
              Choose a scenario
            </h1>
            <p style={{ ...body, color: C.muted, marginBottom: 22 }}>
              Short, real meeting moments. Start with the one that's open.
            </p>

            <Option
              live
              company="Apple"
              task="Status meeting"
              note="Report progress in a project sync."
              emoji="📱"
              onClick={() => setScreen('brief')}
            />
            <Option company="Tesla" task="Manage quality" emoji="🚗" />
            <Option company="Starbucks" task="Integrate payments" emoji="☕️" />
          </div>
        )}

        {/* ---------------- SCREEN 2 — BRIEF ---------------- */}
        {screen === 'brief' && (
          <Card>
            <div className="fade">
              <FoldablePhone />

              <div style={eyebrow}>The situation</div>
              <p style={{ ...body, marginTop: 8 }}>
                {SCENARIO_EN}{' '}
                <button className="zhchip" onClick={() => setShowZh(true)}>
                  中文
                </button>
              </p>

              <PrimaryButton
                style={{ marginTop: 22 }}
                onClick={() => setScreen('reveal')}
              >
                Enter the meeting
              </PrimaryButton>
            </div>
          </Card>
        )}

        {/* ---------------- SCREEN 3a — REVEAL ---------------- */}
        {screen === 'reveal' && (
          <Card>
            <div className="fade">
              <div style={eyebrow}>In the meeting</div>
              <p
                style={{
                  ...body,
                  fontWeight: 600,
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                "What's the status on the folding feature?"
              </p>
              <p style={{ ...body, color: C.muted, marginBottom: 20 }}>
                A strong answer has three parts. <br />
                Tap part 1 to reveal it.
              </p>

              <NumberedRow
                n={1}
                title="Overview"
                status={overviewShown ? 'done' : 'active'}
                onClick={() => setOverviewShown(true)}
                detail={
                  overviewShown ? (
                    <div className="reveal" style={revealCard}>
                      <p style={{ ...body, fontSize: 19 }}>
                        Overall the status is yellow, it's in progress and we're
                        about 80% complete.
                      </p>
                    </div>
                  ) : null
                }
              />
              <NumberedRow n={2} title="Current situation" status="locked" />
              <NumberedRow n={3} title="Status" status="locked" last />

              {overviewShown && (
                <PrimaryButton
                  style={{ marginTop: 14 }}
                  onClick={() => setScreen('teach')}
                >
                  Continue
                </PrimaryButton>
              )}
            </div>
          </Card>
        )}

        {/* ---------------- SCREEN 3b — TEACH ---------------- */}
        {screen === 'teach' && (
          <Card>
            <div className="fade">
              <div style={eyebrow}>Read your overview</div>
              <div style={{ ...pinned, marginTop: 8 }}>
                <p style={{ ...body, fontSize: 19 }}>
                  Overall the status is{' '}
                  <b
                    className={activeCard === 'color' ? 'hint on' : 'hint'}
                    onClick={() =>
                      setActiveCard(activeCard === 'color' ? null : 'color')
                    }
                  >
                    yellow
                  </b>
                  , it's in progress and we're about{' '}
                  <b
                    className={activeCard === 'time' ? 'hint on' : 'hint'}
                    onClick={() =>
                      setActiveCard(activeCard === 'time' ? null : 'time')
                    }
                  >
                    80% complete
                  </b>
                  .
                </p>
              </div>
              <p
                style={{
                  ...body,
                  color: C.muted,
                  fontSize: 15.5,
                  marginTop: 12,
                }}
              >
                Tap a highlighted word to see why it matters. Tap again to
                close.
              </p>

              {activeCard === 'color' && (
                <div
                  className="reveal"
                  style={{ ...revealCard, marginTop: 16 }}
                >
                  <h2 style={{ ...h1, fontSize: 19, marginBottom: 4 }}>
                    Status color
                  </h2>
                  <p
                    style={{
                      ...body,
                      color: C.muted,
                      fontSize: 15.5,
                      marginBottom: 8,
                    }}
                  >
                    Every update opens with one of three:
                  </p>
                  <ColorRow
                    color={C.green}
                    label="Green"
                    meaning="On track, no real concerns."
                  />
                  <ColorRow
                    color={C.amber}
                    label="Yellow"
                    meaning="In progress, with some risk to watch."
                  />
                  <ColorRow
                    color={C.red}
                    label="Red"
                    meaning="Blocked, or a serious problem."
                  />
                </div>
              )}

              {activeCard === 'time' && (
                <div
                  className="reveal"
                  style={{ ...revealCard, marginTop: 16 }}
                >
                  <h2 style={{ ...h1, fontSize: 19, marginBottom: 4 }}>
                    Sense of time or progress
                  </h2>
                  <p
                    style={{
                      ...body,
                      color: C.muted,
                      fontSize: 15.5,
                      marginBottom: 10,
                    }}
                  >
                    Show how far along you are — for example:
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      '80% complete',
                      '5 weeks in',
                      '2 weeks from the next milestone',
                    ].map((t) => (
                      <span key={t} style={exampleChip}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <PrimaryButton
                style={{ marginTop: 24 }}
                onClick={() => setScreen('build')}
              >
                Your turn
              </PrimaryButton>
            </div>
          </Card>
        )}

        {/* ---------------- SCREEN 4 — BUILD ---------------- */}
        {screen === 'build' && (
          <Card>
            <div className="fade">
              <div style={eyebrow}>Build the overview</div>
              <p
                style={{
                  ...body,
                  color: C.muted,
                  marginTop: 8,
                  marginBottom: 16,
                }}
              >
                Tap the right pieces, in order. Tap a placed piece to send it
                back.
              </p>

              {/* answer slots */}
              <div style={{ marginBottom: 18 }}>
                {[0, 1, 2].map((i) => {
                  const id = placed[i];
                  const correctNow = check === 'correct';
                  const wrongSlot = check === 'wrong' && id !== CORRECT_ORDER[i];
                  return (
                    <div
                      key={i}
                      onClick={() => id && unplace(i)}
                      className={wrongSlot ? 'shake' : ''}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        minHeight: 52,
                        padding: '10px 14px',
                        marginBottom: 10,
                        borderRadius: 13,
                        border: `1.5px ${id ? 'solid' : 'dashed'} ${
                          correctNow
                            ? C.green
                            : wrongSlot
                            ? C.red
                            : id
                            ? C.accent
                            : C.line
                        }`,
                        background: id
                          ? correctNow
                            ? '#EAF6EF'
                            : wrongSlot
                            ? '#FBEAEA'
                            : '#F3F5FD'
                          : C.lockBg,
                        cursor: id ? 'pointer' : 'default',
                        transition: 'all .2s',
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: id
                            ? correctNow
                              ? C.green
                              : wrongSlot
                              ? C.red
                              : C.accent
                            : C.line,
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{ fontSize: 16.5, color: id ? C.ink : C.faint }}
                      >
                        {id ? textOf(id) : 'Tap a piece below'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* pool */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {pool.map((b) => (
                  <button
                    key={b.id}
                    className="block"
                    onClick={() => place(b.id)}
                  >
                    {b.text}
                  </button>
                ))}
              </div>

              {/* feedback */}
              {check === 'wrong' && (
                <p
                  style={{
                    ...body,
                    color: C.red,
                    fontSize: 15.5,
                    marginTop: 16,
                  }}
                >
                  Not quite — the pieces marked in red need to change. Tap one
                  to send it back and retry.
                </p>
              )}

              {check === 'correct' && (
                <div className="reveal" style={{ marginTop: 18 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: C.green,
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    <CheckMark /> That's a clean overview.
                  </div>

                  <PrimaryButton
                    style={{ marginTop: 20 }}
                    onClick={() => setScreen('summary')}
                  >
                    Continue
                  </PrimaryButton>
                </div>
              )}

              {check !== 'correct' && (
                <PrimaryButton
                  style={{ marginTop: 20 }}
                  disabled={placed.includes(null)}
                  onClick={runCheck}
                >
                  Check answer
                </PrimaryButton>
              )}
            </div>
          </Card>
        )}
        {/* ---------------- SCREEN 5 — SUMMARY ---------------- */}
        {screen === 'summary' && (
          <Card>
            <div className="fade">
              <div style={eyebrow}>Your status update</div>
              <p
                style={{
                  ...body,
                  color: C.muted,
                  marginTop: 8,
                  marginBottom: 22,
                }}
              >
                Overview is done. Current situation is next.
              </p>

              <NumberedRow
                n={1}
                title="Overview"
                status="done"
                dim
                detail={
                  <p style={{ ...body, color: C.faint }}>
                    The current status is Yellow, it's still in progress, and
                    we're about 80% complete.
                  </p>
                }
              />
              <NumberedRow
                n={2}
                title="Current situation"
                status="current"
                detail={
                  <div
                    style={{
                      background: '#F4F6FE',
                      border: '1px solid #E0E8FB',
                      borderRadius: 12,
                      padding: '12px 14px',
                    }}
                  >
                    <p style={{ ...body, color: C.ink }}>
                      Our goal was to reach no issues after 500k fold cycles,
                      but right now we see issues at 400k folds.
                    </p>
                  </div>
                }
              />
              <NumberedRow n={3} title="Status" status="locked" last />

              <p
                style={{
                  ...body,
                  color: C.muted,
                  fontSize: 15.5,
                  marginTop: 8,
                }}
              >
                More of this meeting is coming soon.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* ---- Chinese translation modal ---- */}
      {showZh && (
        <div style={modalScrim} onClick={() => setShowZh(false)}>
          <div
            className="reveal"
            style={modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ ...eyebrow, marginBottom: 10 }}>中文翻译</div>
            <p style={{ ...body, fontSize: 18 }}>{SCENARIO_ZH}</p>
            <button className="zhclose" onClick={() => setShowZh(false)}>
              关闭 Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- reusable bits ---------------- */

function FoldablePhone() {
  return (
    <div
      style={{
        width: '100%',
        height: 190,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 4,
      }}
    >
      <svg
        viewBox="0 0 320 190"
        width="100%"
        height="190"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Foldable phone with a crease down the inner screen"
      >
        <defs>
          <linearGradient id="fpBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8EDF5" />
            <stop offset="1" stopColor="#D4DCEA" />
          </linearGradient>
          <linearGradient id="fpScreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FBFCFE" />
            <stop offset="1" stopColor="#E6ECF4" />
          </linearGradient>
          <linearGradient id="fpCrease" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7C8597" stopOpacity="0.45" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="fpGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#E8920E" stopOpacity="0.35" />
            <stop offset="1" stopColor="#E8920E" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="320" height="190" fill="url(#fpBg)" />
        {/* shadow under device */}
        <ellipse
          cx="160"
          cy="158"
          rx="92"
          ry="12"
          fill="#1B2230"
          opacity="0.12"
        />
        {/* device frame + screen */}
        <rect x="84" y="36" width="152" height="116" rx="16" fill="#161A24" />
        <rect
          x="91"
          y="43"
          width="138"
          height="102"
          rx="9"
          fill="url(#fpScreen)"
        />
        {/* issue glow centered on the crease */}
        <circle cx="160" cy="94" r="34" fill="url(#fpGlow)" />
        {/* the crease */}
        <rect x="154" y="43" width="12" height="102" fill="url(#fpCrease)" />
        <line
          x1="160"
          y1="43"
          x2="160"
          y2="145"
          stroke="#6B7382"
          strokeWidth="0.8"
          opacity="0.5"
        />
        {/* faint stress marks */}
        <line
          x1="150"
          y1="78"
          x2="170"
          y2="78"
          stroke="#A8AEBC"
          strokeWidth="0.7"
          opacity="0.6"
        />
        <line
          x1="150"
          y1="110"
          x2="170"
          y2="110"
          stroke="#A8AEBC"
          strokeWidth="0.7"
          opacity="0.6"
        />
        {/* hinge notches + camera */}
        <rect x="156" y="33" width="8" height="4" rx="2" fill="#0E1119" />
        <rect x="156" y="151" width="8" height="4" rx="2" fill="#0E1119" />
        <circle cx="160" cy="51" r="2.4" fill="#11151F" />
        {/* warning badge on the crease */}
        <g transform="translate(189,74)">
          <circle cx="0" cy="0" r="11" fill="#E8920E" />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#fff"
            fontFamily="-apple-system, Segoe UI, sans-serif"
          >
            !
          </text>
        </g>
      </svg>
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        background: C.card,
        borderRadius: 22,
        padding: 22,
        boxShadow:
          '0 1px 2px rgba(20,30,50,.04), 0 12px 30px rgba(20,30,50,.06)',
      }}
    >
      {children}
    </div>
  );
}

function Option({ company, task, note, emoji, live, onClick }) {
  return (
    <button
      className={live ? 'opt' : 'opt locked'}
      disabled={!live}
      onClick={onClick}
      style={{ marginBottom: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            fontSize: 30,
            lineHeight: 1,
            flex: 'none',
            filter: live ? 'none' : 'grayscale(1)',
            opacity: live ? 1 : 0.45,
          }}
        >
          {emoji}
        </span>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: live ? C.ink : C.faint,
            }}
          >
            {task}{' '}
            <span style={{ fontWeight: 500, color: C.muted }}>· {company}</span>
          </div>
          {note && live && (
            <div style={{ fontSize: 14.5, color: C.muted, marginTop: 2 }}>
              {note}
            </div>
          )}
        </div>
        {!live && <span style={soonPill}>Soon</span>}
      </div>
    </button>
  );
}

function NumberedRow({ n, title, status, onClick, detail, last, dim }) {
  // status: "active" | "locked" | "done" | "current"
  const dimDone = status === 'done' && dim;
  const badgeBg = dimDone
    ? '#D9EEE2'
    : status === 'done'
    ? C.green
    : status === 'locked'
    ? C.line
    : C.accent;
  const badgeFg = dimDone ? '#79B89A' : status === 'locked' ? C.faint : '#fff';
  const badgeText = status === 'done' ? '✓' : status === 'locked' ? '🔒' : n;
  const lineColor = dimDone ? '#D9EEE2' : status === 'done' ? C.green : C.line;
  const titleColor = dimDone ? C.muted : status === 'locked' ? C.faint : C.ink;
  const clickable = status === 'active';

  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {/* left rail: number badge + connector */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 'none',
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: badgeBg,
            color: badgeFg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: status === 'locked' ? 13 : 15,
            fontWeight: 700,
          }}
        >
          {badgeText}
        </span>
        {!last && (
          <span
            style={{
              width: 2,
              flex: 1,
              minHeight: 16,
              background: lineColor,
              marginTop: 4,
              marginBottom: 4,
            }}
          />
        )}
      </div>

      {/* content */}
      <div style={{ flex: 1, paddingBottom: last ? 0 : 18 }}>
        {clickable ? (
          <button className="numrow" onClick={onClick}>
            {title}
            <span
              style={{
                color: C.accent,
                fontWeight: 600,
                fontSize: 14,
                marginLeft: 8,
              }}
            >
              tap to reveal
            </span>
          </button>
        ) : (
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: titleColor,
              paddingTop: 4,
            }}
          >
            {title}
            {status === 'locked' && (
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: C.faint,
                  marginLeft: 8,
                }}
              >
                locked
              </span>
            )}
          </div>
        )}
        {detail && <div style={{ marginTop: 10 }}>{detail}</div>}
      </div>
    </div>
  );
}

function ColorRow({ color, label, meaning }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 0',
      }}
    >
      <StatusDot color={color} size={15} />
      <span style={{ fontSize: 17, fontWeight: 700, color: C.ink, width: 70 }}>
        {label}
      </span>
      <span style={{ fontSize: 15.5, color: C.muted, flex: 1 }}>{meaning}</span>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button
      className="primary"
      onClick={onClick}
      disabled={disabled}
      style={{ width: '100%', ...style }}
    >
      {children}
    </button>
  );
}

function CheckMark() {
  return (
    <span
      className="pop"
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: C.green,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        flex: 'none',
      }}
    >
      ✓
    </span>
  );
}

/* ---------------- inline style objects ---------------- */
const revealCard = {
  background: '#FAFBFD',
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: '14px 16px',
};
const pinned = {
  background: '#FFFBF3',
  border: `1px solid #F2E2C2`,
  borderRadius: 14,
  padding: '14px 16px',
};
const exampleChip = {
  fontSize: 15,
  color: C.ink,
  background: C.lockBg,
  border: `1px solid ${C.line}`,
  borderRadius: 10,
  padding: '7px 12px',
};
const soonPill = {
  fontSize: 12.5,
  fontWeight: 600,
  color: C.faint,
  background: C.lockBg,
  border: `1px solid ${C.line}`,
  borderRadius: 99,
  padding: '4px 10px',
};
const modalScrim = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(20,28,45,.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  zIndex: 50,
};
const modalBox = {
  background: C.card,
  borderRadius: 20,
  padding: 24,
  maxWidth: 380,
  width: '100%',
  boxShadow: '0 20px 50px rgba(20,30,50,.25)',
};

/* ---------------- injected CSS (states + motion) ---------------- */
function StyleTag() {
  return (
    <style>{`
      button { font-family: inherit; }
      .back {
        background: transparent; border: none; color: ${C.muted};
        font-size: 15.5px; font-weight: 600; cursor: pointer; padding: 4px 8px 4px 0;
        border-radius: 8px; transition: color .15s; flex: none;
      }
      .back:hover { color: ${C.accent}; }
      .opt {
        width: 100%; background: ${C.card}; border: 1.5px solid ${C.line};
        border-radius: 16px; padding: 16px; cursor: pointer; transition: all .18s;
        box-shadow: 0 1px 2px rgba(20,30,50,.04);
      }
      .opt:hover:not(:disabled) { border-color: ${C.accent}; transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(59,91,217,.12); }
      .opt.locked { background: ${C.lockBg}; cursor: not-allowed; box-shadow: none; }

      .primary {
        background: ${C.accent}; color: ${C.accentInk}; border: none; border-radius: 14px;
        padding: 15px 18px; font-size: 16.5px; font-weight: 600; cursor: pointer;
        transition: all .18s;
      }
      .primary:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
      .primary:disabled { background: ${C.line}; color: ${C.faint}; cursor: not-allowed; }

      .pill { display: none; }
      .hint {
        color: ${C.accent}; font-weight: 700; cursor: pointer;
        border-bottom: 2px dotted ${C.accent}; padding-bottom: 1px;
      }
      .hint:hover { background: #EEF2FD; }
      .hint.on { background: #DFE7FC; }
      .numrow {
        background: transparent; border: none; padding: 4px 0; text-align: left;
        font-size: 17px; font-weight: 700; color: ${C.ink}; cursor: pointer;
        transition: color .15s;
      }
      .numrow:hover { color: ${C.accent}; }

      .block {
        text-align: left; background: ${C.card}; border: 1.5px solid ${C.line};
        border-radius: 13px; padding: 14px 16px; font-size: 16.5px; color: ${C.ink};
        cursor: pointer; transition: all .15s;
      }
      .block:hover { border-color: ${C.accent}; background: #F7F9FE; }
      .block:active { transform: scale(.99); }

      .zhchip {
        display: inline-flex; align-items: center; vertical-align: middle;
        background: ${C.lockBg}; border: 1px solid ${C.line}; color: ${C.accent};
        border-radius: 8px; padding: 2px 8px; font-size: 13.5px; font-weight: 600;
        cursor: pointer; margin-left: 2px;
      }
      .zhchip:hover { border-color: ${C.accent}; }
      .zhclose {
        margin-top: 20px; width: 100%; background: ${C.lockBg}; color: ${C.ink};
        border: 1px solid ${C.line}; border-radius: 12px; padding: 12px; font-size: 15.5px;
        font-weight: 600; cursor: pointer;
      }
      .zhclose:hover { background: #ECEFF4; }

      .fade { animation: fade .35s ease both; }
      .reveal { animation: revealUp .3s ease both; }
      .pop { animation: pop .35s ease both; }
      .shake { animation: shake .4s ease both; }

      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes revealUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      @keyframes pop { 0% { transform: scale(.4); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }

      :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}