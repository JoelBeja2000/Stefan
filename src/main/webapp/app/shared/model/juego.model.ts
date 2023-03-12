import { Moment } from 'moment';

export interface IJuego {
  id?: number;
  nombre?: string;
  descripcion?: string;
  observaciones?: string;
  plataforma?: string;
  fechaFin?: Moment;
  fechaInicio?: Moment;
  estado?: string;
}

export class Juego implements IJuego {
  constructor(
    public id?: number,
    public nombre?: string,
    public descripcion?: string,
    public observaciones?: string,
    public plataforma?: string,
    public fechaFin?: Moment,
    public fechaInicio?: Moment,
    public estado?: string
  ) {}
}
