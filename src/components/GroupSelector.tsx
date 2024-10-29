import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type GroupByOption = "None" | "Family" | "Order" | "Genus";

interface GroupSelectorProps {
  groupBy: GroupByOption;
  setGroupBy: (value: GroupByOption) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * A dropdown selector component for choosing how to group fruit data.
 *
 * @param props Component props
 * @param props.groupBy - Current grouping selection
 * @param props.setGroupBy - Callback function to update grouping selection
 * @param props.disabled - Optional flag to disable the selector
 * @param props.className - Optional additional CSS classes
 */
const GroupSelector: React.FC<GroupSelectorProps> = ({
  groupBy,
  setGroupBy,
  disabled = false,
  className = "",
}) => {
  const options: GroupByOption[] = ["None", "Family", "Order", "Genus"];

  return (
    <div className={`flex items-center gap-2  ${className}`}>
      <label
        htmlFor="group-selector"
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Group by:
      </label>
      <Select
        value={groupBy}
        onValueChange={(value: string) => setGroupBy(value as GroupByOption)}
        disabled={disabled}
      >
        <SelectTrigger
          id="group-selector"
          className="w-[180px] bg-white dark:bg-gray-800"
        >
          <SelectValue placeholder="Select a grouping" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-gray-600 dark:text-gray-300">
              Grouping Options
            </SelectLabel>
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupSelector;
