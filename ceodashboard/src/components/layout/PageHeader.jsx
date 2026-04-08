import React from 'react'
import { CalendarClock } from 'lucide-react'
import './PageHeader.css'

const PageHeader = ({ title, subtitle, lastUpdated, actions = null }) => {
  return (
    <header className="exec-page-header">
      <div className="exec-page-header-copy">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="exec-page-header-right">
        <div className="exec-last-updated" aria-label="Last updated">
          <CalendarClock size={15} />
          <span>Last updated: {lastUpdated}</span>
        </div>
        {actions ? <div className="exec-page-actions">{actions}</div> : null}
      </div>
    </header>
  )
}

export default PageHeader
