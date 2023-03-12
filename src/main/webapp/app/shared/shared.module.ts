import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StefanSharedLibsModule, StefanSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [StefanSharedLibsModule, StefanSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [StefanSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StefanSharedModule {
  static forRoot() {
    return {
      ngModule: StefanSharedModule
    };
  }
}
