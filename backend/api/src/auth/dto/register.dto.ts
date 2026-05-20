import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 120)
  fullName!: string;

  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  // Mínimo 8 caracteres, al menos una letra y un número.
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message: 'La contraseña debe tener mínimo 8 caracteres, una letra y un número',
  })
  password!: string;
}
