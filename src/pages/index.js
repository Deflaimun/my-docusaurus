import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const TRACKS = [
  {
    icon: '⚙️',
    title: 'Software Engineering',
    items: [
      'Tech lead for 15-person team (real-time Kafka platform)',
      'Event-driven microservices: WhatsApp, iFood, in-store channels',
      'AI-assisted full-stack development (Python, PostgreSQL, Redpanda)',
    ],
  },
  {
    icon: '🏗️',
    title: 'Documentation Engineering',
    items: [
      '2 full platform migrations (Gatsby → Docusaurus → Antora)',
      '2,000+ config properties auto-generated from C++ source',
      '70% faster deployments via build pipeline optimisation',
    ],
  },
  {
    icon: '✍️',
    title: 'Technical Writing',
    items: [
      'End-to-end Disaster Recovery docs (95% solo-authored)',
      'GBAC security documentation from zero',
      'Cross-functional coordination across engineering, PM, and CS',
    ],
  },
];

const IMPACT = [
  { number: '50K+', label: 'monthly doc readers' },
  { number: '2,000+', label: 'config properties auto-generated' },
  { number: '80%', label: 'reduction in manual doc overhead' },
  { number: '70%', label: 'faster deployments (Kurrent)' },
  { number: '12+', label: 'versioned product releases managed' },
];

const WORK = [
  {
    title: 'Redpanda Shadowing: Disaster Recovery',
    desc: '95% solo-authored end-to-end DR guide. Participated in engineering design reviews, co-wrote PRDs and RFCs, then wrote the full user-facing technical guide across cloud and self-managed deployments.',
    tags: [{ label: 'Docs Writing', cls: 'chipWriting' }],
    link: '/docs/case-studies/shadowing',
  },
  {
    title: 'Docs Platform Automation',
    desc: 'Built Python + tree-sitter tooling to parse a C++ codebase and auto-generate reference docs for 2,000+ configuration properties, eliminating ~80% of manual update overhead.',
    tags: [{ label: 'Docs Engineering', cls: 'chipDocs' }],
    link: null,
  },
  {
    title: 'Kurrent: Astro/Starlight Migration',
    desc: 'Diagnosed critical VuePress memory constraints; architected migration to Astro/Starlight. Achieved 70% build speedup and fixed 100+ broken links. Migration was in progress at time of company-wide layoff.',
    tags: [{ label: 'Docs Engineering', cls: 'chipDocs' }],
    link: null,
  },
  {
    title: 'Order Processing Platform',
    desc: 'Led a 15-person team building a real-time event-driven order ingestion system at one of Brazil\'s largest fuel retailers, aggregating WhatsApp, iFood, in-store, and web channels via Confluent Kafka.',
    tags: [{ label: 'Software Engineering', cls: 'chipSoftware' }],
    link: null,
  },
  {
    title: 'BID Soccer Notification System',
    desc: 'End-to-end event-driven system built entirely with AI-assisted development: polls Brazilian soccer transfer registry (with CAPTCHA), deduplicates records, streams via Redpanda, sends real-time Telegram alerts.',
    tags: [{ label: 'Software Engineering', cls: 'chipSoftware' }],
    link: null,
  },
  {
    title: 'GBAC Security Documentation',
    desc: 'Authored Group-Based Access Control documentation from scratch, covering concepts, configuration procedures for cloud and self-managed clusters, and reusable UI procedure partials.',
    tags: [{ label: 'Docs Writing', cls: 'chipWriting' }],
    link: '/docs/case-studies/gbac',
  },
];

const TEASERS = [
  {
    label: 'Writing Sample: Disaster Recovery',
    title: 'Shadowing Overview',
    excerpt:
      'Shadowing is a disaster recovery feature that continuously replicates a source cluster\'s data and state to a shadow cluster, so that during an unplanned outage, you can quickly restore your operations on that shadow cluster.',
    link: '/docs/writing-samples/shadowing/overview',
  },
  {
    label: 'Writing Sample: Security',
    title: 'Group-Based Access Control',
    excerpt:
      'Group-Based Access Control (GBAC) lets you assign roles to groups of users instead of individual accounts. When you assign a role to a group, all members of that group inherit the permissions defined by that role.',
    link: '/docs/writing-samples/gbac/overview',
  },
];

const STACK = [
  {
    heading: 'Docs & Content',
    items: ['AsciiDoc', 'Markdown / MDX', 'Antora', 'Docusaurus', 'Astro / Starlight', 'VuePress', 'Swagger / OpenAPI'],
  },
  {
    heading: 'Platforms & Tooling',
    items: ['GitHub Actions', 'Netlify', 'Cloudflare', 'Algolia', 'Kapa.ai', 'Claude Code MCP', 'PostHog', 'Datadog'],
  },
  {
    heading: 'Software',
    items: ['Python', 'Java', 'Kafka / Redpanda', 'FastAPI', 'AWS', 'Docker', 'PostgreSQL', 'Node.js'],
  },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.heroName}>Paulo Borges</h1>
        <p className={styles.heroTagline}>
          I turn complex systems into clear, usable documentation,
          <br />
          and I can build the systems too.
        </p>
        <p className={styles.heroSub}>
          Documentation Engineer · Software Developer · Rio de Janeiro, Brazil
        </p>
        <div className={styles.heroCtas}>
          <Link className="button button--primary button--lg" to="/docs/writing-samples/shadowing/overview">
            View Writing Samples
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/case-studies/shadowing">
            Read Case Studies
          </Link>
          <Link className="button button--outline button--secondary button--lg" href="https://github.com/Deflaimun">
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function Tracks() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What I Do</h2>
        <p className={styles.sectionSub}>8+ years working at the intersection of software engineering and technical communication</p>
        <div className={styles.tracksGrid}>
          {TRACKS.map((track) => (
            <div key={track.title} className={styles.trackCard}>
              <div className={styles.trackIcon}>{track.icon}</div>
              <div className={styles.trackTitle}>{track.title}</div>
              <ul className={styles.trackList}>
                {track.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Impact at a Glance</h2>
        <p className={styles.sectionSub}>Highlights from 8+ years across engineering and documentation roles</p>
        <div className={styles.impactGrid}>
          {IMPACT.map((item) => (
            <div key={item.label} className={styles.impactItem}>
              <span className={styles.impactNumber}>{item.number}</span>
              <div className={styles.impactLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Selected Work</h2>
        <p className={styles.sectionSub}>Across documentation engineering, technical writing, and software development</p>
        <div className={styles.workGrid}>
          {WORK.map((item) => (
            <div key={item.title} className={styles.workCard}>
              <p className={styles.workCardTitle}>{item.title}</p>
              <p className={styles.workCardDesc}>{item.desc}</p>
              <div className={styles.workCardFooter}>
                <div className={styles.tagChips}>
                  {item.tags.map((tag) => (
                    <span key={tag.label} className={`${styles.chip} ${styles[tag.cls]}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                {item.link && (
                  <Link to={item.link} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    Read more →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingTeasers() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Writing Samples</h2>
        <p className={styles.sectionSub}>Original documentation authored for Redpanda, reproduced here as portfolio samples</p>
        <div className={styles.teaserGrid}>
          {TEASERS.map((t) => (
            <div key={t.title} className={styles.teaserCard}>
              <div className={styles.teaserLabel}>{t.label}</div>
              <div className={styles.teaserTitle}>{t.title}</div>
              <blockquote className={styles.teaserExcerpt}>{t.excerpt}</blockquote>
              <Link to={t.link}>Read full documentation →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Tech Stack</h2>
        <p className={styles.sectionSub}>Tools and technologies I work with regularly</p>
        <div className={styles.stackGrid}>
          {STACK.map((col) => (
            <div key={col.heading} className={styles.stackColumn}>
              <h3>{col.heading}</h3>
              <div className={styles.stackPills}>
                {col.items.map((item) => (
                  <span key={item} className={styles.stackPill}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Connect() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Let's Connect</h2>
        <p className={styles.sectionSub}>Open to documentation engineering and software development opportunities</p>
        <div className={styles.connectRow}>
          <Link className="button button--primary button--lg" href="https://www.linkedin.com/in/paulohtb/">
            LinkedIn
          </Link>
          <Link className="button button--secondary button--lg" href="https://github.com/Deflaimun">
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Documentation Engineer and Software Developer, Paulo Borges">
      <Hero />
      <main>
        <Tracks />
        <Impact />
        <SelectedWork />
        <WritingTeasers />
        <Stack />
        <Connect />
      </main>
    </Layout>
  );
}
