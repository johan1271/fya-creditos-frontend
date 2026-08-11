import { LoginResponseDto } from '../models/auth-dto.model';
import { AuthUser } from '../models/auth.model';

export function toAuthUser(dto: LoginResponseDto): AuthUser {
  return {
    username: dto.username,
    fullName: dto.fullName,
  };
}
