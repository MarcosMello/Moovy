export class AuthResponseDto {
  token: string;
  expiresIn: number;
}

export class LoggedUserDto {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}
