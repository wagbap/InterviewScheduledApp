import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {ApiService } from 'src/app/services/api-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: ApiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userProfile = this.authService.getUserProfile();

    if (userProfile) {
      // Verifique o perfil do usuário e permita ou bloqueie a rota com base nisso
      if (userProfile === 'SuperAdmin' && route.data['requiredRole'] !== 'SuperAdmin') {
        this.router.navigate(['/sem-permissao']);
        return false;
      }

      if (userProfile === 'Aluno' && route.data['requiredRole'] !== 'Aluno') {
        this.router.navigate(['/sem-permissao']);
        return false;
      }

      // Se o perfil corresponder à rota ou se for uma rota pública, permita o acesso.
      return true;
    } else {
      // Se o perfil do usuário não estiver definido, redirecione para a página de login.
      this.router.navigate(['/login']);
      return false;
    }
  }
}
