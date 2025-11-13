export default function Card({ title, children }) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow p-4">
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
