import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  let router = inject(Router)
  var islogedin = localStorage.getItem('isloged');

  if(islogedin == 'false'){
    alert('Not authenticated user!');
    router.navigate(['/auth']);
    return false;
  }
  return true;
};
