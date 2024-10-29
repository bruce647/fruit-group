import { useEffect, useState } from "react";
import { getFruits } from "./services/fruitService";
import { Fruit } from "./types/Fruit";
import Jar from "./components/Jar";
import { FruitJarDialog } from "./components/FruitJarDialog";
import { FruitExplorer } from "./components/FruitExplorer";
import { Card } from "./components/ui/card";

const MAX_FRUITS = 15;

const App = () => {
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [jar, setJar] = useState<Fruit[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const fetchedFruits = await getFruits();
        setFruits(fetchedFruits);
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    };
    fetchFruits();
  }, []);

  const addFruitToJar = (fruit: Fruit) => {
    setJar((prev) => {
      if (prev.length >= MAX_FRUITS) {
        return [...prev.slice(1), fruit];
      }
      return [...prev, fruit];
    });
    setIsLimitReached(false);
    setSelectedFruit(null);
  };

  const handleAddFruit = (fruit: Fruit) => {
    if (jar.length < MAX_FRUITS) {
      addFruitToJar(fruit);
    } else {
      setSelectedFruit(fruit);
      setIsLimitReached(true);
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-100 p-8">
      <div className="w-full px-4 py-8">
        <FruitJarDialog
          isOpen={isLimitReached}
          onOpenChange={setIsLimitReached}
          maxFruits={MAX_FRUITS}
          selectedFruit={selectedFruit}
          onConfirm={() => selectedFruit && addFruitToJar(selectedFruit)}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <FruitExplorer fruits={fruits} onAddFruit={handleAddFruit} />
          </div>

          <div className="w-full lg:w-1/4">
            <Card className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Your Jar
              </h2>
              <Jar jar={jar} />
              <div className="mt-4 text-sm text-gray-600">
                {jar.length}/{MAX_FRUITS} fruits
              </div>
            </Card>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 lg:hidden">
          <button
            onClick={() => setIsMobileView(!isMobileView)}
            className="bg-blue-500 text-white rounded-full p-4 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Jar View */}
        {isMobileView && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 lg:hidden">
            <div className="bg-white rounded-t-xl fixed bottom-0 left-0 right-0 p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Jar</h2>
                <button
                  onClick={() => setIsMobileView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <Jar jar={jar} />
              <div className="mt-4 text-sm text-gray-600">
                {jar.length}/{MAX_FRUITS} fruits
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
