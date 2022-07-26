import axios from "axios";

export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
}

export class PokeApiFetchAdapter implements HttpAdapter {
  private static instance: PokeApiFetchAdapter;

  private constructor() {}

  public static getInstance(): PokeApiFetchAdapter {
    if (!this.instance) {
      this.instance = new PokeApiFetchAdapter();
    }
    return this.instance;
  }

  async get<T>(url: string): Promise<T> {
    console.log('fetching with fetch API')
    const resp = await fetch(url);
    // lamentablemente no puede hacerse resp.json<T>(),luego hay que tipar la constante donde almacene el retorno del json()
    const data: T = await resp.json();
    return data;
  }
}

export class PokeApiAxiosAdapter implements HttpAdapter {
  private static instance: PokeApiAxiosAdapter;
  private readonly axios = axios;

  private constructor() {}

  public static getInstance(): PokeApiAxiosAdapter {
    if (!this.instance) {
      this.instance = new PokeApiAxiosAdapter();
    }
    return this.instance;
  }

  async get<T>(url: string) {
    console.log('fetching with axios library')
    const { data } = await this.axios.get<T>(url);
    return data;
  }

}
