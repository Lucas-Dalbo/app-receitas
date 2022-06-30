async function requestApi(endPointApi) {
  try {
    const response = await fetch(endPointApi);
    const data = await response.json();
    console.log(data);
    return Object.values(data)[0];
  } catch (error) {
    console.log('Erro de Requisição', error);
    return error;
  }
}

export default requestApi;
