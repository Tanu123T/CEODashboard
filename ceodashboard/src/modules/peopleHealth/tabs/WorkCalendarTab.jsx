import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react';
import { teamMembers } from '../data/ceoSchedule';
import './WorkCalendar.css';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORAGE_KEY = 'ceo-work-calendar-events';

const categoryOptions = [
  { value: 'meeting', label: 'Meeting', color: '#4b8fe7' },
  { value: 'personal', label: 'Personal', color: '#2fc7a6' },
  { value: 'conference', label: 'Conference', color: '#55b84a' },
  { value: 'workshop', label: 'Workshop', color: '#f59e0b' },
  { value: 'focus', label: 'Focus time', color: '#a855f7' },
];

const getCurrentDate = () => new Date();

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromLocalDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const sortByTime = (a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime);
const AUTO_MEETING_DURATION_MINUTES = 30;

const timeToMinutes = (timeText) => {
  const [hours, minutes] = timeText.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime12Hour = (timeText) => {
  const [hours, minutes] = timeText.split(':').map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatTimeLabel = (timeText) => {
  const [hours, minutes] = timeText.split(':').map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: minutes === 0 ? undefined : '2-digit',
    hour12: true,
  });
};

const minutesToTime = (value) => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const getFreeSlots = (busyEvents, dayStart = 9 * 60, dayEnd = 18 * 60) => {
  if (!busyEvents.length) {
    return [{ start: dayStart, end: dayEnd }];
  }

  const busyRanges = busyEvents
    .map((event) => ({
      start: Math.max(dayStart, timeToMinutes(event.startTime)),
      end: Math.min(dayEnd, timeToMinutes(event.endTime)),
    }))
    .filter((range) => range.end > range.start)
    .sort((left, right) => left.start - right.start);

  const mergedRanges = [];
  busyRanges.forEach((range) => {
    const previous = mergedRanges[mergedRanges.length - 1];
    if (!previous || range.start > previous.end) {
      mergedRanges.push({ ...range });
      return;
    }

    previous.end = Math.max(previous.end, range.end);
  });

  const freeRanges = [];
  let cursor = dayStart;
  mergedRanges.forEach((range) => {
    if (range.start > cursor) {
      freeRanges.push({ start: cursor, end: range.start });
    }
    cursor = Math.max(cursor, range.end);
  });

  if (cursor < dayEnd) {
    freeRanges.push({ start: cursor, end: dayEnd });
  }

  return freeRanges;
};

const getEventLayoutForDay = (dayEvents) => {
  const withMinutes = dayEvents.map((event) => ({
    ...event,
    _start: timeToMinutes(event.startTime),
    _end: timeToMinutes(event.endTime),
  }));

  const groups = [];
  let currentGroup = [];
  let currentGroupEnd = -1;

  withMinutes.forEach((event) => {
    if (!currentGroup.length || event._start < currentGroupEnd) {
      currentGroup.push(event);
      currentGroupEnd = Math.max(currentGroupEnd, event._end);
      return;
    }

    groups.push(currentGroup);
    currentGroup = [event];
    currentGroupEnd = event._end;
  });

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  const layoutById = new Map();

  groups.forEach((group) => {
    const laneEndTimes = [];

    group.forEach((event) => {
      let laneIndex = laneEndTimes.findIndex((laneEnd) => event._start >= laneEnd);
      if (laneIndex === -1) {
        laneIndex = laneEndTimes.length;
        laneEndTimes.push(event._end);
      } else {
        laneEndTimes[laneIndex] = event._end;
      }

      layoutById.set(event.id, {
        lane: laneIndex,
        lanes: 0,
      });
    });

    const totalLanes = Math.max(laneEndTimes.length, 1);
    group.forEach((event) => {
      const existing = layoutById.get(event.id);
      if (existing) {
        existing.lanes = totalLanes;
      }
    });
  });

  return layoutById;
};

const formatLongDate = (dateKey) => {
  const date = fromLocalDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const createDraftEvent = (dateKey) => ({
  title: '',
  date: dateKey,
  startTime: '09:00',
  endTime: '10:00',
  category: 'meeting',
  color: '#4b8fe7',
});

const getSlotEndTime = (startTime) => {
  return minutesToTime(Math.min(timeToMinutes(startTime) + 60, (23 * 60) + 59));
};

const getDefaultDemoDate = () => {
  const now = getCurrentDate();
  return new Date(now.getFullYear(), now.getMonth(), 12);
};

const getDefaultDemoEvents = () => {
  const now = getCurrentDate();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthKey = String(month).padStart(2, '0');

  return [
    {
      id: `event-default-${year}-${month}-1`,
      title: 'Demo Schedule',
      date: `${year}-${monthKey}-12`,
      startTime: '10:00',
      endTime: '11:00',
      category: 'meeting',
      color: '#4b8fe7',
    },
    {
      id: `event-default-${year}-${month}-2`,
      title: 'Sprint Planning',
      date: `${year}-${monthKey}-14`,
      startTime: '11:30',
      endTime: '12:30',
      category: 'workshop',
      color: '#f59e0b',
    },
    {
      id: `event-default-${year}-${month}-3`,
      title: 'Client Demo',
      date: `${year}-${monthKey}-18`,
      startTime: '15:00',
      endTime: '16:00',
      category: 'conference',
      color: '#55b84a',
    },
    {
      id: `event-default-${year}-${month}-4`,
      title: 'Leadership Review',
      date: `${year}-${monthKey}-22`,
      startTime: '09:30',
      endTime: '10:30',
      category: 'meeting',
      color: '#a855f7',
    },
  ];
};

const ensureDefaultDemoEvent = (eventList) => {
  const defaults = getDefaultDemoEvents();
  const existingDefaultIds = new Set(eventList.map((event) => event.id));
  const missingDefaults = defaults.filter((event) => !existingDefaultIds.has(event.id));

  return missingDefaults.length ? [...eventList, ...missingDefaults] : eventList;
};

const ensureAutoMeetingsForMembers = (eventList, members, dateKey) => {
  let nextEvents = [...eventList];

  members.forEach((member) => {
    const alreadyScheduled = nextEvents.some(
      (event) => event.date === dateKey && event.autoMemberId === member.id,
    );

    if (alreadyScheduled) {
      return;
    }

    const dayEvents = nextEvents
      .filter((event) => event.date === dateKey)
      .sort(sortByTime);

    const nextSlot = getFreeSlots(dayEvents)
      .filter((slot) => (slot.end - slot.start) >= AUTO_MEETING_DURATION_MINUTES)
      .at(0);

    if (!nextSlot) {
      return;
    }

    const startMinutes = nextSlot.start;
    const endMinutes = Math.min(nextSlot.start + AUTO_MEETING_DURATION_MINUTES, nextSlot.end);

    nextEvents.push({
      id: `auto-meet-${member.id}-${dateKey}`,
      title: `1:1 with ${member.name.split(' ')[0]}`,
      date: dateKey,
      startTime: minutesToTime(startMinutes),
      endTime: minutesToTime(endMinutes),
      category: 'meeting',
      color: '#2fc7a6',
      autoGenerated: true,
      autoMemberId: member.id,
    });
  });

  return nextEvents;
};

const normalizeEventDate = (dateValue) => {
  if (!dateValue) {
    return toLocalDateKey(getCurrentDate());
  }

  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue.split('T')[0];
  }

  return dateValue;
};

const alignSeedEventsToCurrentMonth = () => {
  return getDefaultDemoEvents();
};

const WorkCalendarTab = () => {
  const [currentDate, setCurrentDate] = useState(() => getDefaultDemoDate());
  const [selectedDateKey, setSelectedDateKey] = useState(() => toLocalDateKey(getDefaultDemoDate()));
  const [viewMode, setViewMode] = useState('week');
  const [meetWith, setMeetWith] = useState(teamMembers);
  const [meetWithQuery, setMeetWithQuery] = useState('');
  const [focusedMemberId, setFocusedMemberId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const hasInitializedAutoMeetings = useRef(false);
  const [events, setEvents] = useState(() => {
    if (typeof window === 'undefined') {
      return ensureAutoMeetingsForMembers(
        alignSeedEventsToCurrentMonth(),
        teamMembers,
        toLocalDateKey(getDefaultDemoDate()),
      );
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored).map((event, index) => ({
          ...event,
          id: event.id || `event-${Date.now()}-${index}`,
          date: normalizeEventDate(event.date),
        }));
        return ensureAutoMeetingsForMembers(
          ensureDefaultDemoEvent(parsed),
          teamMembers,
          toLocalDateKey(getDefaultDemoDate()),
        );
      }

      return ensureAutoMeetingsForMembers(
        alignSeedEventsToCurrentMonth(),
        teamMembers,
        toLocalDateKey(getDefaultDemoDate()),
      );
    } catch {
      return ensureAutoMeetingsForMembers(
        alignSeedEventsToCurrentMonth(),
        teamMembers,
        toLocalDateKey(getDefaultDemoDate()),
      );
    }
  });
  const [draftEvent, setDraftEvent] = useState(() => createDraftEvent(toLocalDateKey(getCurrentDate())));

  // Get the week starting from Sunday
  const getWeekDates = (date) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek;
    const startOfWeek = new Date(d.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const selectedDate = useMemo(() => fromLocalDateKey(selectedDateKey), [selectedDateKey]);
  const visibleDates = useMemo(
    () => (viewMode === 'day' ? [selectedDate] : weekDates),
    [viewMode, selectedDate, weekDates],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Ignore storage failures and keep working in memory.
    }
  }, [events]);

  useEffect(() => {
    setDraftEvent((prev) => ({ ...prev, date: selectedDateKey }));
  }, [selectedDateKey]);

  useEffect(() => {
    if (hasInitializedAutoMeetings.current) {
      return;
    }

    setEvents((previousEvents) => ensureAutoMeetingsForMembers(previousEvents, meetWith, selectedDateKey));
    hasInitializedAutoMeetings.current = true;
  }, [meetWith, selectedDateKey]);
  
  // Get events for the week
  const eventsThisWeek = useMemo(() => {
    const eventsByDate = {};
    events.forEach((event) => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });
    Object.keys(eventsByDate).forEach((dateKey) => {
      eventsByDate[dateKey].sort(sortByTime);
    });
    return eventsByDate;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    return events.filter((event) => event.date === selectedDateKey).sort(sortByTime);
  }, [events, selectedDateKey]);

  const nextMeetingForSelectedDay = useMemo(() => {
    if (!selectedDayEvents.length) {
      return null;
    }

    const todayKey = toLocalDateKey(getCurrentDate());

    if (selectedDateKey === todayKey) {
      const now = '09:45';
      const upcoming = selectedDayEvents.find((event) => event.startTime >= now);
      return upcoming || selectedDayEvents[0];
    }

    return selectedDayEvents[0];
  }, [selectedDateKey, selectedDayEvents]);

  const normalizedQuery = meetWithQuery.trim().toLowerCase();

  const filteredMeetWith = useMemo(() => {
    if (!normalizedQuery) {
      return meetWith;
    }

    return meetWith.filter((member) => (
      member.name.toLowerCase().includes(normalizedQuery)
      || member.email.toLowerCase().includes(normalizedQuery)
    ));
  }, [meetWith, normalizedQuery]);

  const memberSearchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const existingIds = new Set(meetWith.map((member) => member.id));
    return teamMembers.filter((member) => {
      if (existingIds.has(member.id)) {
        return false;
      }

      return member.name.toLowerCase().includes(normalizedQuery)
        || member.email.toLowerCase().includes(normalizedQuery);
    });
  }, [meetWith, normalizedQuery]);

  const timeSlotSuggestions = useMemo(() => {
    const slots = getFreeSlots(selectedDayEvents)
      .filter((slot) => (slot.end - slot.start) >= 60)
      .slice(0, 2);

    if (!slots.length) {
      return ['No open 1-hour slots in working hours'];
    }

    const isSelectedToday = selectedDateKey === toLocalDateKey(getCurrentDate());
    const prefix = isSelectedToday ? 'Today' : formatLongDate(selectedDateKey);
    return slots.map((slot) => `${prefix} ${minutesToTime(slot.start)} - ${minutesToTime(slot.end)}`);
  }, [selectedDayEvents, selectedDateKey]);

  // Generate time slots (from 9 AM to 6 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  const getEventPosition = (event) => {
    const [eventHour, eventMin] = event.startTime.split(':').map(Number);
    const startHour = 9;
    const top = (eventHour - startHour + eventMin / 60) * 60; // 60px per hour
    return top;
  };

  const getEventHeight = (event) => {
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);
    const durationHours = (endHour - startHour) + (endMin - startMin) / 60;
    return durationHours * 60; // 60px per hour
  };

  const handlePrevMonth = () => {
    const active = fromLocalDateKey(selectedDateKey);
    const targetYear = active.getFullYear();
    const targetMonth = active.getMonth() - 1;
    const targetDay = active.getDate();
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const nextDate = new Date(targetYear, targetMonth, Math.min(targetDay, daysInTargetMonth));
    setCurrentDate(nextDate);
    setSelectedDateKey(toLocalDateKey(nextDate));
  };

  const handleNextMonth = () => {
    const active = fromLocalDateKey(selectedDateKey);
    const targetYear = active.getFullYear();
    const targetMonth = active.getMonth() + 1;
    const targetDay = active.getDate();
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const nextDate = new Date(targetYear, targetMonth, Math.min(targetDay, daysInTargetMonth));
    setCurrentDate(nextDate);
    setSelectedDateKey(toLocalDateKey(nextDate));
  };

  const handleToday = () => {
    const today = getCurrentDate();
    setCurrentDate(today);
    setSelectedDateKey(toLocalDateKey(today));
  };

  const handleDateSelect = (date) => {
    setCurrentDate(new Date(date));
    setSelectedDateKey(toLocalDateKey(date));
  };

  const handleDayColumnClick = (clickEvent, date) => {
    const headerHeight = 44;
    const slotHeight = 60;
    const rect = clickEvent.currentTarget.getBoundingClientRect();
    const relativeY = clickEvent.clientY - rect.top - headerHeight;

    if (relativeY < 0) {
      handleDateSelect(date);
      return;
    }

    const slotIndex = Math.max(0, Math.min(Math.floor(relativeY / slotHeight), timeSlots.length - 1));
    handleOpenScheduleModalForSlot(date, timeSlots[slotIndex]);
  };

  const handleEditEvent = (eventItem) => {
    setEditingEventId(eventItem.id);
    setDraftEvent({
      title: eventItem.title,
      date: eventItem.date,
      startTime: eventItem.startTime,
      endTime: eventItem.endTime,
      category: eventItem.category,
      color: eventItem.color,
    });
    setSelectedDateKey(eventItem.date);
    setCurrentDate(fromLocalDateKey(eventItem.date));
    setIsScheduleModalOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    if (editingEventId === eventId) {
      setEditingEventId(null);
      setDraftEvent(createDraftEvent(selectedDateKey));
    }
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setEditingEventId(null);
    setDraftEvent(createDraftEvent(selectedDateKey));
  };

  const handleCancelEdit = () => {
    handleCloseScheduleModal();
  };

  const handleOpenScheduleModalForSlot = (date, startTime) => {
    const dateKey = toLocalDateKey(date);
    const category = categoryOptions[0];

    setCurrentDate(new Date(date));
    setSelectedDateKey(dateKey);
    setEditingEventId(null);
    setDraftEvent({
      title: '',
      date: dateKey,
      startTime,
      endTime: getSlotEndTime(startTime),
      category: category.value,
      color: category.color,
    });
    setIsScheduleModalOpen(true);
  };

  const handleDraftChange = (field, value) => {
    setDraftEvent((prev) => {
      const nextDraft = { ...prev, [field]: value };
      if (field === 'category') {
        const category = categoryOptions.find((option) => option.value === value);
        nextDraft.color = category?.color || prev.color;
      }
      return nextDraft;
    });
  };

  const canAddEvent = draftEvent.title.trim()
    && draftEvent.date
    && draftEvent.startTime
    && draftEvent.endTime
    && draftEvent.endTime > draftEvent.startTime;

  const handleAddEvent = (event) => {
    event.preventDefault();

    if (!canAddEvent) {
      return;
    }

    const category = categoryOptions.find((option) => option.value === draftEvent.category);
    const payload = {
      title: draftEvent.title.trim(),
      date: draftEvent.date,
      startTime: draftEvent.startTime,
      endTime: draftEvent.endTime,
      category: draftEvent.category,
      color: draftEvent.color || category?.color || '#4b8fe7',
    };

    setEvents((prev) => {
      if (editingEventId) {
        return prev.map((event) => (event.id === editingEventId ? { ...event, ...payload } : event));
      }

      return [...prev, { id: `event-${Date.now()}`, ...payload }];
    });

    setEditingEventId(null);
    setSelectedDateKey(draftEvent.date);
    setCurrentDate(fromLocalDateKey(draftEvent.date));
    setDraftEvent(createDraftEvent(draftEvent.date));
    setIsScheduleModalOpen(false);
  };

  const scheduleAutoMeetingForMember = (member, dateKey) => {
    setEvents((previousEvents) => ensureAutoMeetingsForMembers(previousEvents, [member], dateKey));
  };

  const handleRemoveMember = (memberId) => {
    setMeetWith((previousMembers) => previousMembers.filter((member) => member.id !== memberId));
    setEvents((previousEvents) => previousEvents.filter((event) => event.autoMemberId !== memberId));
    if (focusedMemberId === memberId) {
      setFocusedMemberId(null);
    }
  };

  const handleAddMember = (member) => {
    if (meetWith.some((existingMember) => existingMember.id === member.id)) {
      setMeetWithQuery('');
      return;
    }

    setMeetWith((previousMembers) => [...previousMembers, member]);
    scheduleAutoMeetingForMember(member, selectedDateKey);
    setMeetWithQuery('');
  };

  const handleClearMembers = () => {
    const memberIds = new Set(meetWith.map((member) => member.id));
    setMeetWith([]);
    setEvents((previousEvents) => (
      previousEvents.filter((event) => !(event.autoMemberId && memberIds.has(event.autoMemberId)))
    ));
    setFocusedMemberId(null);
  };

  const handleMemberSearchKeyDown = (keyboardEvent) => {
    if (keyboardEvent.key === 'Enter' && memberSearchResults.length) {
      keyboardEvent.preventDefault();
      handleAddMember(memberSearchResults[0]);
    }
  };

  const handleToggleMemberFocus = (memberId) => {
    setFocusedMemberId((previous) => (previous === memberId ? null : memberId));
  };

  const formatDateHeader = () => {
    return monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
  };

  const activeMonth = currentDate.getMonth();
  const activeYear = currentDate.getFullYear();
  const miniCalendarLabel = `${monthNames[activeMonth]} ${activeYear}`;
  const firstWeekdayMondayIndex = (new Date(activeYear, activeMonth, 1).getDay() + 6) % 7;
  const daysInActiveMonth = new Date(activeYear, activeMonth + 1, 0).getDate();

  const selectedDateLabel = formatLongDate(selectedDateKey);

  const isToday = (date) => {
    const today = getCurrentDate();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date) => toLocalDateKey(date) === selectedDateKey;

  return (
    <div className="work-calendar-container">
      <div className="work-calendar-main">
        {/* Calendar Header */}
        <div className="calendar-header">
          <div className="header-left">
            <button className="nav-button" onClick={handlePrevMonth}>
              <ChevronLeft size={20} />
            </button>
            <h2>{formatDateHeader()}</h2>
            <button className="nav-button" onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="header-right">
            <button className="today-button" onClick={handleToday}>Today</button>
            <button
              type="button"
              className={`view-button ${viewMode === 'week' ? 'active' : ''}`}
              title="Grid view"
              aria-pressed={viewMode === 'week'}
              onClick={() => setViewMode('week')}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              className={`view-button ${viewMode === 'day' ? 'active' : ''}`}
              title="Day view"
              aria-pressed={viewMode === 'day'}
              onClick={() => setViewMode('day')}
            >
              <CalendarDays size={18} />
            </button>
          </div>
        </div>

        {/* Date Header */}
        <div
          className="week-header"
          style={{ gridTemplateColumns: `60px repeat(${visibleDates.length}, 1fr)` }}
        >
          <div className="week-time-spacer" aria-hidden="true" />
          {visibleDates.map((date, idx) => (
            <button
              key={idx}
              type="button"
              className={`day-column-header ${toLocalDateKey(date) === selectedDateKey ? 'selected' : ''}`}
              onClick={() => handleDateSelect(date)}
            >
              <div className="day-name">{dayLabels[date.getDay()]}</div>
              <div className={`day-number ${isSelectedDate(date) ? 'selected' : ''} ${isToday(date) ? 'today' : ''}`}>
                {date.getDate()}
              </div>
            </button>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          className="calendar-grid"
          style={{ gridTemplateColumns: `60px repeat(${visibleDates.length}, 1fr)` }}
        >
          {/* Time column */}
          <div className="time-column">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="time-label">
                {formatTimeLabel(time)}
              </div>
            ))}
          </div>

          {/* Events grid */}
          {visibleDates.map((date, dayIdx) => {
            const dayEvents = eventsThisWeek[toLocalDateKey(date)] || [];
            const eventLayout = getEventLayoutForDay(dayEvents);

            return (
              <div
                key={dayIdx}
                className={`day-column ${toLocalDateKey(date) === selectedDateKey ? 'selected' : ''}`}
                onClick={(clickEvent) => handleDayColumnClick(clickEvent, date)}
              >
                <div className="day-grid-header" />
                <div className="time-slots-container">
                  {timeSlots.map((time, timeIdx) => (
                    <button
                      key={timeIdx}
                      type="button"
                      className="time-slot"
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        handleOpenScheduleModalForSlot(date, time);
                      }}
                      aria-label={`Add schedule on ${formatLongDate(toLocalDateKey(date))} at ${formatTime12Hour(time)}`}
                    />
                  ))}
                </div>

                {/* Events for this day */}
                <div className="events-container">
                  {dayEvents.map((event) => {
                    const layout = eventLayout.get(event.id) || { lane: 0, lanes: 1 };
                    const widthPercent = 100 / Math.max(layout.lanes, 1);
                    const leftPercent = widthPercent * layout.lane;

                    return (
                      <div
                        key={event.id}
                        className="calendar-event"
                        style={{
                          top: `${getEventPosition(event)}px`,
                          height: `${getEventHeight(event)}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          backgroundColor: event.color,
                          zIndex: layout.lane + 2,
                        }}
                        title={event.title}
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          handleEditEvent(event);
                        }}
                      >
                        <div className="event-time">
                          {formatTime12Hour(event.startTime)} - {formatTime12Hour(event.endTime)}
                        </div>
                        <div className="event-title">{event.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Morning indicator */}
        <div className="morning-indicator">
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="calendar-sidebar">
        <div className="small-calendar-section">
          <div className="small-calendar-header">
            <h3>{miniCalendarLabel}</h3>
            <div className="small-calendar-arrows">
              <button type="button" className="small-calendar-arrow-button" onClick={handlePrevMonth} aria-label="Previous month">
                <ChevronLeft size={14} />
              </button>
              <button type="button" className="small-calendar-arrow-button" onClick={handleNextMonth} aria-label="Next month">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="mini-calendar">
            <div className="mini-calendar-header">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </div>
            <div className="mini-calendar-days">
              {[...Array(firstWeekdayMondayIndex)].map((_, i) => (
                <span key={`empty-${i}`} className="empty-day" />
              ))}
              {[...Array(daysInActiveMonth)].map((_, i) => {
                const day = i + 1;
                const date = new Date(activeYear, activeMonth, day);
                const isCurrent = isToday(date);
                const isSelected = toLocalDateKey(date) === selectedDateKey;
                const dayOfWeek = date.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`mini-day ${isCurrent ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sidebar-section selected-day-section">
          <div className="selected-day-header">
            <h3>Selected day</h3>
            <span>{selectedDateLabel}</span>
          </div>
          <div className="selected-day-events">
            {selectedDayEvents.length ? selectedDayEvents.map((event) => (
              <div key={event.id} className="selected-day-event" style={{ borderLeftColor: event.color }}>
                <div className="selected-day-event-time">{formatTime12Hour(event.startTime)} - {formatTime12Hour(event.endTime)}</div>
                <div className="selected-day-event-title">{event.title}</div>
                <div className="selected-day-event-actions">
                  <button type="button" className="event-action-button" onClick={() => handleEditEvent(event)}>Edit</button>
                  <button type="button" className="event-action-button danger" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                </div>
              </div>
            )) : (
              <div className="selected-day-empty">No meetings scheduled for this date.</div>
            )}
          </div>
        </div>

      </div>

      {isScheduleModalOpen ? (
        <div className="schedule-modal-backdrop" onClick={handleCloseScheduleModal}>
          <div className="schedule-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="schedule-modal-header">
              <div>
                <h3>{editingEventId ? 'Update schedule item' : 'Add schedule item'}</h3>
                <p>{formatLongDate(draftEvent.date)} - {formatTime12Hour(draftEvent.startTime)} to {formatTime12Hour(draftEvent.endTime)}</p>
              </div>
              <button
                type="button"
                className="schedule-modal-close"
                onClick={handleCloseScheduleModal}
                aria-label="Close schedule dialog"
              >
                <X size={16} />
              </button>
            </div>

            <form className="schedule-modal-form" onSubmit={handleAddEvent}>
              <input
                type="text"
                className="add-people-input"
                value={draftEvent.title}
                onChange={(event) => handleDraftChange('title', event.target.value)}
                placeholder="Event title"
                autoFocus
              />

              <div className="schedule-inline-row">
                <input
                  type="date"
                  className="schedule-input"
                  value={draftEvent.date}
                  onChange={(event) => handleDraftChange('date', event.target.value)}
                />
                <input
                  type="time"
                  className="schedule-input"
                  value={draftEvent.startTime}
                  onChange={(event) => handleDraftChange('startTime', event.target.value)}
                />
                <input
                  type="time"
                  className="schedule-input"
                  value={draftEvent.endTime}
                  onChange={(event) => handleDraftChange('endTime', event.target.value)}
                />
              </div>

              <div className="schedule-inline-row schedule-modal-actions-row">
                <select
                  className="schedule-input"
                  value={draftEvent.category}
                  onChange={(event) => handleDraftChange('category', event.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button type="button" className="schedule-cancel-button" onClick={handleCloseScheduleModal}>Cancel</button>
                <button type="submit" className="schedule-submit-button" disabled={!canAddEvent}>
                  {editingEventId ? 'Update event' : 'Add event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WorkCalendarTab;
