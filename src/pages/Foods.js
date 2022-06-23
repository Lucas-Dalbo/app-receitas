import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecipeContext from '../provider/RecipesContext';
import CardsRecipe from '../components/CardsRecipe';

function Foods() {
  const { cardsRecipes, dataApi } = useContext(RecipeContext);
  return (
    <div>
      <Header pageName="Foods" />
      {
        cardsRecipes && dataApi.meals.map((recipes, index) => {
          const NUMBER_TWELVE = 12;
          if (index >= NUMBER_TWELVE) return null;
          return (
            <CardsRecipe
              key={ index }
              recipes={ recipes }
              index={ index }
              type="foods"
            />);
        })
      }
      <Footer />
    </div>
  );
}

export default Foods;
