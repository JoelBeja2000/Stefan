import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { IJuego, Juego } from 'app/shared/model/juego.model';
import { JuegoService } from './juego.service';

@Component({
  selector: 'jhi-juego-update',
  templateUrl: './juego-update.component.html'
})
export class JuegoUpdateComponent implements OnInit {
  juego: IJuego;
  isSaving: boolean;
  fechaFinDp: any;
  fechaInicioDp: any;

  editForm = this.fb.group({
    id: [],
    nombre: [],
    descripcion: [],
    observaciones: [],
    plataforma: [],
    fechaFin: [],
    fechaInicio: [],
    estado: []
  });

  constructor(protected juegoService: JuegoService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ juego }) => {
      this.updateForm(juego);
      this.juego = juego;
    });
  }

  updateForm(juego: IJuego) {
    this.editForm.patchValue({
      id: juego.id,
      nombre: juego.nombre,
      descripcion: juego.descripcion,
      observaciones: juego.observaciones,
      plataforma: juego.plataforma,
      fechaFin: juego.fechaFin,
      fechaInicio: juego.fechaInicio,
      estado: juego.estado
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const juego = this.createFromForm();
    if (juego.id !== undefined) {
      this.subscribeToSaveResponse(this.juegoService.update(juego));
    } else {
      this.subscribeToSaveResponse(this.juegoService.create(juego));
    }
  }

  private createFromForm(): IJuego {
    const entity = {
      ...new Juego(),
      id: this.editForm.get(['id']).value,
      nombre: this.editForm.get(['nombre']).value,
      descripcion: this.editForm.get(['descripcion']).value,
      observaciones: this.editForm.get(['observaciones']).value,
      plataforma: this.editForm.get(['plataforma']).value,
      fechaFin: this.editForm.get(['fechaFin']).value,
      fechaInicio: this.editForm.get(['fechaInicio']).value,
      estado: this.editForm.get(['estado']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJuego>>) {
    result.subscribe((res: HttpResponse<IJuego>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
