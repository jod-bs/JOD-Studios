"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectSubmission } from "@/lib/db";

export default function AdminPortal() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to load project submissions");
        return;
      }
      const list: ProjectSubmission[] = data.submissions || [];
      setSubmissions(list);
      const openId = selectedSubmission?.id;
      if (openId) {
        const refreshed = list.find((item) => item.id === openId) ?? null;
        setSelectedSubmission(refreshed);
        setAdminNote(refreshed?.notes || "");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error connecting to server";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id: string, newStatus: ProjectSubmission["status"]) => {
    setIsUpdating(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update status");
        return;
      }
      setSubmissions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error updating status";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setIsUpdating(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: adminNote }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to save notes");
        return;
      }
      setSubmissions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, notes: adminNote } : item))
      );
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) => (prev ? { ...prev, notes: adminNote } : null));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error saving note";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project submission?")) return;
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete submission");
        return;
      }
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error deleting submission";
      setError(message);
    }
  };

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesService = serviceFilter === "all" || item.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return;
    const escapeCsv = (value: string) => `"${String(value).replace(/"/g, '""')}"`;
    const headers = [
      "ID",
      "Service",
      "Client Name",
      "Email",
      "Phone",
      "Timeline",
      "Budget",
      "Status",
      "Date",
      "Description",
      "Admin Notes",
    ];
    const rows = filteredSubmissions.map((s) => [
      escapeCsv(s.id),
      escapeCsv(s.service),
      escapeCsv(s.name),
      escapeCsv(s.email),
      escapeCsv(s.phone),
      escapeCsv(s.timeline),
      escapeCsv(s.budget),
      escapeCsv(s.status),
      escapeCsv(new Date(s.createdAt).toLocaleString()),
      escapeCsv(s.description),
      escapeCsv(s.notes || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jod_studio_project_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalCount = submissions.length;
  const newCount = submissions.filter((s) => s.status === "new").length;
  const inReviewCount = submissions.filter((s) => s.status === "in_review").length;
  const contactedCount = submissions.filter((s) => s.status === "contacted").length;

  return (
    <div className="admin-root">
      <header className="admin-header shell">
        <div className="admin-brand">
          <Link href="/" className="wordmark">
            JOD <em>STUDIOS</em>
          </Link>
          <span className="admin-badge">ADMIN PORTAL</span>
        </div>
        <div className="admin-header-actions">
          <button onClick={fetchSubmissions} className="admin-btn-outline" title="Refresh Inquiries">
            Refresh
          </button>
          <button onClick={exportToCSV} className="admin-btn-outline" title="Export filtered inquiries as CSV">
            Export CSV
          </button>
          <Link href="/" className="admin-btn-accent">
            View Public Site
          </Link>
        </div>
      </header>

      <main className="shell admin-content">
        <div className="admin-metrics-grid">
          <div className="metric-card">
            <span className="metric-label">TOTAL INQUIRIES</span>
            <span className="metric-value">{totalCount}</span>
            <span className="metric-sub">Stored in database</span>
          </div>
          <div className="metric-card highlight">
            <span className="metric-label">NEW & UNREVIEWED</span>
            <span className="metric-value">{newCount}</span>
            <span className="metric-sub">Action required</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">IN REVIEW</span>
            <span className="metric-value">{inReviewCount}</span>
            <span className="metric-sub">Under evaluation</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">CONTACTED</span>
            <span className="metric-value">{contactedCount}</span>
            <span className="metric-sub">Followed up with client</span>
          </div>
        </div>

        <div className="admin-controls">
          <div className="admin-search-wrap">
            <input
              type="text"
              placeholder="Search by client name, email, phone, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="admin-filters">
            <div className="filter-pill-group">
              <span className="filter-label">Status:</span>
              {(["all", "new", "in_review", "contacted", "archived"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`filter-pill ${statusFilter === st ? "active" : ""}`}
                >
                  {st === "all" ? "All" : st.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="filter-select-wrap">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="admin-select"
              >
                <option value="all">All Services</option>
                <option value="Dubbing">Dubbing</option>
                <option value="SFX & Music">SFX & Music</option>
                <option value="Audio Mix">Audio Mix</option>
                <option value="Video Edit">Video Edit</option>
                <option value="VFX">VFX</option>
                <option value="Animation">Animation</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="admin-alert-error">{error}</div>}

        <div className="admin-layout-grid">
          <div className="admin-table-card">
            <div className="card-header">
              <h3>Project Inquiries ({filteredSubmissions.length})</h3>
              <span className="card-hint">Click any inquiry to review full brief</span>
            </div>

            {loading ? (
              <div className="admin-loading-state">
                <div className="spinner" />
                <p>Loading database records...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="admin-empty-state">
                <p>No project inquiries found matching your filters.</p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="admin-btn-outline">
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Timeline</th>
                      <th>Budget</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((item) => {
                      const isSelected = selectedSubmission?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          className={`table-row ${isSelected ? "selected-row" : ""}`}
                          onClick={() => {
                            setSelectedSubmission(item);
                            setAdminNote(item.notes || "");
                          }}
                        >
                          <td>
                            <span className={`status-tag status-${item.status}`}>
                              {item.status.replace("_", " ")}
                            </span>
                          </td>
                          <td>
                            <div className="client-cell">
                              <span className="client-name">{item.name}</span>
                              <span className="client-contact">{item.email}</span>
                            </div>
                          </td>
                          <td>
                            <span className="service-tag">{item.service}</span>
                          </td>
                          <td>
                            <span className="mono-text">{item.timeline}</span>
                          </td>
                          <td>
                            <span className="mono-text budget-tag">{item.budget}</span>
                          </td>
                          <td>
                            <span className="date-text">
                              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubmission(item);
                                setAdminNote(item.notes || "");
                              }}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedSubmission && (
            <div className="admin-detail-panel">
              <div className="detail-header">
                <div>
                  <span className="detail-eyebrow">INQUIRY DETAILS</span>
                  <h2>{selectedSubmission.name}</h2>
                </div>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setSelectedSubmission(null)}
                  title="Close Inspector"
                >
                  X
                </button>
              </div>

              {error && <div className="admin-alert-error admin-panel-alert">{error}</div>}

              <div className="detail-body">
                <div className="detail-section">
                  <label className="detail-label">Current Pipeline Status</label>
                  <div className="status-button-group">
                    {(["new", "in_review", "contacted", "archived"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`status-choice-btn status-${st} ${
                          selectedSubmission.status === st ? "active" : ""
                        }`}
                        onClick={() => handleStatusChange(selectedSubmission.id, st)}
                        disabled={isUpdating}
                      >
                        {st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="detail-grid-2">
                  <div className="detail-section">
                    <label className="detail-label">Requested Discipline</label>
                    <div className="spec-val-box">{selectedSubmission.service}</div>
                  </div>
                  <div className="detail-section">
                    <label className="detail-label">Estimated Timeline</label>
                    <div className="spec-val-box">{selectedSubmission.timeline}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <label className="detail-label">Client Working Budget</label>
                  <div className="spec-val-box highlight-budget">{selectedSubmission.budget}</div>
                </div>

                <div className="detail-section">
                  <label className="detail-label">Project Story & Scope</label>
                  <div className="story-box">{selectedSubmission.description}</div>
                </div>

                <div className="detail-section">
                  <label className="detail-label">Client Contact Channels</label>
                  <div className="contact-card">
                    <div className="contact-row">
                      <span className="c-label">Email:</span>
                      <a href={`mailto:${selectedSubmission.email}`} className="c-val link">
                        {selectedSubmission.email}
                      </a>
                    </div>
                    <div className="contact-row">
                      <span className="c-label">Phone / WA:</span>
                      <a
                        href={`https://wa.me/${selectedSubmission.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hi ${selectedSubmission.name}, this is JOD Studios regarding your ${selectedSubmission.service} project brief.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="c-val link whatsapp-link"
                      >
                        {selectedSubmission.phone} (Open WhatsApp)
                      </a>
                    </div>
                    <div className="contact-row">
                      <span className="c-label">Submitted On:</span>
                      <span className="c-val">
                        {new Date(selectedSubmission.createdAt).toLocaleString("en-IN", {
                          dateStyle: "full",
                          timeStyle: "medium",
                        })}
                      </span>
                    </div>
                    <div className="contact-row">
                      <span className="c-label">Record ID:</span>
                      <span className="c-val mono">{selectedSubmission.id}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <label className="detail-label">Internal Studio Notes</label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add team notes, quotation estimate, call notes..."
                    className="admin-textarea"
                  />
                  <div className="notes-actions">
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(selectedSubmission.id)}
                      disabled={isUpdating}
                      className="admin-btn-accent small"
                    >
                      {isUpdating ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>

                <div className="detail-footer">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="admin-btn-danger"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
