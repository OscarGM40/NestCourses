export const name = "Fernando";
export const age = 35;
export const isValid = true;

export const templateString = ` Esto es un string
multilinea
que puede tener
" dobles
' simples
inyectar valores ${name}
expresiones ${1 + 1}
numeros: ${age}
boleanos: ${isValid}
`;
console.log(templateString)
