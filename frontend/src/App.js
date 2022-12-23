import "./app.css";
import Layout from "./components/Layout/Layout";
import { NFTProvider } from "./context/NFTContext";

function App() {
  return (
    <NFTProvider>
      <Layout />
    </NFTProvider>
  );
}

export default App;
