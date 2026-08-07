import { useState } from 'react'
import { SignOutButton } from '@clerk/clerk-react'
import ArticleView from './ArticleView.tsx'
import Overview from './Overview.tsx'

const WINDOWS = [7, 30, 90, 365]

export default function Dashboard() {
  const [days, setDays] = useState(30)
  const [articleId, setArticleId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="serif text-2xl text-ink">Article stats</h1>
          {articleId && (
            <button
              onClick={() => setArticleId(null)}
              className="mono text-[11px] text-ink-3 underline-offset-4 hover:text-ink hover:underline">
              ← all articles
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {WINDOWS.map(window => (
            <button
              key={window}
              onClick={() => setDays(window)}
              className={`mono rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                days === window ? 'bg-ink/10 text-ink' : 'text-ink-3 hover:bg-ink/5 hover:text-ink'
              }`}>
              {window}d
            </button>
          ))}
          <SignOutButton>
            <button className="mono ml-2 rounded-md px-2.5 py-1 text-[11px] text-ink-3 hover:bg-ink/5 hover:text-ink">
              sign out
            </button>
          </SignOutButton>
        </div>
      </header>

      {articleId ? <ArticleView articleId={articleId} days={days} /> : <Overview days={days} onSelect={setArticleId} />}
    </div>
  )
}
