"use client";

import { Table, TableHead, TableHeadCell, TableCell, TableRow, TableBody, Button, Modal, TextInput, Label, ModalHeader, ModalBody} from "flowbite-react";
import AppSidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface Pago {
  id: number;
  matricula_id: number;
  monto: number;
  fecha: string;
  metodo_pago: string;
}

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);

  const fetchPagos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setPagos(data);
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
    fetchPagos();
  }, []);

  const handleUpdate = (pago: Pago) => {
    setSelectedPago(pago);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el pago");
      }
      fetchPagos();
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
    setSelectedPago(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPago) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/${selectedPago.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPago),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el pago");
      }
      handleModalClose();
      fetchPagos();
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
        <h1 className="text-3xl font-bold mb-6">Pagos</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Matrícula ID</TableHeadCell>
                  <TableHeadCell>Monto</TableHeadCell>
                  <TableHeadCell>Fecha</TableHeadCell>
                  <TableHeadCell>Método de Pago</TableHeadCell>
                  <TableHeadCell>Acciones</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {pagos.map((pago) => (
                  <TableRow
                    key={pago.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {pago.id}
                    </TableCell>
                    <TableCell>{pago.matricula_id}</TableCell>
                    <TableCell>{pago.monto}</TableCell>
                    <TableCell>{pago.fecha}</TableCell>
                    <TableCell>{pago.metodo_pago}</TableCell>
                    <TableCell>
                      <Button color="blue" onClick={() => handleUpdate(pago)}>
                        Actualizar
                      </Button>
                      <Button color="red" onClick={() => handleDelete(pago.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedPago && (
          <Modal show={modalOpen} onClose={handleModalClose}>
            <ModalHeader>Actualizar Pago</ModalHeader>
            <ModalBody>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="matricula_id">Matrícula ID</Label>
                    <TextInput
                      id="matricula_id"
                      type="number"
                      value={selectedPago.matricula_id}
                      onChange={(e) =>
                        setSelectedPago({
                          ...selectedPago,
                          matricula_id: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="monto">Monto</Label>
                    <TextInput
                      id="monto"
                      type="number"
                      value={selectedPago.monto}
                      onChange={(e) =>
                        setSelectedPago({
                          ...selectedPago,
                          monto: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <TextInput
                      id="fecha"
                      value={selectedPago.fecha}
                      onChange={(e) =>
                        setSelectedPago({
                          ...selectedPago,
                          fecha: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="metodo_pago">Método de Pago</Label>
                    <TextInput
                      id="metodo_pago"
                      value={selectedPago.metodo_pago}
                      onChange={(e) =>
                        setSelectedPago({
                          ...selectedPago,
                          metodo_pago: e.target.value,
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