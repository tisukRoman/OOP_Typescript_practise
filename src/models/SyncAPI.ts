import axios, { AxiosPromise } from 'axios';

interface HasId {
  id?: number;
}

export class SyncAPI<T extends HasId> {
  constructor(private rootURL: string) {}

  fetch = (id: number): AxiosPromise => {
    return axios.get(`${this.rootURL}/${id}`);
  };

  save = (data: T): AxiosPromise => {
    const id = data.id;
    return id
      ? axios.put(`${this.rootURL}/${id}`, data)
      : axios.post(`${this.rootURL}`, data);
  };
}
