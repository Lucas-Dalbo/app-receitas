import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import mockRandomDrink from './helpers/mockRandomDrink';
import mockDrinksIngredients from './helpers/mockDrinksIngredients';

const path = '/explore/drinks';
const URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const LENGTH = 12;

describe('Testa a página Explore Drinks', () => {
  test('Verifica se existem os 2 botões de acordo com o protótipo', () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const byIngredientButton = screen.getByRole('button', {
      name: /by ingredient/i,
    });
    expect(byIngredientButton).toBeDefined();

    const surpriseMeButton = screen.getByRole('button', {
      name: /surprise me/i,
    });
    expect(surpriseMeButton).toBeDefined();
  });

  test('Verifica se o botão "By Ingredient" redireciona para a rota correta', () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const ingredientBtn = screen.getByRole('button', {
      name: /by ingredient/i,
    });
    userEvent.click(ingredientBtn);
    expect(history.location.pathname).toBe('/explore/drinks/ingredients');
  });

  test('Verifica se o botão "Surprise Me" redireciona para uma comida aleatória', () => {
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const fetch = jest.spyOn(global, 'fetch');
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockRandomDrink),
    });

    const surpriseMeButton = screen.getByRole('button', {
      name: /surprise me/i,
    });
    userEvent.click(surpriseMeButton);
    expect(fetch).toBeCalledWith(URL);

    setTimeout(() => {
      expect(history.location.pathname).toMatch('/drinks/17120');
    });

    fetch.mockRestore();
  });

  test('A tela de explorar por ingrediente exibe os ingredientes', async () => {
    const fetch = jest.spyOn(global, 'fetch');
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockDrinksIngredients),
    });
    const { history } = renderWithRouter(<App />);
    history.push(path);

    const byIngredientButton = screen.getByRole('button', {
      name: /by ingredient/i,
    });
    userEvent.click(byIngredientButton);

    const ingredientList = await screen.findAllByRole('img');
    expect(ingredientList.length).toBe(LENGTH);

    const rumBtn = await screen.findByRole('heading', {
      name: /light rum/i,
    });

    userEvent.click(rumBtn);
    expect(fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Light rum');
  });
});
