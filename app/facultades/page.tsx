"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Facultad {
  facultad_id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  decano: string;
}

interface FacultadCreate {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  decano: string;
}

export default function FacultadesPage() {
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [selectedFacultad, setSelectedFacultad] = useState<Facultad | null>(null);
  const [newFacultad, setNewFacultad] = useState<FacultadCreate>({ nombre: "", descripcion: "", ubicacion: "", decano: ""});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [facultadToDelete, setFacultadToDelete] = useState<number | null>(null);

  const fetchFacultades = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/facultades/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      console.log(data);
      setFacultades(data);
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
    fetchFacultades();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedFacultad(null);
    setNewFacultad({ nombre: "", descripcion: "", ubicacion: "", decano: ""});
    setModalOpen(true);
  };

  const handleUpdate = (facultad: Facultad) => {
    setModalMode("update");
    setSelectedFacultad(facultad);
    setModalOpen(true);
  };

  const confirmDelete = async (facultad_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/facultades/${facultad_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el facultad");
      }
      fetchFacultades();
      setDeleteModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteClick = (facultad_id: number) => {
    setFacultadToDelete(facultad_id);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFacultad(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "update" && !selectedFacultad) return;

    const url = modalMode === "add"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/facultades/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/facultades/${selectedFacultad!.facultad_id}`;

    const method = modalMode === "add" ? "POST" : "PUT";
    const body = modalMode === "add" ? JSON.stringify(newFacultad) : JSON.stringify(selectedFacultad);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Error al ${modalMode === "add" ? "agregar" : "actualizar"} la facultad`);
      }

      handleModalClose();
      fetchFacultades();
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
          <h1 className="text-3xl font-bold">Facultades</h1>
        </div>
        <Button color="blue" onClick={handleAdd}>Agregar facultad</Button>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Nombre</TableHeadCell>
                  <TableHeadCell>Descripcion</TableHeadCell>
                  <TableHeadCell>Ubicacion</TableHeadCell>
                  <TableHeadCell>Decano</TableHeadCell>
                  <TableHeadCell>ACCION</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {facultades.map((facultad) => (
                  <TableRow
                    key={facultad.facultad_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {facultad.facultad_id}
                    </TableCell>
                    <TableCell>{facultad.nombre}</TableCell>
                    <TableCell>{facultad.descripcion}</TableCell>
                    <TableCell>{facultad.ubicacion}</TableCell>
                    <TableCell>{facultad.decano}</TableCell>
                    <TableCell>
                       <div className="flex space-x-2">
                        <Button color="blue" onClick={() => handleUpdate(facultad)}>
                          <FaEdit /> Actualizar
                        </Button>
                        <Button color="red" onClick={() => handleDeleteClick(facultad.facultad_id)}>
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
          <ModalHeader>{modalMode === "add" ? "Agregar facultad" : "Actualizar facultad"}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newFacultad.nombre : selectedFacultad?.nombre}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewFacultad({ ...newFacultad, nombre: e.target.value })
                        : setSelectedFacultad({ ...selectedFacultad!, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">Descripcion</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newFacultad.descripcion : newFacultad?.descripcion}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewFacultad({ ...newFacultad, descripcion: e.target.value })
                        : setSelectedFacultad({ ...selectedFacultad!, descripcion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">Ubicacion</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newFacultad.ubicacion : selectedFacultad?.ubicacion}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewFacultad({ ...newFacultad, ubicacion: e.target.value })
                        : setSelectedFacultad({ ...selectedFacultad!, ubicacion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Decano</Label>
                  <TextInput
                    id="email"
                    value={modalMode === "add" ? newFacultad.decano : selectedFacultad?.decano}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewFacultad({ ...newFacultad, decano: e.target.value })
                        : setSelectedFacultad({ ...selectedFacultad!, decano: e.target.value })
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
                ¿Estás seguro de que quieres eliminar esta facultad?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={() => {
                  if (facultadToDelete) {
                    confirmDelete(facultadToDelete);
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