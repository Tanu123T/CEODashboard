import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  CircleX,
  Clock3,
  Download,
} from 'lucide-react';
import {
  attendanceDays,
  attendanceLog,
  members,
  attendanceSeries,
  attendanceSummaryCards,
  statusTone,
} from '../teamData';

const iconMap = {
  present: CheckCircle2,
  absent: CircleX,
  late: Clock3,
  leave: CalendarCheck2,
};

const toneToStatus = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'On Leave',
};

const statusToTone = {
  Present: 'present',
  Absent: 'absent',
  Late: 'late',
  'On Leave': 'leave',
};

const weeklyAttendanceSeries = {
  'this-week': {
    label: 'This Week',
    present: attendanceSeries.present,
    late: attendanceSeries.late,
    absent: attendanceSeries.absent,
  },
  'last-week': {
    label: 'Last Week',
    present: [9, 10, 9, 10, 11, 10, 9],
    late: [2, 2, 3, 2, 1, 2, 2],
    absent: [1, 0, 1, 0, 0, 1, 1],
  },
  'two-weeks-ago': {
    label: '2 Weeks Ago',
    present: [8, 9, 9, 10, 10, 9, 8],
    late: [3, 2, 2, 2, 1, 2, 3],
    absent: [1, 1, 1, 0, 1, 1, 1],
  },
  'three-weeks-ago': {
    label: '3 Weeks Ago',
    present: [10, 9, 10, 9, 10, 11, 10],
    late: [1, 2, 1, 2, 1, 1, 2],
    absent: [1, 1, 0, 1, 1, 0, 1],
  },
};

const attendancePoints = (series) => series
  .map((value, index) => {
    const x = 44 + index * 90;
    const y = 192 - (value / 12) * 156;
    return `${x},${y}`;
  })
  .join(' ');

const attendanceAreaPoints = (presentSeries) => {
  const points = presentSeries
    .map((value, index) => {
      const x = 44 + index * 90;
      const y = 192 - (value / 12) * 156;
      return `${x},${y}`;
    })
    .join(' ');
  return `44,192 ${points} 584,192`;
};

const pointY = (value) => 192 - (value / 12) * 156;

const AttendanceTab = () => {
  const [selectedWeek, setSelectedWeek] = useState('this-week');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedToneFilter, setSelectedToneFilter] = useState(null);
  const filterResultsRef = useRef(null);

  const weekSeries = useMemo(
    () => weeklyAttendanceSeries[selectedWeek] || weeklyAttendanceSeries['this-week'],
    [selectedWeek]
  );

  const attendanceRows = useMemo(() => {
    const logByCode = new Map(attendanceLog.map((row) => [row.code, row]));

    return members.map((member) => {
      const logEntry = logByCode.get(member.employeeCode);

      return {
        name: member.name,
        code: member.employeeCode,
        department: member.department,
        checkIn: member.checkIn || logEntry?.checkIn || '--',
        checkOut: logEntry?.checkOut || '--',
        hours: logEntry?.hours || '--',
        device: logEntry?.device || '--',
        status: member.attendanceStatus,
        initials: member.initials,
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    if (!selectedToneFilter) return attendanceRows;
    const selectedStatus = toneToStatus[selectedToneFilter];
    return attendanceRows.filter((row) => row.status === selectedStatus);
  }, [attendanceRows, selectedToneFilter]);

  useEffect(() => {
    if (!selectedToneFilter || !filterResultsRef.current) return;
    filterResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedToneFilter]);

  return (
    <div className="tm-attendance-root">
      <section className="tm-att-summary-grid">
        {attendanceSummaryCards.map((item, index) => {
          const Icon = iconMap[item.tone];
          return (
            <article
              key={item.title}
              className={`tm-att-summary-card tm-att-anim-card ${selectedToneFilter === item.tone ? 'active' : ''}`}
              style={{ '--att-index': index }}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedToneFilter((current) => (current === item.tone ? null : item.tone))}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedToneFilter((current) => (current === item.tone ? null : item.tone));
                }
              }}
            >
              <span className={`tm-att-summary-icon ${item.tone}`}><Icon size={17} /></span>
              <div>
                <p>{item.title}</p>
                <h3>{item.value} <small className={item.percentTone}>{item.percent}</small></h3>
              </div>
            </article>
          );
        })}
      </section>

      {selectedToneFilter ? (
        <section ref={filterResultsRef} className={`tm-att-filter-results tm-att-anim-panel ${selectedToneFilter}`}>
          <div className="tm-att-filter-head">
            <h3>{toneToStatus[selectedToneFilter]} Employees</h3>
            <p>{filteredRows.length} match(es)</p>
          </div>
          <div className="tm-att-filter-list">
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <article key={`filter-${row.code}`} className="tm-att-filter-item">
                  <div className="tm-att-filter-item-left">
                    <span className="tm-att-filter-avatar">{row.initials}</span>
                    <div className="tm-att-filter-copy">
                      <strong>{row.name}</strong>
                      <small>{row.code} • {row.department}</small>
                      <div className="tm-att-filter-meta">
                        <span>In {row.checkIn}</span>
                        <span>Out {row.checkOut}</span>
                        <span>{row.hours}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`tm-att-status ${statusTone[row.status] || statusToTone[row.status] || 'present'}`}>
                    {row.status}
                  </span>
                </article>
              ))
            ) : (
              <p className="tm-empty">No employees found for this status.</p>
            )}
          </div>
        </section>
      ) : null}

      <section className="tm-att-trend-grid">
        <article className="tm-att-panel tm-att-anim-panel">
          <div className="tm-att-panel-head">
            <div>
              <h3>Weekly Attendance Trend</h3>
              <p>Present vs late vs absent ({weekSeries.label})</p>
            </div>
            <select
              value={selectedWeek}
              onChange={(event) => setSelectedWeek(event.target.value)}
              aria-label="Select attendance week"
            >
              {Object.entries(weeklyAttendanceSeries).map(([value, week]) => (
                <option key={value} value={value}>{week.label}</option>
              ))}
            </select>
          </div>

          <svg viewBox="0 0 690 230" className="tm-att-trend-chart" aria-label="Attendance trend">
            {[0, 3, 6, 9, 12].map((tick) => {
              const y = 192 - (tick / 12) * 156;
              return (
                <g key={tick}>
                  <line x1="40" y1={y} x2="655" y2={y} />
                  <text x="18" y={y + 4}>{tick}</text>
                </g>
              );
            })}
            <polygon className="present-area" points={attendanceAreaPoints(weekSeries.present)} />
            <polyline className="present-line" points={attendancePoints(weekSeries.present)} />
            <polyline className="late-line" points={attendancePoints(weekSeries.late)} />
            <polyline className="absent-line" points={attendancePoints(weekSeries.absent)} />

            {attendanceDays.map((day, index) => (
              <rect
                key={`${day}-hit`}
                x={44 + index * 90 - 35}
                y={24}
                width={70}
                height={178}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}

            {hoveredIndex !== null ? (
              <g>
                <line
                  className="tm-att-hover-line"
                  x1={44 + hoveredIndex * 90}
                  y1={36}
                  x2={44 + hoveredIndex * 90}
                  y2={192}
                />

                <circle
                  className="tm-att-hover-dot present"
                  cx={44 + hoveredIndex * 90}
                  cy={pointY(weekSeries.present[hoveredIndex])}
                  r="4"
                />
                <circle
                  className="tm-att-hover-dot late"
                  cx={44 + hoveredIndex * 90}
                  cy={pointY(weekSeries.late[hoveredIndex])}
                  r="4"
                />
                <circle
                  className="tm-att-hover-dot absent"
                  cx={44 + hoveredIndex * 90}
                  cy={pointY(weekSeries.absent[hoveredIndex])}
                  r="4"
                />

                <g
                  className="tm-att-tooltip"
                  transform={`translate(${Math.min(470, Math.max(70, 44 + hoveredIndex * 90 - 70))}, 16)`}
                >
                  <rect x="0" y="0" width="140" height="70" rx="10" ry="10" />
                  <text x="10" y="18" className="tm-att-tooltip-day">{attendanceDays[hoveredIndex]}</text>
                  <text x="10" y="36" className="tm-att-tooltip-present">Present: {weekSeries.present[hoveredIndex]}</text>
                  <text x="10" y="52" className="tm-att-tooltip-late">Late: {weekSeries.late[hoveredIndex]}</text>
                  <text x="10" y="66" className="tm-att-tooltip-absent">Absent: {weekSeries.absent[hoveredIndex]}</text>
                </g>
              </g>
            ) : null}

            {attendanceDays.map((day, index) => (
              <text key={day} x={44 + index * 90 - 12} y="218">{day}</text>
            ))}
          </svg>
        </article>

      </section>

      <section className="tm-att-log-panel tm-att-anim-panel">
        <div className="tm-att-log-head">
          <div>
            <h3>Today's Attendance Log</h3>
            <p>
              {selectedToneFilter
                ? `${toneToStatus[selectedToneFilter]} employees (${filteredRows.length})`
                : 'Real-time employee check-in/out records'}
            </p>
          </div>
          <div className="tm-att-log-actions">
            <select
              value={selectedToneFilter || 'all'}
              onChange={(event) => setSelectedToneFilter(event.target.value === 'all' ? null : event.target.value)}
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="leave">On Leave</option>
            </select>
            <button type="button"><Download size={14} /> Export</button>
          </div>
        </div>

        <div className="tm-att-table-wrap">
          <table className="tm-att-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={row.code} className="tm-att-log-row" style={{ '--att-row-index': index }}>
                  <td>
                    <div className="tm-att-employee-cell">
                      <span className="tm-att-initials">{row.initials}</span>
                      <div>
                        <strong>{row.name}</strong>
                        <small>{row.code}</small>
                      </div>
                    </div>
                  </td>
                  <td>{row.department}</td>
                  <td>{row.checkIn}</td>
                  <td>{row.checkOut}</td>
                  <td>{row.hours}</td>
                  <td>
                    <span className={`tm-att-status ${statusTone[row.status] || statusToTone[row.status] || 'present'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!filteredRows.length ? (
                <tr>
                  <td colSpan="6"><p className="tm-empty">No employees match the selected attendance filter.</p></td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AttendanceTab;
