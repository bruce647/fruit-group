import React, { useState, useCallback, useMemo } from "react";
import { Fruit } from "../types/Fruit";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { GroupByOption } from "./GroupSelector";
import { cn } from "@/lib/utils";

interface FruitTableProps {
  fruits: Fruit[];
  groupBy: GroupByOption;
  addFruitToJar: (fruit: Fruit) => void;
  className?: string;
}

/**
 * A responsive table component displaying fruits with grouping capabilities.
 *
 * @param props Component props
 * @param props.fruits - Array of fruits to display
 * @param props.groupBy - Grouping category
 * @param props.addFruitToJar - Callback when adding fruit to jar
 * @param props.className - Additional CSS classes
 */
const FruitTable: React.FC<FruitTableProps> = ({
  fruits,
  groupBy,
  addFruitToJar,
  className = "",
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());

  // Memoized grouped fruits calculation
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

  // Handle group toggle
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

  // Handle adding fruit with animation
  const handleAddFruit = useCallback(
    (fruit: Fruit) => {
      addFruitToJar(fruit);
      setRecentlyAdded((prev) => {
        const newSet = new Set(prev);
        newSet.add(fruit.name);
        setTimeout(() => {
          setRecentlyAdded((current) => {
            const updated = new Set(current);
            updated.delete(fruit.name);
            return updated;
          });
        }, 500);
        return newSet;
      });
    },
    [addFruitToJar]
  );

  // Handle adding all fruits in a group
  const handleAddAllFruits = useCallback(
    (groupFruits: Fruit[], event: React.MouseEvent) => {
      event.stopPropagation();
      groupFruits.forEach(handleAddFruit);
    },
    [handleAddFruit]
  );

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[150px]">Family</TableHead>
            <TableHead className="w-[150px]">Order</TableHead>
            <TableHead className="w-[150px]">Genus</TableHead>
            <TableHead className="w-[100px] text-right">Calories</TableHead>
            <TableHead className="w-[120px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedFruits).map(([group, groupFruits]) => (
            <React.Fragment key={group}>
              {group !== "All" && (
                <TableRow
                  className={cn(
                    "group cursor-pointer transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                  onClick={(e) => toggleGroup(group, e)}
                >
                  <TableCell
                    colSpan={5}
                    className="font-medium"
                    role="button"
                    aria-expanded={!collapsedGroups.has(group)}
                  >
                    <div className="flex items-center gap-2">
                      {collapsedGroups.has(group) ? (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                      <span>
                        {group}{" "}
                        <span className="text-sm text-gray-500">
                          ({groupFruits.length})
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => handleAddAllFruits(groupFruits, e)}
                      size="sm"
                      variant="outline"
                      className="w-full "
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add All
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {!collapsedGroups.has(group) &&
                groupFruits.map((fruit) => (
                  <TableRow
                    key={fruit.id}
                    className={cn(
                      "transition-colors",
                      recentlyAdded.has(fruit.name) &&
                        "bg-green-50/50 dark:bg-green-900/20",
                      "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <TableCell className="font-medium">{fruit.name}</TableCell>
                    <TableCell>{fruit.family}</TableCell>
                    <TableCell>{fruit.order}</TableCell>
                    <TableCell>{fruit.genus}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fruit.nutritions.calories}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleAddFruit(fruit)}
                        size="sm"
                        variant="ghost"
                        className="w-full "
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FruitTable;
