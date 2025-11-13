import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Card from "./components/ui/Card";
import { ModeloForm } from "./components/Modelos/ModeloForm";
import ModelosPage from "./pages/Modelos";

export interface Modelos {
  id: number;
  nombre: string;
  cod_logistico: string;
  cod_producto: string;
  mac: string;
  tipo: string;
}

interface Articulos {
  id: number;
  id_modelo: number;
  nombre: string;
  tipo: string;
}

interface Inventario {
  id: number;
  id_articulo: number;
  id_proceso: number;
  cantidad: number;
}

interface Empleado {
  id: number;
  nombre: string;
  legajo: string;
  rol: string;
}

interface Historial {
  id: number;
  id_articulo: number;
  id_proceso: number;
  id_empleado: number;
  cantidad: number;
  fecha: Date;
  observacion: string;
}

interface Procesos {
  id: number;
  nombre: string;
}

function useWebSocket(url, onMessage) {
  const wsRef = useRef(null);
  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        onMessage && onMessage(data);
      } catch {}
    });
    return () => ws.close();
  }, [url, onMessage]);
  return wsRef;
}

function Dashboard({ socketUrl }) {
  const [stats, setStats] = useState({
    totalHoy: 0,
    produciendo: 0,
    finalizados: 0,
  });
  const [ultimosMovimientos, setUltimosMovimientos] = useState([]);

  useWebSocket(socketUrl, (msg) => {
    if (msg.type === "stats") setStats(msg.payload);
    if (msg.type === "historial")
      setUltimosMovimientos((prev) => [msg.payload, ...prev].slice(0, 10));
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Resumen de Producción">
        <div className="grid grid-cols-3 text-center gap-4">
          <div>
            <div className="text-2xl font-bold">{stats.totalHoy}</div>
            <div className="text-sm text-slate-500">Total hoy</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.produciendo}</div>
            <div className="text-sm text-slate-500">En proceso</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.finalizados}</div>
            <div className="text-sm text-slate-500">Finalizados</div>
          </div>
        </div>
      </Card>

      <Card title="Últimos movimientos">
        <ul className="text-sm max-h-60 overflow-auto">
          {ultimosMovimientos.map((m, i) => (
            <li key={i} className="border-b py-1">
              Artículo {m.id_articulo} → {m.proceso} ({m.cantidad}) — {m.fecha}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Atajos">
        <div className="flex flex-col gap-2">
          <Link
            to="/procesos"
            className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-center"
          >
            Procesos
          </Link>
          <Link
            to="/inventario"
            className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-center"
          >
            Inventario
          </Link>
          <Link
            to="/modelos"
            className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-center"
          >
            Modelos
          </Link>
          <Link
            to="/articulos"
            className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-center"
          >
            Artículos
          </Link>
          <Link
            to="/empleados"
            className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-center"
          >
            Empleados
          </Link>
          <Link
            to="/historial"
            className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-center"
          >
            Historial
          </Link>
        </div>
      </Card>
    </div>
  );
}

function Articulos() {
  const [articulos, setArticulos] = useState<Articulos[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/articulos")
      .then((r) => r.json())
      .then(setArticulos)
      .catch(() => {});
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Artículos</h2>
      <div className="overflow-auto bg-white/80 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Modelo</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2">{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.tipo}</td>
                <td>{a.modelo_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Procesos() {
  const [procesos, setProcesos] = useState<Procesos[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/procesos")
      .then((r) => r.json())
      .then(setProcesos)
      .catch(() => {});
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Procesos</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {procesos.map((p) => (
          <Card key={p.id}>
            <div className="font-medium">{p.nombre}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Inventario() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/inventario")
      .then((r) => r.json())
      .then(setInventario)
      .catch(() => {});
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Inventario</h2>
      <div className="overflow-auto bg-white/80 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th>ID</th>
              <th>Artículo</th>
              <th>Proceso</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="py-2">{i.id}</td>
                <td>{i.articulo_nombre}</td>
                <td>{i.proceso_nombre}</td>
                <td>{i.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/empleados")
      .then((r) => r.json())
      .then(setEmpleados)
      .catch(() => {});
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Empleados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {empleados.map((e) => (
          <Card key={e.id}>
            <div className="font-medium">{e.nombre}</div>
            <div className="text-xs text-slate-500">Legajo: {e.legajo}</div>
            <div className="text-xs text-slate-500">Rol: {e.rol}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Historial() {
  const [historial, setHistorial] = useState<Historial[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/historial")
      .then((r) => r.json())
      .then(setHistorial)
      .catch(() => {});
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Historial de movimientos</h2>
      <div className="overflow-auto bg-white/80 rounded-xl p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th>ID</th>
              <th>Artículo</th>
              <th>Proceso</th>
              <th>Cantidad</th>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Obs.</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="py-2">{h.id}</td>
                <td>{h.articulo_nombre}</td>
                <td>{h.proceso_nombre}</td>
                <td>{h.cantidad}</td>
                <td>{h.empleado_nombre}</td>
                <td>{new Date(h.fecha).toLocaleString()}</td>
                <td>{h.observacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const socketUrl = "ws://localhost:3000/ws";
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex">
          <aside className="w-64 p-6 border-r hidden md:block">
            <h1 className="text-2xl font-bold mb-6">Seguimiento</h1>
            <nav className="space-y-2">
              <Link to="/" className="block p-2 rounded hover:bg-slate-100">
                Dashboard
              </Link>
              <Link
                to="/modelos"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Modelos
              </Link>
              <Link
                to="/articulos"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Artículos
              </Link>
              <Link
                to="/procesos"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Procesos
              </Link>
              <Link
                to="/inventario"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Inventario
              </Link>
              <Link
                to="/empleados"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Empleados
              </Link>
              <Link
                to="/historial"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Historial
              </Link>
            </nav>
          </aside>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard socketUrl={socketUrl} />} />
              <Route path="/modelos" element={<ModelosPage />} />
              <Route path="/modelos/nuevo" element={<ModeloForm />} />
              <Route path="/modelos/:id" element={<ModeloForm />} />
              <Route path="/articulos" element={<Articulos />} />
              <Route path="/procesos" element={<Procesos />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/historial" element={<Historial />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
