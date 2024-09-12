import axios from 'axios';
import _ from 'lodash';

export function ottieniLibriCategoria(categoria) {
  const url = `https://openlibrary.org/subjects/${categoria}.json`;
  return axios.get(url).then(response => _.get(response.data, 'works', []));
}

export function ottieniDettagliLibro(chiaveLibro) {
  const url = `https://openlibrary.org${chiaveLibro}.json`;
  return axios.get(url);
}