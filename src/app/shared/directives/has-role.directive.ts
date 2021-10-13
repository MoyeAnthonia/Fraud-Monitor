import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { AuthService } from 'app/_auth/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService) { }

  ngOnInit() {
    const userRoles = this.authService.decodedToken;
    // if no roles clear the view container ref
    if (!userRoles) {
      this.viewContainerRef.clear();
    }

    // if user has role needed then render the element
    if (this.authService.roleMatch(this.appHasRole)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    }
   }


}
