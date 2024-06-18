import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  verifyUser() {
    return 'verifyUser';
  }
  loginUser() {
    return 'loginUser';
  }
  registerUser() {
    return 'registerUser';
  }
}
