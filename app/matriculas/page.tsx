"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody } from "flowbite-react";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Matricula {
  id: number;
  estudiante_id: number;
  seccion_id: number;
  fecha: string;
}

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState<Matricula | null>(null);

  const fetchMatriculas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matriculas/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setMatriculas(data);
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
    fetchMatriculas();
  }, []);

  const handleUpdate = (matricula: Matricula) => {
    setSelectedMatricula(matricula);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matriculas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la matricula");
      }
      fetchMatriculas();
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
    setSelectedMatricula(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMatricula) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matriculas/${selectedMatricula.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMatricula),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la matricula");
      }
      handleModalClose();
      fetchMatriculas();
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
        <h1 className="text-3xl font-bold mb-6">Matrículas</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Estudiante ID</TableHeadCell>
                  <TableHeadCell>Sección ID</TableHeadCell>
                  <TableHeadCell>Fecha</TableHeadCell>
                  <TableHeadCell>Acciones</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {matriculas.map((matricula) => (
                  <TableRow
                    key={matricula.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {matricula.id}
                    </TableCell>
                    <TableCell>{matricula.estudiante_id}</TableCell>
                    <TableCell>{matricula.seccion_id}</TableCell>
                    <TableCell>{matricula.fecha}</TableCell>
                    <TableCell>
                      <Button color="blue" onClick={() => handleUpdate(matricula)}>
                        Actualizar
                      </Button>
                      <Button color="red" onClick={() => handleDelete(matricula.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedMatricula && (
          <Modal show={modalOpen} onClose={handleModalClose}>
            <ModalHeader>Actualizar Matrícula</ModalHeader>
            <ModalBody>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estudiante_id">Estudiante ID</Label>
                    <TextInput
                      id="estudiante_id"
                      type="number"
                      value={selectedMatricula.estudiante_id}
                      onChange={(e) =>
                        setSelectedMatricula({
                          ...selectedMatricula,
                          estudiante_id: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="seccion_id">Sección ID</Label>
                    <TextInput
                      id="seccion_id"
                      type="number"
                      value={selectedMatricula.seccion_id}
                      onChange={(e) =>
                        setSelectedMatricula({
                          ...selectedMatricula,
                          seccion_id: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <TextInput
                      id="fecha"
                      value={selectedMatricula.fecha}
                      onChange={(e) =>
                        setSelectedMatricula({
                          ...selectedMatricula,
                          fecha: e.target.value,
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