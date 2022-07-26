import { charmander } from "./bases/06-decorators-@deprecated";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello ${charmander.name}</h1>
`;
