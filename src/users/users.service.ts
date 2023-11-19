import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity'; // Import UserRole enum
import { AuthCredentialsDto } from '../auth/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createUser(authCredentialsDto: AuthCredentialsDto, role: UserRole): Promise<User> {
    const { email, password } = authCredentialsDto;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
  
    return this.userRepository.save(user);  
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
