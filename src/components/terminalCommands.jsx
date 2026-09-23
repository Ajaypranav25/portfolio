import { profile } from '../data/profile'
import { additionalProjects, projects } from '../data/projects'

// Windows the `open` command can launch (project names are accepted too)
export const OPEN_TARGETS = ['projects', 'resume', 'contact', 'github', 'linkedin', 'instagram']

// Files that `cat` understands, mapped to the command that prints them
const FILES = { 'education.txt': 'education', 'contact.txt': 'email', 'resume.pdf': 'resume' }

export function findProject(query) {
  const q = query?.toLowerCase().replace(/[\s_-]+/g, '')
  if (!q) return null
  const n = Number(q)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
  const norm = (s) => s.toLowerCase().replace(/[\s_-]+/g, '')
  return (
    projects.find((p) => p.id === q || norm(p.label) === q) ??
    projects.find((p) => p.id.startsWith(q) || norm(p.label).startsWith(q)) ??
    null
  )
}

/* ---------- output building blocks ---------- */

const Dim = ({ children }) => <span className="text-white/40">{children}</span>
const Accent = ({ children }) => <span className="text-emerald-300">{children}</span>
const Cmd = ({ children }) => <span className="text-sky-300">{children}</span>

function Link({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-sky-300 underline decoration-white/20 underline-offset-2 hover:decoration-sky-300">
      {children}
    </a>
  )
}

function Rows({ rows }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <span className="whitespace-nowrap">{k}</span>
          <span className="text-white/55">{v}</span>
        </div>
      ))}
    </div>
  )
}

function Tags({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span key={s} className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/85">
          {s}
        </span>
      ))}
    </div>
  )
}

function ProjectDetail({ p }) {
  return (
    <div className="space-y-2">
      <p>
        <span className="font-semibold text-white">{p.label}</span> <Dim>— {p.tagline}</Dim>
      </p>
      <p className="text-white/65">{p.summary}</p>
      <Tags items={p.tech} />
      <ul>
        {p.highlights.map((h) => (
          <li key={h}>
            <Dim>→ </Dim>
            {h}
          </li>
        ))}
      </ul>
      <p>
        <Dim>pipeline: </Dim>
        {p.architecture.map((s) => s.name).join(' → ')}
      </p>
      <p>
        {p.links.map((l) => (
          <span key={l.href} className="mr-4">
            <Link href={l.href}>{l.label.toLowerCase()} ↗</Link>
          </span>
        ))}
        <Dim>
          run <Cmd>open {p.id}</Cmd> for the full window
        </Dim>
      </p>
    </div>
  )
}

/* ---------- commands ---------- */
// Each command: { desc, usage?, run(ctx) → output JSX | null }. ctx = { args, open, openProject, exit, history, copy }

export const COMMANDS = {
  help: {
    desc: 'list available commands',
    run: () => (
      <div className="space-y-2">
        <p>Available commands:</p>
        <Rows
          rows={Object.entries(COMMANDS)
            .filter(([, c]) => !c.hidden)
            .map(([name, c]) => [<Cmd key={name}>{c.usage ?? name}</Cmd>, c.desc])}
        />
        <p>
          <Dim>Tip: Tab autocompletes, ↑/↓ browse history, Ctrl+L clears.</Dim>
        </p>
      </div>
    ),
  },
  whoami: {
    desc: 'who is this?',
    run: () => (
      <p>
        <span className="text-white">{profile.name}</span> <Dim>— CSE undergrad at {profile.education.school}, building full-stack apps with applied AI.</Dim>
      </p>
    ),
  },
  about: {
    desc: 'a short bio',
    run: () => (
      <p className="max-w-prose text-white/75">
        I'm {profile.name.split(' ')[0]}, a {profile.education.degree} student at {profile.education.school} ({profile.education.years}). I
        work across the stack, with a focus on {profile.focus.map((f) => f.toLowerCase()).join(', ')}. Run <Cmd>projects</Cmd> to see what
        I've built.
      </p>
    ),
  },
  education: {
    desc: 'where I study',
    run: () => (
      <p>
        {profile.education.degree}
        <br />
        <Dim>
          {profile.education.school} · {profile.education.years}
        </Dim>
      </p>
    ),
  },
  skills: { desc: 'core tech stack', run: () => <Tags items={profile.skills} /> },
  focus: {
    desc: 'what I work on',
    run: () => (
      <ul>
        {profile.focus.map((f) => (
          <li key={f}>
            <Dim>→ </Dim>
            {f}
          </li>
        ))}
      </ul>
    ),
  },
  projects: {
    desc: 'list all projects',
    run: () => (
      <div className="space-y-2">
        <Rows
          rows={projects.map((p, i) => [
            <span key={p.id}>
              <Dim>{i + 1}.</Dim> <Accent>{p.id}</Accent>
            </span>,
            p.tagline,
          ])}
        />
        <p>
          <Dim>also: {additionalProjects.map((p) => p.label).join(', ')}</Dim>
        </p>
        <p>
          <Dim>
            run <Cmd>project &lt;name|number&gt;</Cmd> for details
          </Dim>
        </p>
      </div>
    ),
  },
  project: {
    usage: 'project <name>',
    desc: 'details on one project',
    run: ({ args }) => {
      if (!args.length) return <p>usage: project &lt;name|number&gt; <Dim>— try </Dim><Cmd>project algotrader</Cmd></p>
      const p = findProject(args.join(' '))
      return p ? <ProjectDetail p={p} /> : <p>project not found: {args.join(' ')}. <Dim>Run </Dim><Cmd>projects</Cmd></p>
    },
  },
  cat: {
    hidden: true,
    desc: 'read a file or project',
    run: (ctx) => {
      const file = FILES[ctx.args[0]?.replace(/^\.\//, '')]
      return file ? COMMANDS[file].run({ ...ctx, args: [] }) : COMMANDS.project.run(ctx)
    },
  },
  ls: {
    desc: 'list files',
    run: ({ args }) =>
      ['focus', 'socials'].includes(args[0]?.replace(/^\.\/|\/$/g, '')) ? (
        COMMANDS[args[0].replace(/^\.\/|\/$/g, '')].run({ args: [] })
      ) : args[0]?.replace(/^\.\/|\/$/g, '') === 'projects' ? (
        COMMANDS.projects.run({ args: [] })
      ) : (
        <p className="space-x-4">
          <span className="text-sky-300">projects/</span>
          <span>resume.pdf</span>
          <span>contact.txt</span>
          <span className="text-sky-300">socials/</span>
        </p>
      ),
  },
  open: {
    usage: 'open <app>',
    desc: `launch a window: ${OPEN_TARGETS.join(', ')} or a project`,
    run: ({ args, open, openProject }) => {
      const target = args.join(' ').toLowerCase()
      if (!target) return <p>usage: open &lt;{OPEN_TARGETS.join('|')}|project&gt;</p>
      if (OPEN_TARGETS.includes(target)) {
        open(target)
        return <p><Dim>opening {target}…</Dim></p>
      }
      const p = findProject(target)
      if (p) {
        openProject(p.id)
        return <p><Dim>opening {p.label}…</Dim></p>
      }
      return <p>open: no such app: {target}</p>
    },
  },
  resume: {
    desc: 'open my resume (add --download to save it)',
    run: ({ args, open }) => {
      if (args.includes('--download') || args.includes('-d')) {
        const a = document.createElement('a')
        a.href = profile.resumeUrl
        a.download = profile.resumeFileName
        a.click()
        return <p><Dim>downloading {profile.resumeFileName}…</Dim></p>
      }
      open('resume')
      return <p><Dim>opening resume… (</Dim><Cmd>resume --download</Cmd><Dim> saves the PDF)</Dim></p>
    },
  },
  email: {
    desc: 'show my email and copy it',
    run: ({ copy }) => {
      copy(profile.email)
      return (
        <p>
          <Link href={`mailto:${profile.email}`}>{profile.email}</Link> <Dim>(copied to clipboard)</Dim>
        </p>
      )
    },
  },
  contact: { hidden: true, desc: 'alias of email', run: (ctx) => COMMANDS.email.run(ctx) },
  socials: {
    desc: 'where to find me',
    run: () => (
      <Rows
        rows={[
          ['github', <Link key="gh" href={profile.links.github}>{profile.links.github.replace('https://', '')}</Link>],
          ['linkedin', <Link key="li" href={profile.links.linkedin}>{profile.links.linkedin.replace('https://', '')}</Link>],
          ['instagram', <Link key="ig" href={profile.links.instagram}>{profile.links.instagram.replace('https://', '')}</Link>],
        ]}
      />
    ),
  },
  github: { hidden: true, desc: 'open github', run: (ctx) => COMMANDS.open.run({ ...ctx, args: ['github'] }) },
  linkedin: { hidden: true, desc: 'open linkedin', run: (ctx) => COMMANDS.open.run({ ...ctx, args: ['linkedin'] }) },
  instagram: { hidden: true, desc: 'open instagram', run: (ctx) => COMMANDS.open.run({ ...ctx, args: ['instagram'] }) },
  neofetch: {
    desc: 'system info, portfolio edition',
    run: () => (
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <pre className="text-emerald-300/90 leading-tight">{`   ▄▀▀▀▄
  █ ▄ ▄ █
  █  ▀  █
   ▀▄▄▄▀
  ▄█████▄
 ███████████`}</pre>
        <Rows
          rows={[
            [<Accent key="u">ajay@vit</Accent>, ''],
            ['os', 'PortfolioOS 1.0'],
            ['host', profile.education.school],
            ['uptime', `${new Date().getFullYear() - 2025} yr into ${profile.education.years}`],
            ['shell', 'zsh (in a browser)'],
            ['stack', profile.skills.slice(0, 5).join(', ')],
            ['projects', `${projects.length} featured, ${additionalProjects.length} more`],
          ]}
        />
      </div>
    ),
  },
  history: {
    desc: 'previous commands',
    run: ({ history }) =>
      history.length ? (
        <ol>
          {history.map((h, i) => (
            <li key={i}>
              <Dim>{String(i + 1).padStart(3)} </Dim>
              {h}
            </li>
          ))}
        </ol>
      ) : (
        <p><Dim>no history yet</Dim></p>
      ),
  },
  date: { desc: 'current date and time', run: () => <p>{new Date().toString()}</p> },
  echo: {
    hidden: true,
    desc: 'print text',
    run: ({ args }) => (args[0]?.toUpperCase() === '$SKILLS' ? COMMANDS.skills.run() : <p>{args.join(' ')}</p>),
  },
  sudo: {
    hidden: true,
    desc: 'nope',
    run: () => <p>ajay is not in the sudoers file. This incident will be reported. <Dim>(try </Dim><Cmd>help</Cmd><Dim>)</Dim></p>,
  },
  clear: { desc: 'clear the screen', run: () => null },
  exit: { desc: 'close the terminal', run: ({ exit }) => (exit(), null) },
}
