import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to our Blog API!',
      date: new Date().toISOString(),
    };
  }
}
