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
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleClick}>
      Call Backend Test
    </button>
  );
}
