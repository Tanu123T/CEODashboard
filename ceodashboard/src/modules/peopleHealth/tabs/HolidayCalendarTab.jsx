import React, { useMemo, useRef, useState } from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';
import { holidayCalendarYear, holidayEntries } from '../data/holidays';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const toDateKey = (date) => date.toISOString().slice(0, 10);

const HolidayCalendarTab = () => {
  const detailsSectionRef = useRef(null);
  const holidayRowRefs = useRef(new Map());

  const holidays = useMemo(() => {
    return [...holidayEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  const holidaysByDate = useMemo(() => {
    const map = new Map();
    holidays.forEach((item) => {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    });
    return map;
  }, [holidays]);

  const [selectedHolidayId, setSelectedHolidayId] = useState(holidays[0]?.id || null);

  const selectedHoliday = useMemo(() => {
    return holidays.find((item) => item.id === selectedHolidayId) || null;
  }, [holidays, selectedHolidayId]);

  const now = new Date();
  const upcomingHoliday = useMemo(() => {
    const todayKey = toDateKey(now);
    return holidays.find((item) => item.date >= todayKey) || holidays[0] || null;
  }, [holidays, now]);

  const summary = useMemo(() => {
    const publicCount = holidays.filter((item) => item.type === 'Public Holiday').length;
    const regionalCount = holidays.filter((item) => item.type === 'Regional Holiday').length;
    const companyCount = holidays.filter((item) => item.type === 'Company Holiday').length;

    return {
      total: holidays.length,
      publicCount,
      regionalCount,
      companyCount,
    };
  }, [holidays]);

  const yearCalendar = useMemo(() => {
    return monthNames.map((monthName, monthIndex) => {
      const firstDay = new Date(holidayCalendarYear, monthIndex, 1).getDay();
      const daysInMonth = new Date(holidayCalendarYear, monthIndex + 1, 0).getDate();
      const cells = [];

      for (let i = 0; i < firstDay; i += 1) {
        cells.push(null);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const dateKey = `${holidayCalendarYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const entries = holidaysByDate.get(dateKey) || [];
        cells.push({ day, dateKey, entries });
      }

      while (cells.length % 7 !== 0) {
        cells.push(null);
      }

      return {
        monthName,
        monthIndex,
        cells,
      };
    });
  }, [holidaysByDate]);

  const focusPurposeDetails = (holidayId) => {
    setSelectedHolidayId(holidayId);

    window.requestAnimationFrame(() => {
      detailsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const selectedRow = holidayRowRefs.current.get(holidayId);
      selectedRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="ph-tab-layout">
      <section className="ph-full-card">
        <PeopleHealthPanelCard>
          <div className="ph-holiday-hero">
            <div>
              <p className="ph-holiday-eyebrow">Executive Planning View</p>
              <h3>Holiday Calendar {holidayCalendarYear}</h3>
              <p className="ph-holiday-hero-copy">
                Full-year holiday intelligence for workforce planning, release windows, and business continuity.
              </p>
            </div>

            <div className="ph-holiday-hero-badge" role="status" aria-live="polite">
              <Sparkles size={16} />
              <span>
                Next holiday: <strong>{upcomingHoliday ? upcomingHoliday.name : 'No upcoming holiday'}</strong>
              </span>
            </div>
          </div>

          <div className="ph-holiday-summary-grid">
            <article>
              <small>Total Holidays</small>
              <strong>{summary.total}</strong>
            </article>
            <article>
              <small>Public Holidays</small>
              <strong>{summary.publicCount}</strong>
            </article>
            <article>
              <small>Regional Holidays</small>
              <strong>{summary.regionalCount}</strong>
            </article>
            <article>
              <small>Company Holidays</small>
              <strong>{summary.companyCount}</strong>
            </article>
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-full-card">
        <PeopleHealthPanelCard
          title="Holiday Calendar"
          subtitle={`Full year planner for ${holidayCalendarYear} with holiday purpose visibility`}
        >
          <div className="ph-holiday-legend-row" aria-hidden="true">
            <span><i className="holiday" /> Holiday date</span>
            <span><i className="selected" /> Selected date</span>
            <span><CalendarRange size={14} /> Monthly grid</span>
          </div>

          <div className="ph-holiday-year-grid">
            {yearCalendar.map((month, index) => (
              <article key={month.monthName} className="ph-holiday-month-card" style={{ '--stagger': `${index * 35}ms` }}>
                <header>
                  <h4>{month.monthName}</h4>
                </header>

                <div className="ph-holiday-weekdays">
                  {weekdayLabels.map((label) => (
                    <span key={`${month.monthName}-${label}`}>{label}</span>
                  ))}
                </div>

                <div className="ph-holiday-days-grid">
                  {month.cells.map((cell, index) => {
                    if (!cell) {
                      return <span key={`${month.monthName}-empty-${index}`} className="ph-holiday-empty" aria-hidden="true" />;
                    }

                    const hasHoliday = cell.entries.length > 0;
                    const isSelected = hasHoliday && cell.entries.some((item) => item.id === selectedHolidayId);

                    return (
                      <button
                        key={cell.dateKey}
                        type="button"
                        className={`ph-holiday-day ${hasHoliday ? 'holiday' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (hasHoliday) {
                            focusPurposeDetails(cell.entries[0].id);
                          }
                        }}
                        title={hasHoliday ? `${cell.entries[0].name} - ${cell.entries[0].purpose}` : 'No holiday'}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-full-card" ref={detailsSectionRef}>
        <PeopleHealthPanelCard
          title="Holiday Purpose Details"
          subtitle="Holiday reason, type, and operational impact"
        >
          <div className="ph-holiday-details-table-wrap">
            <table className="ph-holiday-details-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday</th>
                  <th>Purpose</th>
                  <th>Type</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((item) => {
                  const isSelected = item.id === selectedHolidayId;
                  const dayLabel = new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={item.id}
                      ref={(node) => {
                        if (node) {
                          holidayRowRefs.current.set(item.id, node);
                        } else {
                          holidayRowRefs.current.delete(item.id);
                        }
                      }}
                      className={isSelected ? 'ph-holiday-selected-row' : ''}
                      onClick={() => setSelectedHolidayId(item.id)}
                    >
                      <td>{dayLabel}</td>
                      <td>{item.name}</td>
                      <td>{item.purpose}</td>
                      <td>{item.type}</td>
                      <td>{item.impact}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedHoliday ? (
            <div className="ph-holiday-focus-note">
              <strong>{selectedHoliday.name} • {new Date(selectedHoliday.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</strong>
              <span>{selectedHoliday.purpose}</span>
            </div>
          ) : null}
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default HolidayCalendarTab;
