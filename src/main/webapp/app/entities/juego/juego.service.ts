import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IJuego } from 'app/shared/model/juego.model';

type EntityResponseType = HttpResponse<IJuego>;
type EntityArrayResponseType = HttpResponse<IJuego[]>;

@Injectable({ providedIn: 'root' })
export class JuegoService {
  public resourceUrl = SERVER_API_URL + 'api/juegos';

  constructor(protected http: HttpClient) {}

  create(juego: IJuego): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(juego);
    return this.http
      .post<IJuego>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(juego: IJuego): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(juego);
    return this.http
      .put<IJuego>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJuego>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJuego[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(juego: IJuego): IJuego {
    const copy: IJuego = Object.assign({}, juego, {
      fechaFin: juego.fechaFin != null && juego.fechaFin.isValid() ? juego.fechaFin.format(DATE_FORMAT) : null,
      fechaInicio: juego.fechaInicio != null && juego.fechaInicio.isValid() ? juego.fechaInicio.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaFin = res.body.fechaFin != null ? moment(res.body.fechaFin) : null;
      res.body.fechaInicio = res.body.fechaInicio != null ? moment(res.body.fechaInicio) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((juego: IJuego) => {
        juego.fechaFin = juego.fechaFin != null ? moment(juego.fechaFin) : null;
        juego.fechaInicio = juego.fechaInicio != null ? moment(juego.fechaInicio) : null;
      });
    }
    return res;
  }
}
