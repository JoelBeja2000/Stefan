/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { StefanTestModule } from '../../../test.module';
import { JuegoUpdateComponent } from 'app/entities/juego/juego-update.component';
import { JuegoService } from 'app/entities/juego/juego.service';
import { Juego } from 'app/shared/model/juego.model';

describe('Component Tests', () => {
  describe('Juego Management Update Component', () => {
    let comp: JuegoUpdateComponent;
    let fixture: ComponentFixture<JuegoUpdateComponent>;
    let service: JuegoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StefanTestModule],
        declarations: [JuegoUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(JuegoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JuegoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JuegoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Juego(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Juego();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
