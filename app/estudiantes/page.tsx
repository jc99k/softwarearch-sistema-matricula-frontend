"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody } from "flowbite-react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Estudiante {
  estudiante_id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
}

interface EstudianteCreate {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
}

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [newEstudiante, setNewEstudiante] = useState<EstudianteCreate>({ nombre: "", apellido: "", dni: "", email: "", telefono: "", fecha_nacimiento: "", direccion: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = useState<number | null>(null);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/estudiantes/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      console.log(data);
      setEstudiantes(data);
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
    fetchEstudiantes();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedEstudiante(null);
    setNewEstudiante({ nombre: "", apellido: "", dni: "", email: "", telefono: "", fecha_nacimiento: "", direccion: "" });
    setModalOpen(true);
  };

  const handleUpdate = (estudiante: Estudiante) => {
    setModalMode("update");
    setSelectedEstudiante(estudiante);
    setModalOpen(true);
  };

  const confirmDelete = async (estudiante_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/estudiantes/${estudiante_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el estudiante");
      }
      fetchEstudiantes();
      setDeleteModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteClick = (estudiante_id: number) => {
    setEstudianteToDelete(estudiante_id);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEstudiante(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "update" && !selectedEstudiante) return;

    const url = modalMode === "add"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/estudiantes/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/estudiantes/${selectedEstudiante!.estudiante_id}`;

    const method = modalMode === "add" ? "POST" : "PUT";
    const body = modalMode === "add" ? JSON.stringify(newEstudiante) : JSON.stringify(selectedEstudiante);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Error al ${modalMode === "add" ? "agregar" : "actualizar"} el estudiante`);
      }

      handleModalClose();
      fetchEstudiantes();
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Estudiantes</h1>
        </div>
        <Button color="blue" onClick={handleAdd}><FaPlus />
        Agregar Estudiante</Button>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Nombre</TableHeadCell>
                  <TableHeadCell>Apellido</TableHeadCell>
                  <TableHeadCell>DNI</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Telefono</TableHeadCell>
                  <TableHeadCell>Fecha de Nacimiento</TableHeadCell>
                  <TableHeadCell>Direccion</TableHeadCell>
                  <TableHeadCell>ACCION</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {estudiantes.map((estudiante) => (
                  <TableRow
                    key={estudiante.estudiante_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {estudiante.estudiante_id}
                    </TableCell>
                    <TableCell>{estudiante.nombre}</TableCell>
                    <TableCell>{estudiante.apellido}</TableCell>
                    <TableCell>{estudiante.dni}</TableCell>
                    <TableCell>{estudiante.email}</TableCell>
                    <TableCell>{estudiante.telefono}</TableCell>
                    <TableCell>{estudiante.fecha_nacimiento}</TableCell>
                    <TableCell>{estudiante.direccion}</TableCell>
                    <TableCell>
                       <div className="flex space-x-2">
                        <Button color="blue" onClick={() => handleUpdate(estudiante)}>
                          <FaEdit /> Actualizar
                        </Button>
                        <Button color="red" onClick={() => handleDeleteClick(estudiante.estudiante_id)}>
                          <FaTrash /> Eliminar
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <Modal show={modalOpen} onClose={handleModalClose}>
          <ModalHeader>{modalMode === "add" ? "Agregar Estudiante" : "Actualizar Estudiante"}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newEstudiante.nombre : selectedEstudiante?.nombre}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, nombre: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">Apellido</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newEstudiante.apellido : selectedEstudiante?.apellido}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, apellido: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, apellido: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">DNI</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newEstudiante.dni : selectedEstudiante?.dni}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, dni: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, dni: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <TextInput
                    id="email"
                    value={modalMode === "add" ? newEstudiante.email : selectedEstudiante?.email}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, email: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="carrera">Telefono</Label>
                  <TextInput
                    id="carrera"
                    value={modalMode === "add" ? newEstudiante.telefono : selectedEstudiante?.telefono}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, telefono: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, telefono: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="año">Fecha de Nacimiento</Label>
                  <TextInput
                    id="año"
                    value={modalMode === "add" ? newEstudiante.fecha_nacimiento : selectedEstudiante?.fecha_nacimiento}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, fecha_nacimiento: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, fecha_nacimiento: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="año">Direccion</Label>
                  <TextInput
                    id="año"
                    value={modalMode === "add" ? newEstudiante.direccion : selectedEstudiante?.direccion}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewEstudiante({ ...newEstudiante, direccion: e.target.value })
                        : setSelectedEstudiante({ ...selectedEstudiante!, direccion: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit">{modalMode === "add" ? "Agregar" : "Guardar Cambios"}</Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="md">
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Estás seguro de que quieres eliminar este estudiante?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={() => {
                  if (estudianteToDelete) {
                    confirmDelete(estudianteToDelete);
                  }
                }}>
                  Sí, estoy seguro
                </Button>
                <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
                  No, cancelar
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}