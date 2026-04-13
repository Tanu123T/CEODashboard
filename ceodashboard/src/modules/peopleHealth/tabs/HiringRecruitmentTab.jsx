import React, { useMemo } from 'react';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const sortByName = (a, b) => a.name.localeCompare(b.name);

const buildHierarchy = (members) => {
  const tierTwo = members
    .filter((member) => {
      const role = member.role.toLowerCase();
      return role.includes('hr') || role.includes('manager');
    })
    .sort(sortByName);

  const tierTwoIds = new Set(tierTwo.map((member) => member.id));
  const tierThree = members.filter((member) => !tierTwoIds.has(member.id)).sort(sortByName);

  return {
    ceo: {
      name: 'Avery Morgan',
      role: 'Chief Executive Officer',
    },
    tierTwo,
    tierThree,
  };
};

const HiringRecruitmentTab = ({ members }) => {
  const hierarchy = useMemo(() => buildHierarchy(members), [members]);

  const handleOrgChartWheel = (event) => {
    const target = event.currentTarget;
    const shouldScrollHorizontally = Math.abs(event.deltaY) > Math.abs(event.deltaX);

    if (!shouldScrollHorizontally) {
      return;
    }

    target.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <div className="ph-tab-layout">
      <section className="ph-full-card">
        <PeopleHealthPanelCard
          title="Organization Hierarchy"
          subtitle="Hierarchy view with CEO, leadership, and staff cards"
        >
          <div className="ph-org-scroll-wrap" onWheel={handleOrgChartWheel} tabIndex={0} aria-label="Organization Hierarchy horizontally scrollable chart">
            <div className="ph-org-chart">
              <div className="ph-org-tier">
                <div className="ph-org-grid ph-org-grid-root">
                  <article className="ph-org-node ph-org-root">
                    <h6>{hierarchy.ceo.name}</h6>
                    <p>{hierarchy.ceo.role}</p>
                  </article>
                </div>
              </div>

              <div className="ph-org-tier ph-org-tier-linked">
                <div className="ph-org-grid ph-org-grid-linked" role="list" aria-label="Tier 2 hierarchy cards">
                  {hierarchy.tierTwo.map((member) => (
                    <article key={member.id} className="ph-org-node" role="listitem">
                      <h6>{member.name}</h6>
                      <p>{member.role}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="ph-org-tier ph-org-tier-linked">
                <div className="ph-org-grid ph-org-grid-linked" role="list" aria-label="Tier 3 hierarchy cards">
                  {hierarchy.tierThree.map((member) => (
                    <article key={member.id} className="ph-org-node" role="listitem">
                      <h6>{member.name}</h6>
                      <p>{member.role}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default HiringRecruitmentTab;
