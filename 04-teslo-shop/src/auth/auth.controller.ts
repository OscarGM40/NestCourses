import { Body, Controller, Get, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { RawHeaders } from './decorators/get-headers.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req()request: Express.Request <-forma prehistoric
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() headers: string[],
  ) {
    // console.log(request.user) <- Forma no recomendada
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      headers,
    };
  }

  @Get('private2')
  // @SetMetadata('roles',['admin','superuser'])
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.user)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
