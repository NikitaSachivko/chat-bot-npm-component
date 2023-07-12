import './App.css'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ChatBot token={"5d0f0082f09cc8f848151585c1eccfdc0a0dbd952e229dae6ba92e25fca8597a"} />
      </header>
    </div>
  )
}

export default App
