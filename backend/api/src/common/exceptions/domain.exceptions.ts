import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';

// Errores propios del dominio. Heredan de HttpException para que el filtro
// global los entienda y devuelva el status code correcto.

export class StockInsuficienteException extends ConflictException {
  constructor(productName: string, available: number) {
    super(`Stock insuficiente para "${productName}". Disponible: ${available} unidades.`);
  }
}

export class InvalidStateTransitionException extends BadRequestException {
  constructor(from: string, to: string) {
    super(`No se puede pasar de "${from}" a "${to}".`);
  }
}

export class ProductExpiredException extends BadRequestException {
  constructor(productName: string) {
    super(`El producto "${productName}" está vencido y no puede usarse en pedidos.`);
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Correo o contraseña incorrectos');
  }
}

export class InvalidOrExpiredTokenException extends UnauthorizedException {
  constructor() {
    super('Este enlace ha expirado o ya fue usado');
  }
}
