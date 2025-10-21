"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody } from "flowbite-react";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Seccion {
  seccion_id: number;
  curso_id: number;
  profesor_id: number;
  codigo: string;
  capacidad_maxima: number;
  aula: string;
  horario: number;
  dias: number;
  periodo_academico: string;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
}

interface SeccionCreate {
  curso_id: number;
  profesor_id: number;
  codigo: string;
  capacidad_maxima: number;
  aula: string;
  horario: number;
  dias: number;
  periodo_academico: string;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
}

export default function SeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState<Seccion | null>(null);

  const fetchSecciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/secciones/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setSecciones(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  const handleUpdate = (seccion: Seccion) => {
    setSelectedSeccion(seccion);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/secciones/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la seccion");
      }
      fetchSecciones();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSeccion(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSeccion) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/secciones/${selectedSeccion.seccion_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSeccion),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la seccion");
      }
      handleModalClose();
      fetchSecciones();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex">
      <div className="w-64"><AppSidebar /></div>
      {/* <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Secciones</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Curso ID</TableHeadCell>
                  <TableHeadCell>Profesor ID</TableHeadCell>
                  <TableHeadCell>Semestre</TableHeadCell>
                  <TableHeadCell>Días</TableHeadCell>
                  <TableHeadCell>Hora Inicio</TableHeadCell>
                  <TableHeadCell>Hora Fin</TableHeadCell>
                  <TableHeadCell>Acciones</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {secciones.map((seccion) => (
                  <TableRow
                    key={seccion.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {seccion.id}
                    </TableCell>
                    <TableCell>{seccion.curso_id}</TableCell>
                    <TableCell>{seccion.profesor_id}</TableCell>
                    <TableCell>{seccion.semestre}</TableCell>
                    <TableCell>{seccion.dias}</TableCell>
                    <TableCell>{seccion.hora_inicio}</TableCell>
                    <TableCell>{seccion.hora_fin}</TableCell>
                    <TableCell>
                      <Button color="blue" onClick={() => handleUpdate(seccion)}>
                        Actualizar
                      </Button>
                      <Button color="red" onClick={() => handleDelete(seccion.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedSeccion && (
          <Modal show={modalOpen} onClose={handleModalClose}>
            <ModalHeader>Actualizar Seccion</ModalHeader>
            <ModalBody>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="curso_id">Curso ID</Label>
                    <TextInput
                      id="curso_id"
                      type="number"
                      value={selectedSeccion.curso_id}
                      onChange={(e) =>
                        setSelectedSeccion({
                          ...selectedSeccion,
                          curso_id: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="profesor_id">Profesor ID</Label>
                    <TextInput
                      id="profesor_id"
                      type="number"
                      value={selectedSeccion.profesor_id}
                      onChange={(e) =>
                        setSelectedSeccion({
                          ...selectedSeccion,
                          profesor_id: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="semestre">Semestre</Label>
                    <TextInput
                      id="semestre"
                      value={selectedSeccion.semestre}
                      onChange={(e) =>
                        setSelectedSeccion({
                          ...selectedSeccion,
                          semestre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dias">Días</Label>
                    <TextInput
                      id="dias"
                      value={selectedSeccion.dias}
                      onChange={(e) =>
                        setSelectedSeccion({
                          ...selectedSeccion,
                          dias: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora_inicio">Hora Inicio</Label>
                    <TextInput
                      id="hora_inicio"
                      value={selectedSeccion.hora_inicio}
                      onChange={(e) =>
                        setSelectedSeccion({
                          ...selectedSeccion,
                          hora_inicio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora_fin">Hora Fin</Label>
                    <TextInput
                      id="hora_fin"
                      value={selectedSeccion.hora_fin}
                      onChange={(e) =>
                        setSelectedSeccion({
                          ...selectedSeccion,
                          hora_fin: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button type="submit">Guardar Cambios</Button>
                </div>
              </form>
            </ModalBody>
          </Modal>
        )}
      </div> */}
    </div>
  );
}