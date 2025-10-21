"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Profesor {
  profesor_id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
  titulo_academico: string;
}

interface ProfesorCreate {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
  titulo_academico: string;
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [selectedProfesor, setSelectedProfesor] = useState<Profesor | null>(null);
  const [newProfesor, setNewProfesor] = useState<ProfesorCreate>({ nombre: "", apellido: "", dni: "", email: "", telefono: "", especialidad: "", titulo_academico: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profesorToDelete, setProfesorToDelete] = useState<number | null>(null);

  const fetchProfesores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profesores/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      console.log(data);
      setProfesores(data);
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
    fetchProfesores();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedProfesor(null);
    setNewProfesor({ nombre: "", apellido: "", dni: "", email: "", telefono: "", especialidad: "", titulo_academico: "" });
    setModalOpen(true);
  };

  const handleUpdate = (profesor: Profesor) => {
    setModalMode("update");
    setSelectedProfesor(profesor);
    setModalOpen(true);
  };

  const confirmDelete = async (profesor_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profesores/${profesor_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el profesor");
      }
      fetchProfesores();
      setDeleteModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteClick = (profesor_id: number) => {
    setProfesorToDelete(profesor_id);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProfesor(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "update" && !selectedProfesor) return;

    const url = modalMode === "add"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/profesores/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/profesores/${selectedProfesor!.profesor_id}`;

    const method = modalMode === "add" ? "POST" : "PUT";
    const body = modalMode === "add" ? JSON.stringify(newProfesor) : JSON.stringify(selectedProfesor);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Error al ${modalMode === "add" ? "agregar" : "actualizar"} el profesor`);
      }

      handleModalClose();
      fetchProfesores();
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
          <h1 className="text-3xl font-bold">Profesores</h1>
        </div>
        <Button color="blue" onClick={handleAdd}>Agregar Profesor</Button>
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
                  <TableHeadCell>Especialidad</TableHeadCell>
                  <TableHeadCell>Titulo Academico</TableHeadCell>
                  <TableHeadCell>ACCION</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {profesores.map((profesor) => (
                  <TableRow
                    key={profesor.profesor_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {profesor.profesor_id}
                    </TableCell>
                    <TableCell>{profesor.nombre}</TableCell>
                    <TableCell>{profesor.apellido}</TableCell>
                    <TableCell>{profesor.dni}</TableCell>
                    <TableCell>{profesor.email}</TableCell>
                    <TableCell>{profesor.telefono}</TableCell>
                    <TableCell>{profesor.especialidad}</TableCell>
                    <TableCell>{profesor.titulo_academico}</TableCell>
                    <TableCell>
                       <div className="flex space-x-2">
                        <Button color="blue" onClick={() => handleUpdate(profesor)}>
                          <FaEdit /> Actualizar
                        </Button>
                        <Button color="red" onClick={() => handleDeleteClick(profesor.profesor_id)}>
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
          <ModalHeader>{modalMode === "add" ? "Agregar Profesor" : "Actualizar Profesor"}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newProfesor.nombre : selectedProfesor?.nombre}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, nombre: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">Apellido</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newProfesor.apellido : selectedProfesor?.apellido}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, apellido: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, apellido: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">DNI</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newProfesor.dni : selectedProfesor?.dni}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, dni: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, dni: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <TextInput
                    id="email"
                    value={modalMode === "add" ? newProfesor.email : selectedProfesor?.email}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, email: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="carrera">Telefono</Label>
                  <TextInput
                    id="carrera"
                    value={modalMode === "add" ? newProfesor.telefono : selectedProfesor?.telefono}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, telefono: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, telefono: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="año">Especialidad</Label>
                  <TextInput
                    id="año"
                    value={modalMode === "add" ? newProfesor.especialidad : selectedProfesor?.especialidad}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, especialidad: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, especialidad: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="año">Titulo Academico</Label>
                  <TextInput
                    id="año"
                    value={modalMode === "add" ? newProfesor.titulo_academico : selectedProfesor?.titulo_academico}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewProfesor({ ...newProfesor, titulo_academico: e.target.value })
                        : setSelectedProfesor({ ...selectedProfesor!, titulo_academico: e.target.value })
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
                ¿Estás seguro de que quieres eliminar este profesor?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={() => {
                  if (profesorToDelete) {
                    confirmDelete(profesorToDelete);
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