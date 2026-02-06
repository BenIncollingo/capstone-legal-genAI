import "./DataButton.css";
import { testData } from "../api/data.api";

export default function DataButton() {
  const handleClick = async () => {
    try {
      const data = await testData(); // already JSON
      console.log("Backend response:", data);
    } catch (err) {
      console.error("Frontend Error:", err.message);
    }
  };

  return (
    <button className="data-button" onClick={handleClick}>
      Call Backend Test
    </button>
  );
}
