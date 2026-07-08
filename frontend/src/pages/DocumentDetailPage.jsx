import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  chunkDocument,
  getDocumentById,
  getDocumentChunks,
  processDocument,
} from "../api/documentApi";
import { useAuth } from "../context/AuthContext";

function DocumentDetailPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const { user, logout } = useAuth();

  const [document, setDocument] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [chunking, setChunking] = useState(false);
  const [message, setMessage] = useState("");

  const loadDocumentData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [documentData, chunkData] = await Promise.all([
        getDocumentById(documentId),
        getDocumentChunks(documentId),
      ]);

      setDocument(documentData);
      setChunks(chunkData);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || "Failed to load document";
      setMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function fetchDocumentData() {
      try {
        setLoading(true);
        setMessage("");

        const [documentData, chunkData] = await Promise.all([
          getDocumentById(documentId),
          getDocumentChunks(documentId),
        ]);

        if (!ignore) {
          setDocument(documentData);
          setChunks(chunkData);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          const detail =
            error.response?.data?.detail || "Failed to load document";
          setMessage(detail);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchDocumentData();

    return () => {
      ignore = true;
    };
  }, [documentId]);

  const handleProcessDocument = async () => {
    try {
      setProcessing(true);
      setMessage("");

      const processedDocument = await processDocument(documentId);

      setDocument(processedDocument);
      setMessage("Document processed successfully");
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || "Processing failed";
      setMessage(detail);

      await loadDocumentData();
    } finally {
      setProcessing(false);
    }
  };

  const handleChunkDocument = async () => {
    try {
      setChunking(true);
      setMessage("");

      const createdChunks = await chunkDocument(documentId);

      setChunks(createdChunks);
      setMessage(`Created ${createdChunks.length} chunks`);

      await loadDocumentData();
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || "Chunking failed";
      setMessage(detail);

      await loadDocumentData();
    } finally {
      setChunking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const extractedTextPreview = document?.extracted_text
    ? document.extracted_text.slice(0, 2000)
    : "";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <p className="text-sm font-medium text-cyan-400">DocuMind AI</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Document Details
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Logged in as {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/documents"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
            >
              Back to documents
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
            >
              Logout
            </button>
          </div>
        </header>

        {message && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200">
            {message}
          </div>
        )}

        {loading ? (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Loading document...</p>
          </section>
        ) : !document ? (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Document not found.</p>
          </section>
        ) : (
          <>
            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Document</p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {document.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {document.filename}
                  </p>
                </div>

                <span className="w-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  {document.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Document ID</p>
                  <p className="mt-2 font-semibold">{document.id}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Pages</p>
                  <p className="mt-2 font-semibold">
                    {document.total_pages ?? "Not processed"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Chunks</p>
                  <p className="mt-2 font-semibold">{document.chunk_count}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Uploaded</p>
                  <p className="mt-2 font-semibold">
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleProcessDocument}
                  disabled={processing}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing ? "Processing..." : "Process PDF"}
                </button>

                <button
                  onClick={handleChunkDocument}
                  disabled={chunking || !document.extracted_text}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {chunking ? "Chunking..." : "Chunk Text"}
                </button>

                <button
                  onClick={loadDocumentData}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
                >
                  Refresh
                </button>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Extracted text preview</h2>

              {!document.extracted_text ? (
                <p className="mt-4 text-slate-400">
                  No extracted text yet. Click Process PDF first.
                </p>
              ) : (
                <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                  {extractedTextPreview}
                  {document.extracted_text.length > 2000
                    ? "\n\n...preview truncated"
                    : ""}
                </pre>
              )}
            </section>

            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Chunks</h2>

                <p className="text-sm text-slate-400">
                  {chunks.length} chunks loaded
                </p>
              </div>

              {chunks.length === 0 ? (
                <p className="mt-4 text-slate-400">
                  No chunks yet. Process the PDF, then click Chunk Text.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {chunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <p className="text-sm font-semibold text-cyan-400">
                        Chunk #{chunk.chunk_index + 1}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default DocumentDetailPage;