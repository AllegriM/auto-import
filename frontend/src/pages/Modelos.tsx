import { useEffect, useState } from "react";
import type { Modelos } from "../App";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";

export default function ModelosPage() {
  const [modelos, setModelos] = useState<Modelos[]>([]);

  // 1. Creamos una función para centralizar la carga de datos
  const fetchModelos = () => {
    fetch("http://localhost:3000/api/modelos")
      .then((r) => r.json())
      .then(setModelos)
      .catch(() => alert("Error al cargar modelos"));
  };

  // 2. Usamos la función en useEffect
  useEffect(() => {
    fetchModelos();
  }, []);

  // 3. Función para manejar el borrado
  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este modelo?")) {
      fetch(`http://localhost:3000/api/modelos/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar");
          alert("Modelo eliminado");
          fetchModelos(); // Recargamos la lista
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div className="p-6">
      {/* 4. Cabecera con título y botón de "Crear" */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Modelos</h2>
        <Link
          to="/modelos/nuevo"
          className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Crear Nuevo Modelo
        </Link>
      </div>

      {/* 5. Lista de modelos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelos.map((m) => (
          <Card key={m.id}>
            <div className="font-medium">{m.nombre}</div>
            <div className="text-xs text-slate-500">
              Cod. logístico: {m.cod_logistico}
            </div>
            <div className="text-xs text-slate-500">
              Cod. producto: {m.cod_producto}
            </div>
            <div className="text-xs text-slate-500">MAC: {m.mac}</div>
            <div className="text-xs text-slate-400">Tipo: {m.tipo}</div>

            {/* 6. Botones de Acción por cada card */}
            <div className="flex gap-2 mt-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Link
                to={`/modelos/${m.id}`}
                className="text-sm py-1 px-3 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(m.id)}
                className="text-sm py-1 px-3 rounded-md bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900"
              >
                Eliminar
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
