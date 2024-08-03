import "./App.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import Home from "./Components/Home";

function App() {
  return (
    <div className="app">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <h1>Google maps Project</h1>
        <Home />
      </APIProvider>
    </div>
  );
}

export default App;
