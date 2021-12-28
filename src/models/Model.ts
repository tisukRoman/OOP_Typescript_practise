import { AxiosResponse, AxiosPromise } from 'axios';

type Callback = () => void;

interface HasId {
  id?: number;
}

interface Events {
  on: (eventName: string, callback: Callback) => void;
  trigger: (eventName: string) => void;
}

interface Sync<T> {
  fetch: (id: number) => AxiosPromise;
  save: (data: T) => AxiosPromise;
}

interface Attrs<T> {
  get: <K extends keyof T>(key: K) => T[K];
  getAll: () => T;
  set: (update: T) => void;
}

export class Model<T extends HasId> {
  constructor(
    private attributes: Attrs<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  on = this.events.on;
  trigger = this.events.trigger;
  set = this.attributes.set;

  async fetch() {
    try {
      const id = this.attributes.get('id');
      if (typeof id !== 'number') {
        throw new Error('id is required');
      }
      const response: AxiosResponse = await this.sync.fetch(id);
      this.set(response.data);
      this.trigger('change');
    } catch {
      this.trigger('error');
    }
  }

  async save() {
    try {
      const userData: T = this.attributes.getAll();
      await this.sync.save(userData);
      this.trigger('save');
    } catch {
      this.trigger('error');
    }
  }
}
