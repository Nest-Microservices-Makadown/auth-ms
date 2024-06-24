import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to mongo database for AUTH...');
  }
  async verifyUser(token: string) {
    try {
      const {sub, iat, exp, ...user} = await this.jwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });
      return {
        user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }
  async loginUser(loginUserDto: LoginUserDto) {
    const { email,  password: plainPassword } = loginUserDto;

    try{

      const user = await this.user.findUnique({
        where: {
          email: email
        }
      });

      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'Bad credentials'
        });
      }

      const isPasswordValid = bcrypt.compareSync(plainPassword, user.password);
      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'Bad credentials'
        });
      }

      const { password: __, ...userWithoutPass } = user;

      return {
        user: userWithoutPass,
        token: await this.signJWT(userWithoutPass)
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }
  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    try{

      const user = await this.user.findUnique({
        where: {
          email: email
        }
      });

      if (user) {
        throw new RpcException({
          status: 400,
          message: 'User already exists'
        });
      }

      const newUser = await this.user.create({
        data: {
          name: name,
          email: email,
          password: bcrypt.hashSync(password, 10)
        }
      });

      const { password: __, ...newUserWithoutPass } = newUser;

      return {
        user: newUserWithoutPass,
        token: await this.signJWT(newUserWithoutPass)
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }
}
