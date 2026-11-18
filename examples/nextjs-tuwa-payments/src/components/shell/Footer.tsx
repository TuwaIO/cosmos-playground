import { CopyCommand } from '@/components/shell/CopyCommand';

const COLUMNS = [
  {
    title: 'Built with',
    links: [
      ['Quasar Payments', 'https://docs.tuwa.io/quasar'],
      ['Nova UI Kit', 'https://stories.tuwa.io'],
      ['Satellite Connect', 'https://satellite.docs.tuwa.io'],
      ['Pulsar', 'https://pulsar.docs.tuwa.io'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Documentation', 'https://docs.tuwa.io'],
      ['GitHub', 'https://github.com/TuwaIO/cosmos-playground'],
      ['tuwa.io', 'https://tuwa.io'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Terms', 'https://tuwa.io/terms'],
      ['Privacy', 'https://tuwa.io/privacy'],
      ['Cookies', 'https://tuwa.io/cookie'],
    ],
  },
] as const;

/** The footer: how to start a shop of your own from this template, and where its parts are documented. */
export function Footer({ networks }: { networks: string[] }) {
  return (
    <footer className="shop-page">
      <div className="shop-col">
        <div className="shop-bar">
          <span>
            {'// '}
            <b>Use this template</b>
          </span>
          <span>Cosmos Playground · MIT-0</span>
        </div>
        <div
          className="shop-in"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '32px 64px',
            paddingTop: 36,
            paddingBottom: 36,
          }}
        >
          <div className="shop-stack" style={{ flex: '1 1 320px', maxWidth: 480, gap: 14 }}>
            <CopyCommand command="npx @tuwaio/create-cosmos-playground" />
            <p className="shop-small">
              Cosmos Store is a Cosmos Playground template by TUWA. It is a demo shop: nothing here is sold for real
              money.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px 56px' }}>
            {COLUMNS.map(({ title, links }) => (
              <div key={title} className="shop-stack" style={{ gap: 10 }}>
                <p className="shop-label">{title}</p>
                {links.map(([label, href]) => (
                  <a key={href} className="shop-small shop-link" href={href} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="shop-foot-bottom">
          <p className="shop-label">Cosmos Store · TUWA</p>
          {networks.length > 0 && <p className="shop-label">{networks.join(' · ')}</p>}
        </div>
      </div>
    </footer>
  );
}
