import React, { useState } from "react";
import { Fruit } from "../types/Fruit";
import FruitList from "./FruitList";
import FruitTable from "./FruitTable";
import GroupSelector, { GroupByOption } from "./GroupSelector";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

type ViewType = "List" | "Table";

interface FruitExplorerProps {
  fruits: Fruit[];
  onAddFruit: (fruit: Fruit) => void;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

/**
 * A component that displays a list of fruits in either a list or table format,
 * with options to group fruits by different taxonomic categories.
 *
 * @param props Component props
 * @param props.fruits - Array of fruits to display
 * @param props.onAddFruit - Callback when a fruit is added to the jar
 * @param props.isLoading - Loading state indicator
 * @param props.error - Error object if any error occurred
 * @param props.className - Additional CSS classes
 */
export const FruitExplorer: React.FC<FruitExplorerProps> = ({
  fruits,
  onAddFruit,
  isLoading = false,
  error = null,
  className = "",
}) => {
  const [groupBy, setGroupBy] = useState<GroupByOption>("None");
  const [viewType, setViewType] = useState<ViewType>("List");

  // 错误处理
  if (error) {
    return (
      <Card className={`bg-red-50 ${className}`}>
        <CardContent className="p-4">
          <p className="text-red-600">Error loading fruits: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const toggleViewType = () => {
    setViewType((current) => (current === "List" ? "Table" : "List"));
  };

  // 加载状态样式
  const contentStyles = isLoading ? "opacity-50 pointer-events-none" : "";

  return (
    <Card className={`mb-8 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Fruit Explorer</CardTitle>
          <div className="flex flex-wrap space-x-2">
            <GroupSelector
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              disabled={isLoading}
              className="mr-2"
            />
            <Button
              onClick={toggleViewType}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              {viewType === "List" ? (
                <>
                  <Table className="w-4 h-4" />
                  <span>Table View</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4" />
                  <span>List View</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`pt-4 ${contentStyles}`}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : fruits.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No fruits available
          </div>
        ) : (
          <div className="transition-all duration-200">
            {viewType === "List" ? (
              <FruitList
                fruits={fruits}
                groupBy={groupBy}
                addFruitToJar={onAddFruit}
              />
            ) : (
              <FruitTable
                fruits={fruits}
                groupBy={groupBy}
                addFruitToJar={onAddFruit}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FruitExplorer;
