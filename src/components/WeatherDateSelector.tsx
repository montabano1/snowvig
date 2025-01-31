import React from 'react';
import '../styles/scrollbar.css';

interface ScrollContainerProps {
  children: React.ReactNode;
}

const ScrollContainer = ({ children }: ScrollContainerProps) => {
  return (
    <div style={{ position: 'relative', width: '100%'}}>
      <div 
        style={{ 
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          position: 'relative'
        }}
        className="scrollbar-hide"
      >
        <div style={{ 
          display: 'inline-flex',
          gap: '8px',
          padding: '8px',
          whiteSpace: 'nowrap'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

interface ScrollItemProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ScrollItem = ({ isSelected, onClick, children }: ScrollItemProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '8px 12px',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        fontSize: '14px',
        boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        background: isSelected ? '#2196f3' : 'white',
        color: isSelected ? 'white' : '#333',
        border: isSelected ? 'none' : '1px solid #e0e0e0',
      }}
    >
      {children}
    </button>
  );
};

interface WeatherDateSelectorProps {
  selectedDate: Date;
  dates: Date[];
  onDateSelect: (date: Date) => void;
}

const WeatherDateSelector: React.FC<WeatherDateSelectorProps> = ({
  selectedDate,
  dates,
  onDateSelect,
}) => {
  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dateNum = date.getDate();
    return `${day} ${month} ${dateNum}`;
  };

  return (
    <ScrollContainer>
      {dates.map((date) => (
        <ScrollItem
          key={date.toISOString()}
          isSelected={date.toDateString() === selectedDate.toDateString()}
          onClick={() => onDateSelect(date)}
        >
          {formatDate(date)}
        </ScrollItem>
      ))}
    </ScrollContainer>
  );
};

export default WeatherDateSelector;
