import './styles/App.css';
import MapComponent from './MapComponent.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <MapComponent />
      </main>
    </div>
  );
};

export default App;
