import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJuego } from 'app/shared/model/juego.model';

@Component({
  selector: 'jhi-juego-detail',
  templateUrl: './juego-detail.component.html'
})
export class JuegoDetailComponent implements OnInit {
  juego: IJuego;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ juego }) => {
      this.juego = juego;
    });
  }

  previousState() {
    window.history.back();
  }
}
