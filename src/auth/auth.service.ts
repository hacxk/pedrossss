import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserService } from '../shared/service/user.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // To generate session IDs
import validator from 'validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto): Promise<{ accessToken: string, sessionId: string }> {
    if (!validator.isEmail(loginDto.email)) {
      throw new UnauthorizedException('Invalid email format');
    }
    if (!validator.isLength(loginDto.password, { min: 6 })) {
      throw new UnauthorizedException('Password must be at least 6 characters long');
    }

    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    const sessionId = uuidv4(); // Generate a new session ID

    // Store session ID in the database
    await this.userService.storeSession(user.id, sessionId);

    return { accessToken, sessionId };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    if (!validator.isEmail(registerDto.email)) {
      throw new ConflictException('Invalid email format');
    }
    if (!validator.isLength(registerDto.username, { min: 3 })) {
      throw new ConflictException('Username must be at least 3 characters long');
    }
    if (!validator.isLength(registerDto.password, { min: 6 })) {
      throw new ConflictException('Password must be at least 6 characters long');
    }

    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.userService.create({
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }
}
