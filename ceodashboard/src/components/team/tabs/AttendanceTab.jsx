import React from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Clock3,
  Download,
  Fingerprint,
  ScanFace,
} from 'lucide-react';
import {
  attendanceDays,
  attendanceLog,
  attendanceSeries,
  attendanceSummaryCards,
  biometricCards,
} from '../teamData';

const iconMap = {
  present: CheckCircle2,
  absent: CircleX,
  late: Clock3,
  leave: CalendarCheck2,
};

const biometricIconMap = {
  face: ScanFace,
  print: Fingerprint,
};

const attendancePoints = (series) => series
  .map((value, index) => {
    const x = 44 + index * 90;
    const y = 192 - (value / 12) * 156;
    return `${x},${y}`;
  })
  .join(' ');

const attendanceAreaPoints = () => {
  const points = attendanceSeries.present
    .map((value, index) => {
      const x = 44 + index * 90;
      const y = 192 - (value / 12) * 156;
      return `${x},${y}`;
    })
    .join(' ');
  return `44,192 ${points} 584,192`;
};

const AttendanceTab = () => {
  return (
    <>
      <section className="tm-att-summary-grid">
        {attendanceSummaryCards.map((item) => {
          const Icon = iconMap[item.tone];
          return (
            <article key={item.title} className="tm-att-summary-card">
              <span className={`tm-att-summary-icon ${item.tone}`}><Icon size={17} /></span>
              <div>
                <p>{item.title}</p>
                <h3>{item.value} <small className={item.percentTone}>{item.percent}</small></h3>
              </div>
            </article>
          );
        })}
      </section>

      <section className="tm-att-biometric-grid">
        {biometricCards.map((card) => {
          const Icon = biometricIconMap[card.tone];
          return (
            <article key={card.key} className={`tm-att-biometric-card ${card.tone}`}>
              <div className="tm-att-biometric-head">
                <div className="tm-att-biometric-title">
                  <span><Icon size={19} /></span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </div>
                </div>
                <em>Active</em>
              </div>

              <div className="tm-att-biometric-metrics">
                <div><strong>{card.enrolled}</strong><small>Enrolled</small></div>
                <div><strong>{card.scannedToday}</strong><small>Scanned Today</small></div>
                <div><strong>{card.accuracy}</strong><small>Accuracy</small></div>
              </div>

              <div className="tm-att-progress-wrap">
                <div className="tm-att-progress-track">
                  <span style={{ width: `${card.scannedPercent}%` }} />
                </div>
                <small>{card.scannedPercent}% scanned</small>
              </div>

              <p className="tm-att-device-line">{card.devices}</p>
            </article>
          );
        })}
      </section>

      <section className="tm-att-trend-grid">
        <article className="tm-att-panel">
          <div className="tm-att-panel-head">
            <div>
              <h3>Weekly Attendance Trend</h3>
              <p>Present vs late vs absent this week</p>
            </div>
            <button type="button">This Week <ChevronDown size={14} /></button>
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
            <polygon className="present-area" points={attendanceAreaPoints()} />
            <polyline className="present-line" points={attendancePoints(attendanceSeries.present)} />
            <polyline className="late-line" points={attendancePoints(attendanceSeries.late)} />
            <polyline className="absent-line" points={attendancePoints(attendanceSeries.absent)} />
            {attendanceDays.map((day, index) => (
              <text key={day} x={44 + index * 90 - 12} y="218">{day}</text>
            ))}
          </svg>
        </article>

        <article className="tm-att-panel tm-att-donut-panel">
          <h3>Biometric Method Split</h3>
          <p>Today's check-ins by type</p>
          <div className="tm-att-donut" />
          <div className="tm-att-donut-legend">
            <span><i className="face" /> Facial Recognition</span>
            <span><i className="print" /> Fingerprint</span>
          </div>
        </article>
      </section>

      <section className="tm-att-simulator">
        <div>
          <h3>Biometric Check-in Simulator</h3>
          <p>Simulate facial or fingerprint check-in</p>
        </div>
        <button type="button">Open Simulator</button>
      </section>

      <section className="tm-att-log-panel">
        <div className="tm-att-log-head">
          <div>
            <h3>Today's Attendance Log</h3>
            <p>Real-time biometric check-in/out records</p>
          </div>
          <div className="tm-att-log-actions">
            <select>
              <option>All</option>
            </select>
            <select>
              <option>All Methods</option>
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
                <th>Method</th>
                <th>Device</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLog.map((row) => (
                <tr key={row.code}>
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
                    <span className={`tm-att-method ${row.method === 'Facial' ? 'facial' : 'fingerprint'}`}>
                      {row.method === 'Facial' ? <ScanFace size={14} /> : <Fingerprint size={14} />} {row.method}
                    </span>
                  </td>
                  <td>{row.device}</td>
                  <td>
                    <span className={`tm-att-status ${row.status === 'Present' ? 'present' : 'late'}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AttendanceTab;
