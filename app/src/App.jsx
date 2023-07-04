import './App.css';
import Fundo from './Fundo/Fundo';
import Principal from './Principal/Principal';
import Dashboard from './Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Fundo /> 
        
        <main>
          <Principal />
          <Dashboard />
        </main>
    </div>
  );
}

export default App;
