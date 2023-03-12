/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { StefanTestModule } from '../../../test.module';
import { JuegoDeleteDialogComponent } from 'app/entities/juego/juego-delete-dialog.component';
import { JuegoService } from 'app/entities/juego/juego.service';

describe('Component Tests', () => {
  describe('Juego Management Delete Component', () => {
    let comp: JuegoDeleteDialogComponent;
    let fixture: ComponentFixture<JuegoDeleteDialogComponent>;
    let service: JuegoService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StefanTestModule],
        declarations: [JuegoDeleteDialogComponent]
      })
        .overrideTemplate(JuegoDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JuegoDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JuegoService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
