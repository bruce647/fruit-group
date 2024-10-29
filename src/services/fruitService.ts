import { Fruit } from "../types/Fruit";

/**
 * Fetches a list of fruits from the local JSON data file.
 *
 * @returns {Promise<Fruit[]>} A promise that resolves to an array of Fruit objects.
 * @throws Will throw an error if the request fails.
 */
export const getFruits = async (): Promise<Fruit[]> => {
  try {
    //vite dynamic import
    const fruits = await import("../data/fruits.json");
    return fruits.default;
  } catch (error) {
    console.error("Error fetching fruits:", error);
    throw error;
  }
};
