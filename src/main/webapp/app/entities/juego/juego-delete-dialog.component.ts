import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IJuego } from 'app/shared/model/juego.model';
import { JuegoService } from './juego.service';

@Component({
  selector: 'jhi-juego-delete-dialog',
  templateUrl: './juego-delete-dialog.component.html'
})
export class JuegoDeleteDialogComponent {
  juego: IJuego;

  constructor(protected juegoService: JuegoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.juegoService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'juegoListModification',
        content: 'Deleted an juego'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-juego-delete-popup',
  template: ''
})
export class JuegoDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ juego }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(JuegoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.juego = juego;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/juego', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/juego', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
