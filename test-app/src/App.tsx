import React, { useState } from 'react';
import BasicExample from './examples/BasicExample';
import AdvancedExample from './examples/AdvancedExample';
import EventsExample from './examples/EventsExample';
import './App.css';

type ExampleType = 'basic' | 'advanced' | 'events';

const App: React.FC = () => {
  const [activeExample, setActiveExample] = useState<ExampleType>('basic');

  const renderExample = () => {
    switch (activeExample) {
      case 'basic':
        return <BasicExample />;
      case 'advanced':
        return <AdvancedExample />;
      case 'events':
        return <EventsExample />;
      default:
        return <BasicExample />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React ApexGantt Examples</h1>
        <p>Test various features of the React wrapper</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeExample === 'basic' ? 'active' : ''}
          onClick={() => setActiveExample('basic')}
        >
          Basic Example
        </button>
        <button
          className={activeExample === 'advanced' ? 'active' : ''}
          onClick={() => setActiveExample('advanced')}
        >
          Advanced Example
        </button>
        <button
          className={activeExample === 'events' ? 'active' : ''}
          onClick={() => setActiveExample('events')}
        >
          Events Example
        </button>
      </nav>

      <main className="app-content">
        {renderExample()}
      </main>
    </div>
  );
};

export default App;