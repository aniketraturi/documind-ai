import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  chunkDocument,
  embedDocument,
  getDocumentById,
  getDocumentChunks,
  processDocument,
  searchDocument,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [embedding, setEmbedding] = useState(false);

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

  const handleEmbedDocument = async () => {
  try {
    setEmbedding(true);
    setMessage("");

    const embeddedDocument = await embedDocument(documentId);

    setDocument(embeddedDocument);
    setMessage("Document embedded successfully");

    await loadDocumentData();
  } catch (error) {
    console.error(error);
    const detail = error.response?.data?.detail || "Embedding failed";
    setMessage(detail);

    await loadDocumentData();
  } finally {
    setEmbedding(false);
  }
};


  const handleSearch = async (event) => {
  event.preventDefault();

  const cleanedQuery = searchQuery.trim();

  if (!cleanedQuery) {
    setMessage("Please enter a search query");
    return;
  }

  try {
    setSearching(true);
    setMessage("");

    const results = await searchDocument({
      documentId,
      query: cleanedQuery,
      topK: Number(topK),
    });

    setSearchResults(results);

    if (results.length === 0) {
      setMessage("No matching chunks found");
    }
  } catch (error) {
    console.error(error);
    const detail = error.response?.data?.detail || "Search failed";
    setMessage(detail);
  } finally {
    setSearching(false);
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
                onClick={handleEmbedDocument}
  disabled={embedding || document.chunk_count === 0}
  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
>
  {embedding ? "Embedding..." : "Embed Chunks"}
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
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Semantic search</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Search this document by meaning using chunk embeddings.
                  </p>
                </div>

            <span className="w-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
      Requires embedded status
    </span>
  </div>

  <form onSubmit={handleSearch} className="mt-6 space-y-4">
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        Search query
      </label>

      <textarea
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
        placeholder="Example: What does this document say about payment deadlines?"
      />
    </div>

    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Top results
        </label>

        <input
          type="number"
          min="1"
          max="10"
          value={topK}
          onChange={(event) => setTopK(event.target.value)}
          className="w-32 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </div>

      <button
        type="submit"
        disabled={searching || document.status !== "embedded"}
        className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {searching ? "Searching..." : "Search document"}
      </button>
    </div>
  </form>

  {document.status !== "embedded" && (
    <p className="mt-4 text-sm text-slate-400">
      Process, chunk, and embed this document before searching.
    </p>
  )}

  {searchResults.length > 0 && (
    <div className="mt-6 space-y-4">
      <h3 className="font-semibold text-white">Search results</h3>

      {searchResults.map((result) => (
        <div
          key={result.chunk_id}
          className="rounded-xl border border-slate-800 bg-slate-950 p-4"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-cyan-400">
              Chunk #{result.chunk_index + 1}
            </p>

            <p className="text-sm text-slate-400">
              Similarity: {result.similarity.toFixed(4)}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {result.content}
          </p>
        </div>
      ))}
    </div>
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