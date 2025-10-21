"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody, Select } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Carrera {
  carrera_id: number;
  facultad_id: number;
  nombre: string;
  descripcion: string;
  duracion_semestres: number;
  titulo_otorgado: string;
}

interface CarreraCreate {
  facultad_id: string | number;
  nombre: string;
  descripcion: string;
  duracion_semestres: string | number;
  titulo_otorgado: string;
}

interface Facultad {
  facultad_id: number;
  nombre: string;
  descripcion: string;
}

export default function CarrerasPage() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [selectedCarrera, setSelectedCarrera] = useState<Carrera | null>(null);
  const [newCarrera, setNewCarrera] = useState<CarreraCreate>({ facultad_id: "", nombre: "", descripcion: "", duracion_semestres: "", titulo_otorgado: ""});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carreraToDelete, setCarreraToDelete] = useState<number | null>(null);

  const fetchCarreras = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carreras/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      console.log(data);
      setCarreras(data);
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
    fetchCarreras();
  }, []);

  const fetchFacultades = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/facultades`);
      if (!response.ok) {
        throw new Error("Error al obtener las facultades");
      }
      const data = await response.json();
      setFacultades(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchFacultades();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedCarrera(null);
    setNewCarrera({ facultad_id: "", nombre: "", descripcion: "", duracion_semestres: "", titulo_otorgado: ""});
    setModalOpen(true);
  };

  const handleUpdate = (carrera: Carrera) => {
    setModalMode("update");
    setSelectedCarrera(carrera);
    setModalOpen(true);
  };

  const confirmDelete = async (carrera_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carreras/${carrera_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el carrera");
      }
      fetchCarreras();
      setDeleteModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteClick = (carrera_id: number) => {
    setCarreraToDelete(carrera_id);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCarrera(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "update" && !selectedCarrera) return;

    const url = modalMode === "add"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/carreras/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/carreras/${selectedCarrera!.carrera_id}`;

    const method = modalMode === "add" ? "POST" : "PUT";
    const body = modalMode === "add" ? JSON.stringify({ ...newCarrera, facultad_id: parseInt(newCarrera.facultad_id as string) }) : JSON.stringify(selectedCarrera);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Error al ${modalMode === "add" ? "agregar" : "actualizar"} la carrera`);
      }

      handleModalClose();
      fetchCarreras();
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
          <h1 className="text-3xl font-bold">Carreras</h1>
        </div>
        <Button color="blue" onClick={handleAdd}>Agregar Carrera</Button>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Facultad ID</TableHeadCell>
                  <TableHeadCell>Nombre</TableHeadCell>
                  <TableHeadCell>Descripcion</TableHeadCell>
                  <TableHeadCell>Duracion Semestres</TableHeadCell>
                  <TableHeadCell>Titulo Otorgado</TableHeadCell>
                  <TableHeadCell>ACCION</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {carreras.map((carrera) => (
                  <TableRow
                    key={carrera.carrera_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {carrera.carrera_id}
                    </TableCell>
                    <TableCell>{facultades.find(f => f.facultad_id === carrera.facultad_id)?.nombre}</TableCell>
                    <TableCell>{carrera.nombre}</TableCell>
                    <TableCell>{carrera.descripcion}</TableCell>
                    <TableCell>{carrera.duracion_semestres}</TableCell>
                    <TableCell>{carrera.titulo_otorgado}</TableCell>
                    <TableCell>
                       <div className="flex space-x-2">
                        <Button color="blue" onClick={() => handleUpdate(carrera)}>
                          <FaEdit /> Actualizar
                        </Button>
                        <Button color="red" onClick={() => handleDeleteClick(carrera.carrera_id)}>
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
          <ModalHeader>{modalMode === "add" ? "Agregar Carrera" : "Actualizar Carrera"}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facultad_id">Facultad</Label>
                  <Select
                    id="facultad_id"
                    value={modalMode === "add" ? newCarrera.facultad_id : selectedCarrera?.facultad_id}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCarrera({ ...newCarrera, facultad_id: parseInt(e.target.value) })
                        : setSelectedCarrera({ ...selectedCarrera!, facultad_id: parseInt(e.target.value) })
                    }
                  >
                    <option value="">Seleccione una facultad</option>
                    {facultades.map((facultad) => (
                      <option key={facultad.facultad_id} value={facultad.facultad_id}>
                        {facultad.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newCarrera.nombre : selectedCarrera?.nombre}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCarrera({ ...newCarrera, nombre: e.target.value })
                        : setSelectedCarrera({ ...selectedCarrera!, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">Descripcion</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newCarrera.descripcion : selectedCarrera?.descripcion}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCarrera({ ...newCarrera, descripcion: e.target.value })
                        : setSelectedCarrera({ ...selectedCarrera!, descripcion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Duracion Semestres</Label>
                  <TextInput
                    id="email"
                    value={modalMode === "add" ? newCarrera.duracion_semestres : selectedCarrera?.duracion_semestres}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCarrera({ ...newCarrera, duracion_semestres: parseInt(e.target.value) })
                        : setSelectedCarrera({ ...selectedCarrera!, duracion_semestres: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="carrera">Titulo Otorgado</Label>
                  <TextInput
                    id="carrera"
                    value={modalMode === "add" ? newCarrera.titulo_otorgado : selectedCarrera?.titulo_otorgado}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCarrera({ ...newCarrera, titulo_otorgado: e.target.value })
                        : setSelectedCarrera({ ...selectedCarrera!, titulo_otorgado: e.target.value })
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
                ¿Estás seguro de que quieres eliminar esta carrera?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={() => {
                  if (carreraToDelete) {
                    confirmDelete(carreraToDelete);
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