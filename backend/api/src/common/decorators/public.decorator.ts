import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marca un endpoint como público (no requiere JWT).
// Por defecto el guard global protege TODO; con esto se hace opt-out.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
