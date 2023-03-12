/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { StefanTestModule } from '../../../test.module';
import { JuegoComponent } from 'app/entities/juego/juego.component';
import { JuegoService } from 'app/entities/juego/juego.service';
import { Juego } from 'app/shared/model/juego.model';

describe('Component Tests', () => {
  describe('Juego Management Component', () => {
    let comp: JuegoComponent;
    let fixture: ComponentFixture<JuegoComponent>;
    let service: JuegoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StefanTestModule],
        declarations: [JuegoComponent],
        providers: []
      })
        .overrideTemplate(JuegoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JuegoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JuegoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Juego(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.juegos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
