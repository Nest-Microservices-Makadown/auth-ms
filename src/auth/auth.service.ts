import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger(AuthService.name);

  constructor() {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to mongo database for AUTH...');
  }
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
