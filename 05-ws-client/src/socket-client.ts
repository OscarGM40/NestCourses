import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (jwtToken: string) => {
  // me conecto a la URL que me ofrecieron
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js",{
    extraHeaders:{
      authentication: jwtToken
    }
  });
  // nos conectamos al namespace '/' que es el por defecto y metemos la conexión en una variable
  socket?.removeAllListeners();
  socket = manager.socket("/");
  // console.log({socket});
  // ojo que no vaya socket por referencia que apunta al anterior
  addListeners();
};

const addListeners = () => {
  // accesing DOM
  const serverStatusLabel = document.querySelector("#server-status")!;
  const clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  // on para escuchar al server,emit para emitir al server
  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    // console.log({ clients });
    let clientsHtml = "";
    clients.forEach((clientId: string) => {
      clientsHtml += `
      <li>${clientId}</li>`;
    });
    clientsUl.innerHTML = clientsHtml;
  });

  messageForm.addEventListener("submit", (event) => {
    event?.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client", {
      id: "yo!",
      message: messageInput.value,
    });
    messageInput.value="";
  });

  socket.on("message-from-server", (payload: { fullName: string; message: string }) => {
    const newMessage = `
    <li>
      <strong>${payload.fullName}</strong>
      <span>${payload.message}</span>
    </li>`;
    const li = document.createElement("li");
    li.innerHTML = newMessage;
    messagesUl.appendChild(li);
  });
};
