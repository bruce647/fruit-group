import axios from "axios";
import { Fruit } from "../types/Fruit";

const API_URL =
  "https://wcz3qr33kmjvzotdqt65efniv40kokon.lambda-url.us-east-2.on.aws/";

/**
 * Fetches a list of fruits from the local JSON data file.
 *
 * @returns {Promise<Fruit[]>} A promise that resolves to an array of Fruit objects.
 * @throws Will throw an error if the request fails.
 */
export const getFruits = async (): Promise<Fruit[]> => {
  try {
    const response = await axios.get("src/data/fruits.json");
    return response.data;
  } catch (error) {
    console.error("Error fetching fruits:", error);
    throw error;
  }
};
