import React, { useState, useCallback, useMemo } from "react";
import { Fruit } from "../types/Fruit";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { GroupByOption } from "./GroupSelector";

interface FruitListProps {
  fruits: Fruit[];
  groupBy: GroupByOption;
  addFruitToJar: (fruit: Fruit) => void;
  className?: string;
}

/**
 * A collapsible list of fruits that can be grouped by taxonomic categories.
 *
 * @param props Component props
 * @param props.fruits - Array of fruits to display
 * @param props.groupBy - Grouping category
 * @param props.addFruitToJar - Callback when adding fruit to jar
 * @param props.className - Additional CSS classes
 */
const FruitList: React.FC<FruitListProps> = ({
  fruits,
  groupBy,
  addFruitToJar,
  className = "",
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());

  const groupedFruits = useMemo(() => {
    if (groupBy === "None") {
      return { All: fruits };
    }

    return fruits.reduce((groups, fruit) => {
      const key = String(fruit[groupBy.toLowerCase() as keyof Fruit]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(fruit);
      return groups;
    }, {} as Record<string, Fruit[]>);
  }, [fruits, groupBy]);

  const toggleGroup = useCallback((group: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  }, []);

  const handleAddFruit = useCallback(
    (fruit: Fruit) => {
      addFruitToJar(fruit);
      setRecentlyAdded((prev) => {
        const newSet = new Set(prev);
        newSet.add(fruit.id);
        setTimeout(() => {
          setRecentlyAdded((current) => {
            const updated = new Set(current);
            updated.delete(fruit.id);
            return updated;
          });
        }, 500);
        return newSet;
      });
    },
    [addFruitToJar]
  );

  const handleAddAllFruits = useCallback(
    (fruits: Fruit[], event: React.MouseEvent) => {
      event.stopPropagation();
      fruits.forEach((fruit) => {
        handleAddFruit(fruit);
      });
    },
    [handleAddFruit]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(groupedFruits).map(([group, groupFruits]) => (
        <div
          key={group}
          className="border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          <div
            className={`
              bg-gray-50 dark:bg-gray-800
              flex items-center justify-between
              px-4 py-3 
              cursor-pointer
              transition-colors duration-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              ${group === "All" ? "rounded-t-lg" : ""}
            `}
            onClick={(e) => toggleGroup(group, e)}
            role="button"
            tabIndex={0}
            aria-expanded={!collapsedGroups.has(group)}
          >
            <div className="flex items-center space-x-2">
              {group !== "All" && (
                <span className="text-gray-500">
                  {collapsedGroups.has(group) ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              )}
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {group}{" "}
                <span className="text-sm text-gray-500">
                  ({groupFruits.length})
                </span>
              </h3>
            </div>
            {group !== "All" && (
              <Button
                onClick={(e) => handleAddAllFruits(groupFruits, e)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Add All to Jar
              </Button>
            )}
          </div>

          <div
            className={`
              transition-all duration-200
              ${collapsedGroups.has(group) ? "hidden" : ""}
            `}
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {groupFruits.map((fruit) => (
                <div
                  key={fruit.id}
                  className={`
                    flex items-center justify-between
                    px-4 py-3
                    bg-white dark:bg-gray-900
                    transition-all duration-200
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    ${
                      recentlyAdded.has(fruit.id)
                        ? "bg-green-50 dark:bg-green-900/20"
                        : ""
                    }
                  `}
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {fruit.name}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {fruit.nutritions.calories} calories per 100g
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddFruit(fruit)}
                    size="sm"
                    variant="ghost"
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Jar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FruitList;
