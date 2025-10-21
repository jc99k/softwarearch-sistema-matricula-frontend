"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody } from "flowbite-react";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Calificacion {
  id: number;
  matricula_id: number;
  calificacion: string;
}

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCalificacion, setSelectedCalificacion] = useState<Calificacion | null>(null);

  const fetchCalificaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calificaciones/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setCalificaciones(data);
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
    fetchCalificaciones();
  }, []);

  const handleUpdate = (calificacion: Calificacion) => {
    setSelectedCalificacion(calificacion);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calificaciones/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la calificacion");
      }
      fetchCalificaciones();
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
    setSelectedCalificacion(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCalificacion) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calificaciones/${selectedCalificacion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCalificacion),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la calificacion");
      }
      handleModalClose();
      fetchCalificaciones();
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
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Calificaciones</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Matrícula ID</TableHeadCell>
                  <TableHeadCell>Calificación</TableHeadCell>
                  <TableHeadCell>Acciones</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {calificaciones.map((calificacion) => (
                  <TableRow
                    key={calificacion.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {calificacion.id}
                    </TableCell>
                    <TableCell>{calificacion.matricula_id}</TableCell>
                    <TableCell>{calificacion.calificacion}</TableCell>
                    <TableCell>
                      <Button color="blue" onClick={() => handleUpdate(calificacion)}>
                        Actualizar
                      </Button>
                      <Button color="red" onClick={() => handleDelete(calificacion.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedCalificacion && (
          <Modal show={modalOpen} onClose={handleModalClose}>
            <ModalHeader>Actualizar Calificación</ModalHeader>
            <ModalBody>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="matricula_id">Matrícula ID</Label>
                    <TextInput
                      id="matricula_id"
                      type="number"
                      value={selectedCalificacion.matricula_id}
                      onChange={(e) =>
                        setSelectedCalificacion({
                          ...selectedCalificacion,
                          matricula_id: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="calificacion">Calificación</Label>
                    <TextInput
                      id="calificacion"
                      value={selectedCalificacion.calificacion}
                      onChange={(e) =>
                        setSelectedCalificacion({
                          ...selectedCalificacion,
                          calificacion: e.target.value,
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
      </div>
    </div>
  );
}