import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine 
} from 'recharts'
import { ExternalLink, FileText, ImageIcon, Map, Menu, X } from 'lucide-react'
import './App.css'

type LightboxItem = {
  title: string
  caption: string
  image?: string
}

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'history', label: 'Water History' },
  { id: 'perchlorate', label: 'Perchlorate' },
  { id: 'drought', label: 'D3 Drought' },
  { id: 'findings', label: 'Findings' },
]

const perchlorateData = [
  { year: '2018', concentration: 0.8, lakeNormanHS: 137 },
  { year: '2019', concentration: 0.9, lakeNormanHS: 0 },
  { year: '2020', concentration: 1.0, lakeNormanHS: 0 },
  { year: '2021', concentration: 1.1, lakeNormanHS: 0 },
  { year: '2022', concentration: 1.0, lakeNormanHS: 0 },
  { year: '2023', concentration: 1.2, lakeNormanHS: 0 },
  { year: '2024', concentration: 1.3, lakeNormanHS: 0 },
  { year: '2025', concentration: 1.1, lakeNormanHS: 0 },
]

const droughtFlowData = [
  // 2025: Transition from normal to drought onset
  { month: 'Aug 2025', normal: 41, current: 48, period: 'Drought onset' }, // Slightly above normal
  { month: 'Sep 2025', normal: 39, current: 35, period: 'Drought onset' }, // Onset of dry fall
  { month: 'Oct 2025', normal: 47, current: 30, period: 'Drought onset' }, // Below normal
  { month: 'Nov 2025', normal: 52, current: 28, period: 'Drought onset' }, // Significant drop begins
  { month: 'Dec 2025', normal: 65, current: 32, period: 'Drought onset' }, // Half of normal flow
  
  // 2026: The Extreme (D3) Drought phase
  { month: 'Jan 2026', normal: 86, current: 42, period: 'D3 drought phase' },
  { month: 'Feb 2026', normal: 78, current: 35, period: 'D3 drought phase' },
  { month: 'Mar 2026', normal: 72, current: 28, period: 'D3 drought phase' },
  { month: 'Apr 2026', normal: 64, current: 18, period: 'D3 declared' }, // Stage D3 Declared
  { month: 'May 2026', normal: 58, current: 14, period: 'Current record low' }, // Current record low
]
const radarData = [
  { subject: 'Perchlorate Info', risk: 82, communication: 36 },
  { subject: 'Drought Severity', risk: 91, communication: 58 },
  { subject: 'Cancer Risk', risk: 66, communication: 24 },
  { subject: 'Private Wells', risk: 74, communication: 29 },
  { subject: 'Future Projections', risk: 80, communication: 22 },
]

const timelineItems = [
  ['1890s', 'Municipal Water Takes Shape', 'After an 1891 downtown fire exposed the limits of private wells, Statesville issued bonds in 1895 to build its first municipal water and light plant, drawing from deep wells and springs near the downtown core.'],
  ['1950s', 'South Yadkin Becomes the Backbone', 'The postwar textile and furniture boom pushed Statesville\'s population to nearly 17,000. Large-scale withdrawal from the South Yadkin River was firmly established this decade. A 1954 drought exposed the risk of low river flows and prompted the city to plan more robust intake infrastructure. (Source: USGS Water Supply Paper 1415, 1957)'],
  ['1963', 'Lake Norman Forms — And Statesville Adapts', 'Cowans Ford Dam was completed September 30, 1963. As Lake Norman filled, Statesville shifted its long-term policy to Lookout Shoals Lake on the Catawba system as its primary raw water source, upgrading its treatment plant to handle reservoir-based supply.'],
  ['1990s', 'Treatment Rules Tighten', 'The 1996 Safe Drinking Water Act Amendments required stricter microbial and lead/copper testing. Statesville expanded treatment capacity to 15 MGD. A severe drought from 1998–2002 led the city to formalize its Water Shortage Response Plan.'],
  ['2020s', 'Drought Meets Contamination', 'As of May 2026, Statesville is under Stage D3 Extreme Drought with mandatory outdoor water bans and fines up to $600. A $23 million waterline replacement project is underway to replace 1940s-era cast iron pipes. Perchlorate and PFAS levels are actively monitored.'],
]

const sourceTags = [
  'Statesville Record & Landmark',
  'City of Statesville Annual DWQ Reports',
  'NC DEQ',
  'USGS',
  'EPA',
  'U.S. Drought Monitor',
]

export default function App() {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <>
      <ProgressBar />
      <Sidebar />
      <main className="site-shell">
        <HeroSection onOpenLightbox={setLightbox} />
        <HistorySection onOpenLightbox={setLightbox} />
        <PerchlorateSection onOpenLightbox={setLightbox} />
        <DroughtSection onOpenLightbox={setLightbox} />
        <FindingsSection />
      </main>
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </>
  )
}

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 24 })
  return <motion.div className="progress-bar" style={{ scaleX }} />
}

function Sidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="mobile-menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <a className="sidebar-title" href="#home" onClick={() => setOpen(false)}>
          What's in the Water
        </a>
        <nav>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={() => setOpen(false)}>
              {section.label}
            </a>
          ))}
        </nav>
        <div className="sidebar-credit">
          <span>Anthony Corbin</span>
          <span>American Studies II</span>
          <span>May 2026</span>
        </div>
      </aside>
    </>
  )
}

function PageSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      className="page-section"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7 }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </motion.section>
  )
}

function HeroSection({ onOpenLightbox }: { onOpenLightbox: (item: LightboxItem) => void }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-media">
        <ImageSlot
          title="Lake Norman on a Clear Day"
          caption="Lake Norman on a clear day."
          ratio="wide"
          image="/images/lakenorma.jpg"
          onOpen={onOpenLightbox}
        />
        <ImageSlot title="City Drought Restriction Notice" caption="Iredell County is currently in a stage D3 extreme drought." image="/images/20260512_nc_trd.png" ratio="wide" tone="danger" onOpen={onOpenLightbox} />
      </div>
      <motion.div className="hero-copy" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}>
        <p className="eyebrow">Iredell County, North Carolina</p>
        <h1>What's in the Water?</h1>
        <p className="dek">
          Iredell County sits beside Lake Norman, yet Statesville is rationing water under Stage D3 Extreme Drought
          conditions, and perchlorate has been detected in water connected to Lake Norman High School. Drought lowers
          river volume and can concentrate contaminants already present.
        </p>
        <div className="stat-grid">
          <StatCard value="D3" label="Extreme Drought" subtext="Active classification" />
          <StatCard value="Detected" label="Perchlorate" subtext="Lake Norman H.S." />
          <StatCard value="205K" label="Residents" subtext="Iredell County" />
          <StatCard value="NC-10" label="District" subtext="Rep. Pat Harrigan" />
        </div>
      </motion.div>
    </section>
  )
}

function StatCard({ value, label, subtext }: { value: string; label: string; subtext: string }) {
  return (
    <motion.div className="stat-card" whileHover={{ y: -4 }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <span>{value}</span>
      <strong>{label}</strong>
      <small>{subtext}</small>
    </motion.div>
  )
}

function HistorySection({ onOpenLightbox }: { onOpenLightbox: (item: LightboxItem) => void }) {
  return (
    <PageSection id="history" eyebrow="Page 2" title="The History of Statesville's Water Supply">
      <div className="editorial-grid">
        <div className="prose">
          <p>Statesville's water story begins with rail growth, factories, neighborhoods, and public health demands. By the mid-20th century, the city had shifted from smaller local sources to large-scale regional extraction, a transition documented in federal hydrology records.</p>

<p>USGS Water Supply Paper 1415 (1957) compiled streamflow and municipal water data across a 25-year period from 1929 to 1953, finding that 28 of 64 municipalities in the basin relied on surface water, and that roughly 85 percent of all public water supply in the region came from surface sources like the South Yadkin River.</p>

<p>Around 1950, intensive federal monitoring of the South Yadkin River began in earnest, marking the era when Statesville's infrastructure planning formalized its dependence on the river for municipal supply and flood control. The average annual streamflow from about 82 percent of the basin during that period was approximately 6,200 million gallons per day this far exceedes the estimated withdrawal use of 600 mgd. Confirming the South Yadkin as a reliable, long-term supply.</p>

<p>The South Yadkin River is still a major part today, while Lake Norman, to the south, shapes the regional water table and private well concerns across Iredell County.</p>
        </div>
        <ImageSlot title="Watershed Map" caption="Map showing Statesville, South Yadkin River, and Lake Norman." image="/images/SY1.webp" ratio="map" icon="map" onOpen={onOpenLightbox} />
      </div>
      <Timeline />
      <div className="two-up">
        <ImageSlot title="Water Treatment Plant" caption="Plant photo." image="/images/statesville-water-treatment-plant-e1714061543517.webp" onOpen={onOpenLightbox} />
        <ImageSlot title="South Yadkin River" caption="River photo." image="/images/Picture1.webp" onOpen={onOpenLightbox} />
      </div>
      <Sources labels={sourceTags.slice(0, 4)} />
    </PageSection>
  )
}

function Timeline() {
  const [active, setActive] = useState(0)
  const [year, title, body] = timelineItems[active]
  return (
    <div className="timeline">
      <div className="timeline-track">
        {timelineItems.map(([itemYear], index) => (
          <button key={itemYear} className={index === active ? 'active' : ''} onClick={() => setActive(index)} type="button">
            <span>{itemYear}</span>
          </button>
        ))}
      </div>
      <div className="timeline-panel">
        <p>{year}</p>
        <h3>{title}</h3>
        <span>{body}</span>
      </div>
    </div>
  )
}

function PerchlorateSection({ onOpenLightbox }: { onOpenLightbox: (item: LightboxItem) => void }) {
  return (
    <PageSection id="perchlorate" eyebrow="Page 3" title="Perchlorate and the Thyroid Cancer Question">
      <AlertBadge label="Active Environmental Concern - Iredell County, NC" />
      <div className="data-row">
        <DataCard label="Contaminant" value="Perchlorate" subtext="Thyroid-disrupting chemical" />
        <DataCard label="Concentration" value="[137] ug/L" subtext=" NC DEQ result" />
        <DataCard label="First Detection" value="[Dec. 2018]" subtext="Record date" />
      </div>
      <PerchlorateChart />
      <ArticleColumns
  items={[
    ['What is perchlorate?', 'Perchlorate is a chemical compound used in rocket fuel, explosives, fireworks, and some fertilizers. Once it enters a water supply, it competes with iodine in the body and disrupts thyroid hormone production. The thyroid regulates metabolism, brain development, and heart rate. Making this especially dangerous for pregnant women, infants, and children.'],
    ['Where did it come from?', 'NC DEQ and the EPA point to three likely pathways in the Iredell region: legacy industrial or military-adjacent manufacturing sites in the Yadkin basin, agricultural runoff from Chilean nitrate fertilizers that historically contained perchlorate as an impurity, and in rare cases natural formation in Piedmont bedrock geology. No single source has been officially confirmed for the Lake Norman High School detection.'],
    ['The thyroid cancer cluster question', 'Iredell County has drawn attention for elevated thyroid cancer rates, but causation has not been established. To make that case responsibly requires three things: confirmed exposure levels over time, health outcome data from county and state cancer registries, and a verified timeline linking the two. That full picture has not been publicly compiled. Which is itself part of the story.'],
  ]}
      />
      <PullQuote>A contaminant does not have to be visible in a glass of water to become part of a community's history.</PullQuote>
      <div className="three-up">
        <ImageSlot title="EPA Report" caption="EPA report of treatment options are costly." image = "/images/P100ZD10.png" icon="file" onOpen={onOpenLightbox} />
        <ImageSlot title="Local News Coverage" caption="local reporting screenshot. Link: https://www.wsoctv.com/news/local/iredell-statesville-school-district-water-air-test-results-released/890249294/" image = "/images/News.png" icon="file" onOpen={onOpenLightbox} />
        <ImageSlot title="Water Quality Report" caption="2023 detected levels for disinfection byproducts (TTHM and HAA5). While the city remains within legal EPA limits, the varying concentrations across different monitoring sites (B01-B04) highlight the ongoing challenge of balancing effective disinfection with minimizing long-term health risks associated with chemical byproducts.." image = "/images/T.png" icon="file" onOpen={onOpenLightbox} />
      </div>
      <Sources labels={['NC DEQ', 'EPA', 'City of Statesville Annual DWQ Reports', 'Local news archives']} />
    </PageSection>
  )
}

function DroughtSection({ onOpenLightbox }: { onOpenLightbox: (item: LightboxItem) => void }) {
  return (
    <PageSection id="drought" eyebrow="Page 4" title="Stage D3: The Drought Making It Worse">
      <AlertBadge label="Stage D3 Extreme Drought - Active - Statesville, NC" />
      <div className="data-row">
        <DataCard label="Classification" value="D3" subtext="Extreme drought" />
        <DataCard label="River Flow" value="[75]%" subtext="Reduction from normal" />
        <DataCard label="Restrictions" value="[May 4, 2026]" subtext="$200 for the first offense, $400 for the second, and $600 for the third." />
      </div>
      <DroughtChart />
      <ArticleColumns
        items={[
          ['What D3 means', 'D3 drought signals serious hydrologic stress, low streamflow, and possible public water restrictions.'],
          ['How drought concentrates contaminants', 'When less water moves through a system, the same pollutant load can become a larger share of total volume.'],
          ['What Statesville is doing', 'Statesville has responded through conservation orders, treatment planning, public notices, and emergency water supply coordination.'],
        ]}
      />
      <DroughtMapGrid onOpenLightbox={onOpenLightbox} />
      <div className="two-up">
        <ImageSlot title="South Yadkin - Normal Flow" caption="Before photo at typical river levels." image = '/images/Yadkin-River-2.webp' onOpen={onOpenLightbox} />
        <ImageSlot
          title="South Yadkin - D3 Drought"
          caption="Thumbnail from the linked YouTube video. Link: https://www.youtube.com/watch?v=2x9qmzEhg30"
          image="https://img.youtube.com/vi/2x9qmzEhg30/hqdefault.jpg"
          tone="danger"
          onOpen={onOpenLightbox}
        />
      </div>
      <Sources labels={['USGS', 'U.S. Drought Monitor', 'City of Statesville', 'NC DEQ']} />
    </PageSection>
  )
}

function FindingsSection() {
  return (
    <PageSection id="findings" eyebrow="Page 5" title="Findings">
      <p className="summary">Statesville’s current water landscape has a large 'Communication Gap.' While Drought Severity has reached a record D3 status with high public visibility, long-term health are still less know. Perchlorate detections (peaking at 15.4 mg/L in 2018) and Private Well contamination (with 79% of Iredell wells exceeding hexavalent chromium health goals) represent high objective risks that suffer from low public reporting. The future depends on how well we can get rid of this transparency gap to protect vulnerable populations as our climte forces us into water scarcity. </p>
      <CommunicationRadar />
      <div className="findings-list">
        <FindingItem number="01" title="The water system is regional." body="Lake Norman, the South Yadkin River, private wells, and city treatment decisions overlap." />
        <FindingItem number="02" title="Perchlorate information is fragmented." body="Residents need clearer timelines, maps, and health-context summaries." />
        <FindingItem number="03" title="Drought changes contamination risk." body="Lower river volume can make existing contamination a more urgent exposure question." />
        <FindingItem number="04" title="Private well users need direct communication." body="Households outside city water may not receive the same notices." />
      </div>
      <PullQuote>The central finding is not panic. It is that public water history should be public enough for residents to follow.</PullQuote>
      <div className="questions">
        <h3>Community questions</h3>
        <ul>
          <li>Where exactly has perchlorate been detected, and how often has each location been retested?</li>
          <li>How are private well users notified when nearby public systems detect contaminants?</li>
          <li>What happens to treatment strategy when drought lowers South Yadkin River flow?</li>
        </ul>
      </div>
      <Sources labels={sourceTags} />
      <div className="credit-block">
        <strong>About this investigation</strong>
        <p>Created by Anthony Corbin for American Studies II Local History Project, May 2026.</p>
      </div>
    </PageSection>
  )
}

function AlertBadge({ label }: { label: string }) {
  return (
    <div className="alert-badge">
      <span />
      {label}
    </div>
  )
}

function DataCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <motion.div className="data-card" whileHover={{ y: -4 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{subtext}</span>
    </motion.div>
  )
}

function PerchlorateChart() {
  return (
    <ChartFrame label="Perchlorate concentration over time — Iredell County / Lake Norman H.S. Source: NC DEQ / EPA UCMR 5.">
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={perchlorateData} margin={{ top: 20, right: 26, left: 0, bottom: 12 }}>
          <CartesianGrid stroke="rgba(155,175,200,.14)" vertical={false} />
          <XAxis dataKey="year" stroke="#9bafc8" tickLine={false} axisLine={false} />
          <YAxis stroke="#9bafc8" tickLine={false} axisLine={false} unit=" ug/L" domain={[0, 16]} />
          <Tooltip contentStyle={tooltipStyle} />
          <ReferenceLine y={15} stroke="#e8c13a" strokeDasharray="6 3" label={{ value: 'EPA Advisory: 15 ug/L', fill: '#e8c13a', fontSize: 11 }} />
          <ReferenceLine y={2} stroke="#4ecdc4" strokeDasharray="6 3" label={{ value: 'CA Limit: 2 ug/L', fill: '#4ecdc4', fontSize: 11 }} />
          <Line type="monotone" dataKey="concentration" name="Iredell Region" stroke="#e85d3a" strokeWidth={3} dot={{ fill: '#08111f', stroke: '#e85d3a', strokeWidth: 2, r: 5 }} />
          <Line type="monotone" dataKey="lakeNormanHS" name="Lake Norman H.S." stroke="#4ecdc4" strokeWidth={3} dot={{ fill: '#08111f', stroke: '#4ecdc4', strokeWidth: 2, r: 5 }} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

function DroughtChart() {
  return (
    <ChartFrame label="South Yadkin River flow: normal monthly conditions compared with drought-period flow.">
      <div className="chart-legend">
        <span><i className="legend-normal" /> Normal monthly flow</span>
        <span><i className="legend-current" /> Current / drought flow</span>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={droughtFlowData} margin={{ top: 20, right: 24, left: 0, bottom: 12 }}>
          <CartesianGrid stroke="rgba(155,175,200,.14)" vertical={false} />
          <XAxis dataKey="month" stroke="#9bafc8" tickLine={false} axisLine={false} />
          <YAxis stroke="#9bafc8" tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              `${value}%`,
              name === 'normal' ? 'Normal monthly flow' : 'Current / drought flow',
            ]}
          />
          <Bar dataKey="normal" radius={[6, 6, 0, 0]} fill="#1fb87a" />
          <Bar dataKey="current" radius={[6, 6, 0, 0]}>
            {droughtFlowData.map((entry) => (
              <Cell key={entry.month} fill={entry.current > 75 ? '#1fb87a' : entry.current >= 50 ? '#d4a843' : '#e85d3a'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

function CommunicationRadar() {
  return (
    <ChartFrame label="Documented risk level compared with public communication level.">
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={radarData} outerRadius="72%">
          <PolarGrid stroke="rgba(155,175,200,.22)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9bafc8', fontSize: 12 }} />
          <Radar name="Documented Risk Level" dataKey="risk" stroke="#e85d3a" fill="#e85d3a" fillOpacity={0.35} />
          <Radar name="Public Communication Level" dataKey="communication" stroke="#1fb87a" fill="#1fb87a" fillOpacity={0.28} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

function ChartFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.div className="chart-frame source-frame" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <p className="chart-label">{label}</p>
      {children}
    </motion.div>
  )
}

const tooltipStyle = {
  background: '#0f2040',
  border: '1px solid rgba(31,184,122,.35)',
  color: '#e8e0d0',
}

function ImageSlot({
  title,
  caption,
  onOpen,
  ratio = 'photo',
  tone = 'default',
  icon = 'image',
  image,
}: {
  title: string
  caption: string
  onOpen: (item: LightboxItem) => void
  ratio?: 'photo' | 'wide' | 'map'
  tone?: 'default' | 'danger'
  icon?: 'image' | 'map' | 'file'
  image?: string
}) {
  const Icon = icon === 'map' ? Map : icon === 'file' ? FileText : ImageIcon
  return (
    <button className={`image-slot ${ratio} ${tone} ${image ? 'has-image' : ''}`} onClick={() => onOpen({ title, caption, image })} type="button">
      {image ? (
        <img src={image} alt={title} />
      ) : (
        <>
          <span className="media-label">IMAGE SLOT</span>
          <Icon size={34} />
          <strong>{title}</strong>
          <small>Photo or document needed</small>
          <em>{caption}</em>
        </>
      )}
    </button>
  )
}

function Lightbox({ item, onClose }: { item: LightboxItem | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="lightbox-panel" initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(event) => event.stopPropagation()}>
            <button onClick={onClose} aria-label="Close lightbox" type="button">
              <X size={22} />
            </button>
            {item.image ? (
              <img className="lightbox-image" src={item.image} alt={item.title} />
            ) : (
              <div className="lightbox-preview">
                <ImageIcon size={52} />
                <span>Image or document preview</span>
              </div>
            )}
            <h3>{item.title}</h3>
            <p>{item.caption}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ArticleColumns({ items }: { items: [string, string][] }) {
  return (
    <div className="article-columns">
      {items.map(([title, body]) => (
        <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3>{title}</h3>
          <p>{body}</p>
        </motion.article>
      ))}
    </div>
  )
}

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="pull-quote">
      <span>"</span>
      {children}
    </blockquote>
  )
}

function DroughtMapGrid({ onOpenLightbox }: { onOpenLightbox: (item: LightboxItem) => void }) {
  return (
    <div className="map-grid">
      {[
        ['Earlier Normal', 'D0', 'Normal to abnormally dry comparison map.', '/images/USDM_comparison_Jun2024.png'],
        ['Worsening Period', 'D1-D2', 'Mid-period drought monitor map.', '/images/D2.jpeg'],
        ['Current Condition', 'D3', 'Current extreme drought map for Iredell County.', '/images/20260512_nc_trd.png'],
      ].map(([title, stage, caption, src]) => (
        <div key={title} className="map-card">
          <span className={`stage-badge ${stage === 'D3' ? 'stage-d3' : ''}`}>{stage}</span>
          <ImageSlot title={title} caption={caption} image={src} icon="map" ratio="map" onOpen={onOpenLightbox} />
        </div>
      ))}
    </div>
  )
}

function FindingItem({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <motion.article className="finding-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </motion.article>
  )
}

function Sources({ labels }: { labels: string[] }) {
  return (
    <div className="sources">
      <p>Sources</p>
      <div>
        {labels.map((label) => (
          <span className="source-tag" key={label}>
            <ExternalLink size={13} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
