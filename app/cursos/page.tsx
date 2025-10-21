"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody, Select } from "flowbite-react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Curso {
  curso_id: number;
  carrera_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: string;
  nivel_semestre: string;
}

interface CursoCreate {
  carrera_id: string | number;
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: string | number;
  nivel_semestre: string | number;
}

interface Carrera {
  carrera_id: number;
  nombre: string;
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [newCurso, setNewCurso] = useState<CursoCreate>({ carrera_id: "", codigo: "", nombre: "", descripcion: "", creditos: "", nivel_semestre: ""});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState<number | null>(null);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      console.log("Fetched Cursos:", data);
      setCursos(data);
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
    fetchCursos();
  }, []);

  const fetchCarreras = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carreras`);
      if (!response.ok) {
        throw new Error("Error al obtener las carreras");
      }
      const data = await response.json();
      console.log("Fetched Carreras:", data);
      setCarreras(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedCurso(null);
    setNewCurso({ carrera_id: "", codigo: "", nombre: "", descripcion: "", creditos: "", nivel_semestre: ""});
    setModalOpen(true);
  };

  const handleUpdate = (curso: Curso) => {
    setModalMode("update");
    setSelectedCurso(curso);
    setModalOpen(true);
  };

  const confirmDelete = async (curso_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${curso_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el curso");
      }
      fetchCursos();
      setDeleteModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteClick = (curso_id: number) => {
    setCursoToDelete(curso_id);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCurso(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "update" && !selectedCurso) return;

    const url = modalMode === "add"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${selectedCurso!.curso_id}`;

    const method = modalMode === "add" ? "POST" : "PUT";
    const body = modalMode === "add" ? JSON.stringify({ ...newCurso, carrera_id: parseInt(newCurso.carrera_id as string), creditos: parseInt(newCurso.creditos as string), nivel_semestre: parseInt(newCurso.nivel_semestre as string) }) : JSON.stringify(selectedCurso);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Error al ${modalMode === "add" ? "agregar" : "actualizar"} el curso`);
      }

      handleModalClose();
      fetchCursos();
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
          <h1 className="text-3xl font-bold">Cursos</h1>
        </div>
        <Button color="blue" onClick={handleAdd}><FaPlus />
        Agregar Curso</Button>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Carrera</TableHeadCell>
                  <TableHeadCell>Código</TableHeadCell>
                  <TableHeadCell>Nombre</TableHeadCell>
                  <TableHeadCell>Descripción</TableHeadCell>
                  <TableHeadCell>Créditos</TableHeadCell>
                  <TableHeadCell>Nivel Semestre</TableHeadCell>
                  <TableHeadCell>ACCION</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {cursos.map((curso) => (
                  <TableRow
                    key={curso.curso_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {curso.curso_id}
                    </TableCell>
                    <TableCell>{carreras.find(c => c.carrera_id === curso.carrera_id)?.nombre}</TableCell>
                    <TableCell>{curso.codigo}</TableCell>
                    <TableCell>{curso.nombre}</TableCell>
                    <TableCell>{curso.descripcion}</TableCell>
                    <TableCell>{curso.creditos}</TableCell>
                    <TableCell>{curso.nivel_semestre}</TableCell>
                    <TableCell>
                       <div className="flex space-x-2">
                        <Button color="blue" onClick={() => handleUpdate(curso)}>
                          <FaEdit /> Actualizar
                        </Button>
                        <Button color="red" onClick={() => handleDeleteClick(curso.curso_id)}>
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
          <ModalHeader>{modalMode === "add" ? "Agregar Curso" : "Actualizar Curso"}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carrera_id">Carrera</Label>
                  <Select
                    id="carrera_id"
                    value={modalMode === "add" ? newCurso.carrera_id : selectedCurso?.carrera_id}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCurso({ ...newCurso, carrera_id: parseInt(e.target.value) })
                        : setSelectedCurso({ ...selectedCurso!, carrera_id: parseInt(e.target.value) })
                    }
                  >
                    <option value="">Seleccione una carrera</option>
                    {carreras.map((carrera) => (
                      <option key={carrera.carrera_id} value={carrera.carrera_id}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <TextInput
                    id="codigo"
                    value={modalMode === "add" ? newCurso.codigo : selectedCurso?.codigo}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCurso({ ...newCurso, codigo: e.target.value })
                        : setSelectedCurso({ ...selectedCurso!, codigo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <TextInput
                    id="nombre"
                    value={modalMode === "add" ? newCurso.nombre : selectedCurso?.nombre}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCurso({ ...newCurso, nombre: e.target.value })
                        : setSelectedCurso({ ...selectedCurso!, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <TextInput
                    id="descripcion"
                    value={modalMode === "add" ? newCurso.descripcion : selectedCurso?.descripcion}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCurso({ ...newCurso, descripcion: e.target.value })
                        : setSelectedCurso({ ...selectedCurso!, descripcion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="creditos">Créditos</Label>
                  <TextInput
                    id="creditos"
                    type="number"
                    value={modalMode === "add" ? newCurso.creditos : selectedCurso?.creditos}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCurso({ ...newCurso, creditos: parseInt(e.target.value) })
                        : setSelectedCurso({ ...selectedCurso!, creditos: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nivel_semestre">Nivel Semestre</Label>
                  <TextInput
                    id="nivel_semestre"
                    type="number"
                    value={modalMode === "add" ? newCurso.nivel_semestre : selectedCurso?.nivel_semestre}
                    onChange={(e) =>
                      modalMode === "add"
                        ? setNewCurso({ ...newCurso, nivel_semestre: parseInt(e.target.value) })
                        : setSelectedCurso({ ...selectedCurso!, nivel_semestre: parseInt(e.target.value) })
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
                ¿Estás seguro de que quieres eliminar este curso?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={() => {
                  if (cursoToDelete) {
                    confirmDelete(cursoToDelete);
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