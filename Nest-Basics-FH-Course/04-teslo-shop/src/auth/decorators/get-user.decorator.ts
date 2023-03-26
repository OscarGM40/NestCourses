import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data:string,ctx:ExecutionContext) => {
    const isEmailArg = data === 'email';
    // obtener la request desde el contexto de ejecución de este decorador
    const req = ctx.switchToHttp().getRequest()
    const user = req.user;
    if(!user) throw new InternalServerErrorException(`User not found (request)`)

    return isEmailArg ? user.email : user;
  }
)