import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Target,
  Route,
  Dumbbell,
  LineChart,
  Sparkles,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import PublicLayout from '../../layouts/PublicLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import styles from './Landing.module.css';

const CHART = [
  { d: 'Mon', v: 42 },
  { d: 'Tue', v: 48 },
  { d: 'Wed', v: 51 },
  { d: 'Thu', v: 58 },
  { d: 'Fri', v: 61 },
  { d: 'Sat', v: 67 },
  { d: 'Sun', v: 72 },
];

const COMPANIES = [
  { name: 'Google', industry: 'Product', difficulty: 'Hard' },
  { name: 'Microsoft', industry: 'Product', difficulty: 'Hard' },
  { name: 'Amazon', industry: 'Product', difficulty: 'Hard' },
  { name: 'Adobe', industry: 'Product', difficulty: 'Medium' },
  { name: 'Deloitte', industry: 'Consulting', difficulty: 'Medium' },
  { name: 'Accenture', industry: 'Services', difficulty: 'Medium' },
  { name: 'TCS', industry: 'Services', difficulty: 'Easy' },
  { name: 'Infosys', industry: 'Services', difficulty: 'Easy' },
];

const MENTORS = [
  { name: 'Priya Nair', title: 'SDE II · Amazon', skill: 'DSA & System Design' },
  { name: 'Arjun Mehta', title: 'SWE · Google', skill: 'Graphs & DP' },
  { name: 'Neha Kulkarni', title: 'Analyst · Deloitte', skill: 'Aptitude & HR' },
];

const FAQS = [
  {
    q: 'Is OfferOS only for CSE students?',
    a: 'No. PlacementOS supports CSE, IT, ECE, EEE, Mechanical, Civil, and other B.Tech branches, with branch-specific core modules.',
  },
  {
    q: 'How is readiness calculated?',
    a: 'Readiness combines DSA, core subjects, aptitude, mock tests, consistency, and company-specific weights stored in the platform — not a single hardcoded formula.',
  },
  {
    q: 'Can I talk to mentors?',
    a: 'Yes. Browse approved mentors, request help, and track sessions. Mentor applications require admin approval.',
  },
  {
    q: 'Do I need to pay to start?',
    a: 'Students can start on the Scholar plan. Teams and colleges can move to Campus when they need analytics and mentor operations.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Badge tone="accent">OfferOS · PlacementOS</Badge>
          <h1>Know Exactly How Ready You Are For Your Next Placement.</h1>
          <p>
            OfferOS turns scattered prep into a closed loop: assess, plan, practice, test,
            and measure company-ready scores — so you stop guessing and start closing gaps.
          </p>
          <div className={styles.ctaRow}>
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Preparing <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('how')?.scrollIntoView()}>
              Explore Platform
            </Button>
          </div>
        </div>
        <motion.div
          className={styles.preview}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.previewTop}>
            <span>Placement readiness</span>
            <strong>72%</strong>
          </div>
          <ProgressBar value={72} />
          <div className={styles.previewGrid}>
            <div><small>Google</small><b>48%</b></div>
            <div><small>Amazon</small><b>67%</b></div>
            <div><small>Microsoft</small><b>52%</b></div>
            <div><small>TCS</small><b>84%</b></div>
          </div>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={CHART}>
                <XAxis dataKey="d" hide />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="currentColor" fill="currentColor" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      <section id="features" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>Placement readiness, not another tracker</h2>
          <p>See overall readiness, company fit, weak skills, daily progress, and mock performance in one place.</p>
        </header>
        <div className={styles.featureGrid}>
          {[
            ['Overall readiness', 'A single score from practice, tests, and consistency.'],
            ['Company readiness', 'Different weights for Google vs TCS vs consulting roles.'],
            ['Weak skills', 'Topics under 50% surface automatically.'],
            ['Daily progress', 'Tasks generated from gaps, not random problem lists.'],
            ['Mock performance', 'Accuracy, time, and topic-wise breakdown after every test.'],
          ].map(([title, body]) => (
            <article key={title} className={styles.featureCard}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>How it works</h2>
        </header>
        <ol className={styles.steps}>
          {[
            [Target, 'Assess', 'Baseline your DSA, core, aptitude, and interview comfort.'],
            [Route, 'Build your roadmap', 'Lock target companies and preferred preparation areas.'],
            [Dumbbell, 'Practice', 'Track topics with difficulty mix, confidence, and revision.'],
            [LineChart, 'Measure', 'Mocks and company scores show what actually moved.'],
            [Sparkles, 'Improve', 'Daily tasks and mentor help close the weakest gaps first.'],
          ].map(([Icon, title, body], i) => (
            <li key={title}>
              <Icon size={18} />
              <div>
                <span>Step {i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="companies" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>Prepare for the companies you actually want</h2>
        </header>
        <div className={styles.companyGrid}>
          {COMPANIES.map((c) => (
            <article key={c.name} className={styles.companyCard}>
              <div className={styles.logoMark}>{c.name[0]}</div>
              <div>
                <h3>{c.name}</h3>
                <p>{c.industry} · {c.difficulty}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="mentors" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>Learn from people who already cleared the bar</h2>
        </header>
        <div className={styles.mentorGrid}>
          {MENTORS.map((m) => (
            <article key={m.name} className={styles.mentorCard}>
              <h3>{m.name}</h3>
              <p>{m.title}</p>
              <span>{m.skill}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="analytics" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>Analytics that tell you what to do next</h2>
          <p>Weekly progress, topic accuracy, and company-readiness trends — not vanity dashboards.</p>
        </header>
        <div className={styles.previewWide}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART}>
              <XAxis dataKey="d" />
              <Tooltip />
              <Area type="monotone" dataKey="v" stroke="currentColor" fill="currentColor" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="testimonials" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>Students who stopped guessing</h2>
        </header>
        <div className={styles.quotes}>
          <blockquote>
            “I thought I was Google-ready. OfferOS showed Graphs at 42%. That one number changed my next three weeks.”
            <cite>CSE · 2025 batch</cite>
          </blockquote>
          <blockquote>
            “TCS aptitude mocks plus a mentor for HR rounds felt like a real campus cell, not a spreadsheet.”
            <cite>ECE · 2026 batch</cite>
          </blockquote>
        </div>
      </section>

      <section id="pricing" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>Pricing</h2>
        </header>
        <div className={styles.pricing}>
          <article>
            <h3>Scholar</h3>
            <p className={styles.price}>Free</p>
            <ul>
              <li><CheckCircle2 size={16} /> Readiness score</li>
              <li><CheckCircle2 size={16} /> Topic tracker</li>
              <li><CheckCircle2 size={16} /> Community access</li>
            </ul>
            <Button onClick={() => navigate('/register')}>Start preparing</Button>
          </article>
          <article className={styles.featured}>
            <h3>Campus</h3>
            <p className={styles.price}>₹499<span>/mo</span></p>
            <ul>
              <li><CheckCircle2 size={16} /> Company-weighted scores</li>
              <li><CheckCircle2 size={16} /> Full mock library</li>
              <li><CheckCircle2 size={16} /> Mentor requests</li>
            </ul>
            <Button onClick={() => navigate('/register')}>Get Campus</Button>
          </article>
        </div>
      </section>

      <section id="faq" className={styles.section}>
        <header className={styles.sectionHead}>
          <h2>FAQ</h2>
        </header>
        <div className={styles.faq}>
          {FAQS.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q} <ChevronDown size={16} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2>Stop preparing in the dark.</h2>
        <p>Create your OfferOS account and see a real readiness baseline.</p>
        <Link to="/register">
          <Button size="lg">Create account</Button>
        </Link>
      </section>
    </PublicLayout>
  );
}
