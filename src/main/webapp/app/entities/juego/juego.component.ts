import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IJuego } from 'app/shared/model/juego.model';
import { AccountService } from 'app/core';
import { JuegoService } from './juego.service';

@Component({
  selector: 'jhi-juego',
  templateUrl: './juego.component.html'
})
export class JuegoComponent implements OnInit, OnDestroy {
  juegos: IJuego[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected juegoService: JuegoService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.juegoService
      .query()
      .pipe(
        filter((res: HttpResponse<IJuego[]>) => res.ok),
        map((res: HttpResponse<IJuego[]>) => res.body)
      )
      .subscribe(
        (res: IJuego[]) => {
          this.juegos = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInJuegos();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IJuego) {
    return item.id;
  }

  registerChangeInJuegos() {
    this.eventSubscriber = this.eventManager.subscribe('juegoListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
