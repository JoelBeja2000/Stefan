import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { StefanSharedModule } from 'app/shared';
import {
  JuegoComponent,
  JuegoDetailComponent,
  JuegoUpdateComponent,
  JuegoDeletePopupComponent,
  JuegoDeleteDialogComponent,
  juegoRoute,
  juegoPopupRoute
} from './';

const ENTITY_STATES = [...juegoRoute, ...juegoPopupRoute];

@NgModule({
  imports: [StefanSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [JuegoComponent, JuegoDetailComponent, JuegoUpdateComponent, JuegoDeleteDialogComponent, JuegoDeletePopupComponent],
  entryComponents: [JuegoComponent, JuegoUpdateComponent, JuegoDeleteDialogComponent, JuegoDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StefanJuegoModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
