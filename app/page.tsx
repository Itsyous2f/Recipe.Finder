"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  let [recipeName, setRecipeName] = useState("");
  type Recipe = {
    title: string;
    thumbnail?: string;
    description?: string;
    [key: string]: any;
  };

  let [recipes, setRecipes] = useState<Recipe[]>([]);
  let apiKey = process.env.RECIPE_KEY;

  let fetchRecipes = async (query: string) => {
    let api_url = `https://api.api-ninjas.com/v1/recipe?query=${query}`;
    try {
      let response = await fetch(api_url, {
        headers: {
          "X-Api-Key": apiKey || "",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json();
      setRecipes(data);

      console.log("Fetched recipes:", data);
    }
    catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    }
  }

  return (
    <div>
      <nav className="p-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold font-sans mb-2">Search it, make it, eat it.</h2>
        <Input placeholder="Search recipes..." 
          className="outline-none"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchRecipes(recipeName);
            }
          }}
        />
      </nav>

      <div className="grid grid-cols-3 gap-4 p-4">
        {recipes.map((recipe, index) => (
          <Card key={index} className="max-w-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold">Ingredients:</h3>
              <p>{recipe.ingredients || "No ingredients available."}</p>

              <h3 className="font-bold">Instructions:</h3>
              <p>{recipe.instructions || "No instructions available."}</p>

              <h4 className="font-bold">{recipe.servings || "1 serving"}</h4>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
