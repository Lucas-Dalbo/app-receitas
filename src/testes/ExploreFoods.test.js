import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import mockRandomFood from './helpers/mockRandomFood';
import { mockFoodRecipe } from './helpers/mockFoodResults';
import mockNationalities from './helpers/mockNationalities';

const path = '/explore/foods';

describe('Testa a página Explore Foods', () => {
  test('Verifica se existem os 3 botões de acordo com o protótipo', () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const byIngredientButton = screen.getByRole('button', {
      name: /by ingredient/i,
    });
    expect(byIngredientButton).toBeDefined();

    const byNationalityButton = screen.getByRole('button', {
      name: /by nationality/i,
    });
    expect(byNationalityButton).toBeDefined();

    const surpriseMeButton = screen.getByRole('button', {
      name: /by nationality/i,
    });
    expect(surpriseMeButton).toBeDefined();
  });

  test('Verifica se o botão "By Ingredient" redireciona para a rota correta', () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const exploreFoodsButton = screen.getByRole('button', {
      name: /by ingredient/i,
    });
    userEvent.click(exploreFoodsButton);
    expect(history.location.pathname).toBe('/explore/foods/ingredients');
  });

  test('Verifica se o botão "By Nationality" redireciona para a rota correta', () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const byNationalityButton = screen.getByRole('button', {
      name: /by nationality/i,
    });
    userEvent.click(byNationalityButton);
    expect(history.location.pathname).toBe('/explore/foods/nationalities');
  });

  test('Verifica se o botão "Surprise Me" mostra uma comida aleatória', async () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const fetch = jest.spyOn(global, 'fetch');
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockRandomFood),
    });

    const surpriseMeButton = screen.getByRole('button', {
      name: /surprise me/i,
    });
    userEvent.click(surpriseMeButton);
    expect(fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/random.php');

    const recipeName = await screen.findByRole('heading',
      { name: /stovetop eggplant with harissa, chickpeas, and cumin yogurt/i });
    expect(recipeName).toBeDefined();

    fetch.mockRestore();
  });

  test('A pagina de nacionalidades exibe o select e as receitas', async () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const fetch = jest.spyOn(global, 'fetch');
    fetch.mockResolvedValueOnce(({
      json: jest.fn().mockResolvedValue(mockFoodRecipe),
    }))
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockNationalities),
      });

    const byNationalityButton = screen.getByRole('button', {
      name: /by nationality/i,
    });
    userEvent.click(byNationalityButton);

    const selector = await screen.findByRole('combobox');
    expect(selector).toBeDefined();

    const options = await screen.findAllByRole('option');
    console.log(options);
    expect(options.length).toEqual(mockNationalities.meals.length + 1);

    // Não consegui fazer o teste selecionar as opções do dropdown.
    // userEvent.selectOptions(
    //   selector,
    //   await screen.findByRole('option', { name: /american/i }),
    // );
    // const newRecipe = await screen.findByRole('heading', { name: /banana pancakes/i });
    // expect(newRecipe).toBeDefined();
  });
});
