import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  attendanceSummaryCards,
  headcountTrendsByYear,
  members,
  topPerformers,
} from '../teamData';

const OverviewTab = ({ onNavigateTab }) => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState(null);

  const yearOptions = useMemo(
    () => Object.keys(headcountTrendsByYear).sort((a, b) => Number(b) - Number(a)),
    []
  );

  const currentTrend = headcountTrendsByYear[selectedYear] || headcountTrendsByYear[yearOptions[0]];
  const trendValues = currentTrend?.values || [];
  const trendLabels = currentTrend?.labels || [];

  const overallTrendDomain = useMemo(() => {
    const allValues = Object.values(headcountTrendsByYear).flatMap((entry) => entry.values || []);
    if (!allValues.length) {
      return { min: 0, max: 10 };
    }
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = Math.max(4, Math.ceil((maxValue - minValue) * 0.15));
    return {
      min: minValue - padding,
      max: maxValue + padding,
    };
  }, []);

  const yDomain = useMemo(() => {
    if (!trendValues.length) {
      return { min: 0, max: 10 };
    }
    return {
      min: overallTrendDomain.min,
      max: overallTrendDomain.max,
    };
  }, [overallTrendDomain, trendValues]);

  const yScale = useMemo(() => {
    const range = yDomain.max - yDomain.min || 1;
    return (value) => 220 - ((value - yDomain.min) / range) * 168;
  }, [yDomain]);

  const yTicks = useMemo(() => {
    const steps = 4;
    const range = yDomain.max - yDomain.min;
    return Array.from({ length: steps + 1 }, (_, index) => Math.round(yDomain.min + (range / steps) * index));
  }, [yDomain]);

  const xStep = trendValues.length > 1 ? 460 / (trendValues.length - 1) : 0;

  const trendGrowth = useMemo(
    () => trendValues.map((value, index) => (index === 0 ? 0 : value - trendValues[index - 1])),
    [trendValues]
  );

  const chartPoints = trendValues
    .map((value, index) => {
      const x = 32 + index * xStep;
      const y = yScale(value);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `32,220 ${chartPoints} 492,220`;

  const totalEmployees = members.length;
  const topPerformer = topPerformers[0];
  const presentToday = attendanceSummaryCards.find((item) => item.title === 'Present Today')?.value || 0;
  const absentToday = attendanceSummaryCards.find((item) => item.title === 'Absent')?.value || 0;

  const cockpitCards = [
    {
      id: 'total-employees',
      title: 'Total employees',
      value: totalEmployees,
      hint: 'Current workforce size',
      onClick: () => {
        onNavigateTab?.('members');
      },
    },
    {
      id: 'present-today',
      title: 'Present today',
      value: presentToday,
      hint: 'Operational readiness',
      onClick: () => {
        onNavigateTab?.('attendance');
      },
    },
    {
      id: 'absent-today',
      title: 'Absent today',
      value: absentToday,
      hint: 'Needs follow-up',
      onClick: () => {
        onNavigateTab?.('attendance');
      },
    },
    {
      id: 'top-performer',
      title: 'Top performer',
      value: topPerformer?.name || '-',
      hint: topPerformer ? `Rating ${topPerformer.rating}` : 'Performance spotlight',
      onClick: () => {
        onNavigateTab?.('performance');
      },
    },
  ];

  return (
    <div className="tm-overview-root">
      <section className="tm-executive-cockpit tm-anim-panel">
        <div className="tm-executive-cockpit-copy">
          <p className="tm-executive-eyebrow">CEO cockpit</p>
          <h3>What needs your attention right now</h3>
          <p>
            This view is designed for decision-making: it surfaces risk, delivery, people, and
            performance in that order, with drill-downs available only when needed.
          </p>
        </div>

        <div className="tm-executive-cockpit-grid">
          {cockpitCards.map((card) => (
            <button
              key={card.id}
              type="button"
              className="tm-executive-card-btn"
              onClick={card.onClick}
            >
              <span>{card.title}</span>
              <strong>{card.value}</strong>
              <small>{card.hint}</small>
            </button>
          ))}
        </div>

      </section>

      <section className="tm-overview-grid">
            <article className="tm-panel tm-trend-panel tm-anim-panel">
          <div className="tm-panel-head">
            <div>
              <h3>Headcount Growth Trend</h3>
              <p>Monthly employee count across all departments</p>
            </div>
            <div className="tm-panel-meta">
              <span><i /> Total</span>
              <label className="tm-year-filter" htmlFor="tm-headcount-year">Year</label>
              <select
                id="tm-headcount-year"
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                aria-label="Filter headcount trend by year"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

              <svg
                viewBox="0 0 520 250"
                className="tm-chart"
                aria-label="Headcount growth chart"
                onMouseLeave={() => setHoveredTrendIndex(null)}
              >
            <defs>
              <linearGradient id="tmTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity="0.26" />
                <stop offset="95%" stopColor="#22c55e" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="tmTrendStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            {yTicks.map((tick) => {
              const y = yScale(tick);
              return (
                <g key={tick}>
                  <line x1="30" y1={y} x2="500" y2={y} />
                  <text x="6" y={y + 4}>{tick}</text>
                </g>
              );
            })}
                <polygon className="tm-trend-area" points={areaPoints} />
                <polyline className="tm-trend-line" points={chartPoints} />
            {hoveredTrendIndex !== null ? (
              <line
                className="tm-trend-hover-line"
                x1={32 + hoveredTrendIndex * xStep}
                y1="52"
                x2={32 + hoveredTrendIndex * xStep}
                y2="220"
              />
            ) : null}
            {trendValues.map((value, index) => {
              const x = 32 + index * xStep;
              const y = yScale(value);
              const growth = trendGrowth[index];
              const growthPrefix = growth > 0 ? '+' : '';
              const hitX = Math.max(30, x - 42);
              const hitWidth = 84;
              return (
                    <g
                      key={`${value}-${index}`}
                      className={`tm-trend-point ${hoveredTrendIndex === index ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredTrendIndex(index)}
                      onFocus={() => setHoveredTrendIndex(index)}
                      onBlur={() => setHoveredTrendIndex(null)}
                    >
                      <rect
                        className="tm-trend-hit-area"
                        x={hitX}
                        y="48"
                        width={hitWidth}
                        height="172"
                      />
                      <circle
                        className="tm-trend-pulse"
                        cx={x}
                        cy={y}
                        r="11"
                        style={{ '--point-delay': `${index * 110}ms` }}
                      />
                      <circle
                        className="tm-trend-dot"
                        cx={x}
                        cy={y}
                        r="5"
                        style={{ '--point-delay': `${index * 110}ms` }}
                      />
                  <text x={x - 8} y="242">{trendLabels[index]}</text>
                  <g
                    className={`tm-trend-tooltip ${hoveredTrendIndex === index ? 'active' : ''}`}
                    transform={`translate(${x - 48} ${y - 58})`}
                    aria-hidden={hoveredTrendIndex === index ? 'false' : 'true'}
                  >
                    <rect width="96" height="44" rx="10" ry="10" />
                    <text x="10" y="16" className="tm-tooltip-label">{trendLabels[index]}</text>
                    <text x="10" y="31" className="tm-tooltip-value">Headcount {value}</text>
                    <text x="95" y="31" textAnchor="end" className="tm-tooltip-growth">
                      {`${growthPrefix}${growth}`}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </article>
      </section>

    </div>
  );
};

export default OverviewTab;
