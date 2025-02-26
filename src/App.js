import PresupuestosTable from './Components/Table'; // Importing the Table component

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <PresupuestosTable /> {/* Adding the Table component */}
    </div>
  );
}

export default App;
