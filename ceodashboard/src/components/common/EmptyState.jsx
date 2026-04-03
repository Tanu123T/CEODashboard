import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title, description }) => {
  return (
    <div className="empty-state-wrap">
      <Inbox size={44} />
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default EmptyState;
