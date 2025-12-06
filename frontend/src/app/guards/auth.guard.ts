import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard = () => {
  // Inyectamos los servicios necesarios
  const userService = inject(UserService);
  const router = inject(Router);

  // Preguntamos al servicio si hay un usuario logueado
  const identity = userService.getIdentity();

  if (identity) {
    // Si existe la identidad, ¡PASE ADELANTE!
    return true;
  } else {
    // Si no hay identidad, ¡AL LOGIN!
    router.navigate(['/login']);
    return false;
  }
};