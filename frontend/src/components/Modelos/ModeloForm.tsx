// ModeloForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Modelos } from "../../App";
import Card from "../ui/Card";

export function ModeloForm() {
  const [formData, setFormData] = useState<Omit<Modelos, "id">>({
    nombre: "",
    cod_logistico: "",
    cod_producto: "",
    mac: "",
    tipo: "",
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:3000/api/modelos/${id}`)
        .then((r) => r.json())
        .then((data: Modelos) => {
          setFormData({
            nombre: data.nombre,
            cod_logistico: data.cod_logistico,
            cod_producto: data.cod_producto,
            mac: data.mac,
            tipo: data.tipo,
          });
        })
        .catch(() => alert("Error al cargar el modelo"));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:3000/api/modelos/${id}`
      : "http://localhost:3000/api/modelos";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        alert("Modelo guardado exitosamente");
        navigate("/modelos"); // Redirige a la lista
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Editar Modelo" : "Crear Nuevo Modelo"}
      </h2>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Cod. Logístico
            </label>
            <input
              type="text"
              name="cod_logistico"
              value={formData.cod_logistico}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Cod. Producto
            </label>
            <input
              type="text"
              name="cod_producto"
              value={formData.cod_producto}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              MAC
            </label>
            <input
              type="text"
              name="mac"
              value={formData.mac}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Tipo
            </label>
            <input
              type="text"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/modelos")}
              className="py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
