import { Link } from "react-router-dom";

function DocumentCard({ document }) {
  return (
    <Link
      to={`/documents/${document.id}`}
      className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-400"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">{document.title}</h3>

          <p className="mt-1 text-sm text-slate-400">{document.filename}</p>
        </div>

        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
          {document.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-3">
        <p>Chunks: {document.chunk_count}</p>
        <p>Pages: {document.total_pages ?? "Not processed"}</p>
        <p>
          Uploaded: {new Date(document.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}

export default DocumentCard;