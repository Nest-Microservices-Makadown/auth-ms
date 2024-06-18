import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  verifyUser() {
    return 'verifyUser';
  }
  loginUser(loginUserDto: LoginUserDto) {
    return loginUserDto;
  }
  registerUser(registerUserDto: RegisterUserDto) {
    return registerUserDto;
  }
}
