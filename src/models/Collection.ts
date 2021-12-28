import axios from 'axios';
import { Eventing } from './Eventing';

export class Collection<T, K> {
  private models: T[] = [];
  private events: Eventing = new Eventing();

  constructor(private rootURL: string, private deserializer: (json: K) => T) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  async fetch(): Promise<void> {
    try {
      await axios.get(this.rootURL).then((response) => {
        response.data.forEach((attrs: K) => {
          const user = this.deserializer(attrs);
          this.models.push(user);
        });
      });
      this.trigger('change');
    } catch {
      this.trigger('error');
    }
  }
}
