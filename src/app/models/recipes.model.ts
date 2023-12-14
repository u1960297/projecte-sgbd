import { Ingredients } from "./ingredients.model";

export class Recipes {
    id?: string;
    name?: string;
    description?: string;
    steps?: string;
    ingredients?: Ingredients[];
    difficulty?: string;
    time?: string;
    image?: string;
    authorid?: string;
}