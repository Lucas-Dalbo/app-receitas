import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RecipeContext from '../provider/RecipesContext';

function Login({ history }) {
  const { loginData, handleChange } = useContext(RecipeContext);
  const { email, password } = loginData;

  const disabledBtn = () => {
    const validateEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
    const PASSWORD_LENGTH = 6;
    if (validateEmail.test(email) && password.length > PASSWORD_LENGTH) {
      return false;
    }
    return true;
  };

  const handleClick = (e) => {
    e.preventDefault();
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('cocktailsToken', '1');
    const user = {
      email,
    };
    localStorage.setItem('user', JSON.stringify(user));
    history.push('/foods');
  };

  return (
    <form>
      <label htmlFor="email">
        <input
          name="email"
          value={ email }
          onChange={ handleChange }
          type="email"
          id="email"
          placeholder="E-mail"
          data-testid="email-input"
        />
      </label>
      <label htmlFor="password">
        <input
          name="password"
          value={ password }
          onChange={ handleChange }
          type="password"
          id="password"
          placeholder="Password"
          data-testid="password-input"
        />
      </label>
      <button
        type="submit"
        data-testid="login-submit-btn"
        disabled={ disabledBtn() }
        onClick={ handleClick }
      >
        Enter
      </button>
    </form>
  );
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default Login;
