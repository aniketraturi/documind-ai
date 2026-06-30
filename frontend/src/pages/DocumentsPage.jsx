import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getDocuments, uploadDocument } from "../api/documentApi";
import { useAuth } from "../context/AuthContext";

function DocumentsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load documents");
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function fetchDocuments() {
      try {
        setLoadingDocuments(true);
        const data = await getDocuments();

        if (!ignore) {
          setDocuments(data);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setMessage("Failed to load documents");
        }
      } finally {
        if (!ignore) {
          setLoadingDocuments(false);
        }
      }
    }

    fetchDocuments();

    return () => {
      ignore = true;
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setMessage("Only PDF files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a PDF file first");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const uploadedDocument = await uploadDocument(selectedFile);

      setMessage(`Uploaded ${uploadedDocument.filename}`);
      setSelectedFile(null);

      await loadDocuments();
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || "Upload failed";
      setMessage(detail);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <p className="text-sm font-medium text-cyan-400">DocuMind AI</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Documents
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Logged in as {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Upload PDF</h2>

          <p className="mt-2 text-sm text-slate-400">
            Upload PDF documents that will later be processed for semantic
            search and RAG chat.
          </p>

          <form onSubmit={handleUpload} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Select PDF file
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
              />
            </div>

            {selectedFile && (
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
                Selected:{" "}
                <span className="font-medium text-white">
                  {selectedFile.name}
                </span>
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload document"}
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your documents</h2>

            <button
              onClick={loadDocuments}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
            >
              Refresh
            </button>
          </div>

          {loadingDocuments ? (
            <p className="mt-6 text-slate-400">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="mt-6 text-slate-400">
              No documents uploaded yet. Upload your first PDF above.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        {document.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {document.filename}
                      </p>
                    </div>

                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                      {document.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-3">
                    <p>Chunks: {document.chunk_count}</p>
                    <p>Pages: {document.total_pages ?? "Not processed"}</p>
                    <p>
                      Uploaded:{" "}
                      {new Date(document.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default DocumentsPage;