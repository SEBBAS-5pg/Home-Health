import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(20)
  @MaxLength(255)
  token!: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message: 'La contraseña debe tener mínimo 8 caracteres, una letra y un número',
  })
  newPassword!: string;
}
