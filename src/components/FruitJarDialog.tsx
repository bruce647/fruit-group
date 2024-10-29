import React from "react";
import { Fruit } from "../types/Fruit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FruitJarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  maxFruits: number;
  selectedFruit: Fruit | null;
  onConfirm: () => void;
}

/**
 * A dialog that is displayed when the user attempts to add a fruit to
 * their jar, but the jar is already at the maximum capacity.
 *
 * The dialog will display the name of the fruit that the user is trying
 * to add, and ask if they want to replace the oldest fruit in the jar
 * with the new fruit. If the user confirms, the onConfirm callback is
 * called.
 *
 * @param isOpen Whether the dialog is open
 * @param onOpenChange Called with the new value of isOpen when the user
 *                     opens or closes the dialog
 * @param maxFruits The maximum number of fruits that can fit in the jar
 * @param selectedFruit The fruit that the user is trying to add to the
 *                      jar
 * @param onConfirm Called when the user confirms that they want to
 *                  replace the oldest fruit in the jar with the new
 *                  fruit
 */
export const FruitJarDialog: React.FC<FruitJarDialogProps> = ({
  isOpen,
  onOpenChange,
  maxFruits,
  selectedFruit,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fruit Jar Limit Reached</AlertDialogTitle>
          <AlertDialogDescription>
            You have already added the maximum of {maxFruits} fruits to your
            jar. Would you like to replace the oldest fruit with{" "}
            {selectedFruit?.name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Replace</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
