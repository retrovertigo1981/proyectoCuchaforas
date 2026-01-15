
export interface ArtesanaAcfBase {
      email: string;
      region: string;
      comuna: string;
      telefono: string;
      disciplina: string;
      historia_y_vivencia: string;
      motivacion_participacion: string;
      imagen_de_perfil: string;
      imagenes_trabajo_1: string;
      imagenes_trabajo_2: string;
}

export interface ArtesanaApi {
  id: number;
  title: {
    rendered: string;
  };
  acf: ArtesanaAcfBase;
}
