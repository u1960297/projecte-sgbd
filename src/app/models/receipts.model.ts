import { Ingredients } from "./ingredients.model";

export class Receipts {
    id?: number;
    name?: string;
    description?: string;
    ingredients?: Ingredients[];
    difficulty?: string;
    time?: string;
    image?: string;
}