/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StefanTestModule } from '../../../test.module';
import { JuegoDetailComponent } from 'app/entities/juego/juego-detail.component';
import { Juego } from 'app/shared/model/juego.model';

describe('Component Tests', () => {
  describe('Juego Management Detail Component', () => {
    let comp: JuegoDetailComponent;
    let fixture: ComponentFixture<JuegoDetailComponent>;
    const route = ({ data: of({ juego: new Juego(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StefanTestModule],
        declarations: [JuegoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(JuegoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JuegoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.juego).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
