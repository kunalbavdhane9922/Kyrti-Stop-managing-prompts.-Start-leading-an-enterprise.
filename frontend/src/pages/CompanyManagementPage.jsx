import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, UserPlus, Bot, Trash2, Plus, Edit3, Save, X,
  ChevronDown, Shield, Users, User, Briefcase, GitBranch, Check
} from 'lucide-react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAuthStore } from '../store/authStore.js';
import { organizationApi } from '../services/organizationApi.js';

/* ═══════════════════════════════════════════════════════════════════
   CUSTOM ORG NODE — Rich card inside ReactFlow
   ═══════════════════════════════════════════════════════════════════ */
function OrgNodeCard({ data }) {
  const borderColor =
    data.occupantType === 'AI' || data.occupantType === 'AI_VACANT'
      ? '#FF5C00'
      : data.occupantType === 'HUMAN'
        ? '#16A34A'
        : 'rgba(0,0,0,0.12)';

  const badgeClass =
    data.occupantType === 'HUMAN'
      ? 'mgmt-badge--human'
      : data.occupantType === 'AI' || data.occupantType === 'AI_VACANT'
        ? 'mgmt-badge--ai'
        : 'mgmt-badge--vacant';

  const statusLabel =
    data.assignmentStatus === 'ASSIGNED' ? 'Assigned'
      : data.assignmentStatus === 'INVITED' ? 'Invited'
        : data.assignmentStatus === 'AI_VACANT' ? 'AI Vacant'
          : 'Vacant';

  return (
    <div className="mgmt-org-node" style={{ borderColor }}>
      <div className="mgmt-org-node-header">
        <span className="mgmt-org-node-title">{data.title}</span>
        {data.groupCount > 1 && (
          <span className="mgmt-org-node-count">×{data.groupCount}</span>
        )}
      </div>

      {data.department && (
        <span className="mgmt-org-node-dept">{data.department}</span>
      )}

      <div className="mgmt-org-node-footer">
        <span className={`mgmt-badge ${badgeClass}`}>{statusLabel}</span>

        {data.occupantName ? (
          <span className="mgmt-org-node-name">{data.occupantName}</span>
        ) : (
          <div className="mgmt-org-node-actions">
            {(data.occupantType === 'HUMAN' || data.occupantType === 'VACANT') && (
              <button
                className="mgmt-node-action-btn"
                title="Invite Human"
                onClick={(e) => { e.stopPropagation(); data.onInvite(data.nodeId); }}
              >
                <UserPlus size={12} />
              </button>
            )}
            {(data.occupantType === 'AI' || data.occupantType === 'AI_VACANT' || data.occupantType === 'VACANT') && (
              <button
                className="mgmt-node-action-btn mgmt-node-action-btn--ai"
                title="Recruit AI"
                onClick={(e) => { e.stopPropagation(); data.onRecruit(data.nodeId); }}
              >
                <Bot size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit/Delete controls */}
      <div className="mgmt-org-node-controls">
        <button
          className="mgmt-node-ctrl-btn"
          title="Edit"
          onClick={(e) => { e.stopPropagation(); data.onEdit(data.nodeId); }}
        >
          <Edit3 size={10} />
        </button>
        <button
          className="mgmt-node-ctrl-btn mgmt-node-ctrl-btn--danger"
          title="Delete"
          onClick={(e) => { e.stopPropagation(); data.onDelete(data.nodeId); }}
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}

const nodeTypes = { orgNode: OrgNodeCard };

/* ═══════════════════════════════════════════════════════════════════
   AUTO-LAYOUT ENGINE — positions nodes in a tree
   ═══════════════════════════════════════════════════════════════════ */
function autoLayout(rawNodes, edges) {
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 110;
  const H_GAP = 30;
  const V_GAP = 60;

  // Build adjacency from edges
  const childrenMap = {};
  const hasParent = new Set();
  edges.forEach(e => {
    if (!childrenMap[e.source]) childrenMap[e.source] = [];
    childrenMap[e.source].push(e.target);
    hasParent.add(e.target);
  });

  // Find roots (no parent)
  const roots = rawNodes.filter(n => !hasParent.has(n.id)).map(n => n.id);
  if (roots.length === 0 && rawNodes.length > 0) {
    roots.push(rawNodes[0].id);
  }

  // Calculate subtree widths
  const widths = {};
  function calcWidth(id) {
    const kids = childrenMap[id] || [];
    if (kids.length === 0) {
      widths[id] = NODE_WIDTH;
      return NODE_WIDTH;
    }
    let total = 0;
    kids.forEach(kid => {
      total += calcWidth(kid) + H_GAP;
    });
    total -= H_GAP;
    widths[id] = Math.max(total, NODE_WIDTH);
    return widths[id];
  }

  roots.forEach(calcWidth);

  // Position nodes
  const positions = {};
  function positionNode(id, x, y) {
    const kids = childrenMap[id] || [];
    const totalWidth = widths[id] || NODE_WIDTH;
    positions[id] = { x: x + totalWidth / 2 - NODE_WIDTH / 2, y };

    let childX = x;
    kids.forEach(kid => {
      const kidWidth = widths[kid] || NODE_WIDTH;
      positionNode(kid, childX, y + NODE_HEIGHT + V_GAP);
      childX += kidWidth + H_GAP;
    });
  }

  let startX = 0;
  roots.forEach(root => {
    positionNode(root, startX, 0);
    startX += (widths[root] || NODE_WIDTH) + H_GAP * 2;
  });

  return rawNodes.map(n => ({
    ...n,
    position: positions[n.id] || { x: 0, y: 0 },
  }));
}

/* ═══════════════════════════════════════════════════════════════════
   INVITE MODAL
   ═══════════════════════════════════════════════════════════════════ */
function InviteModal({ nodeId, onClose, onSubmit, loading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="mgmt-modal-overlay" onClick={onClose}>
      <div className="mgmt-modal" onClick={e => e.stopPropagation()}>
        <div className="mgmt-modal-header">
          <UserPlus size={18} className="mgmt-modal-icon" />
          <h3>Invite Human</h3>
          <button className="mgmt-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mgmt-modal-body">
          <div className="mgmt-modal-field">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="mgmt-modal-field">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" type="email" />
          </div>
        </div>
        <div className="mgmt-modal-footer">
          <button className="mgmt-modal-btn mgmt-modal-btn--secondary" onClick={onClose}>Cancel</button>
          <button
            className="mgmt-modal-btn mgmt-modal-btn--primary"
            onClick={() => onSubmit(nodeId, name, email)}
            disabled={!name.trim() || !email.trim() || loading}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EDIT NODE MODAL
   ═══════════════════════════════════════════════════════════════════ */
function EditNodeModal({ node, departments, onClose, onSubmit, loading }) {
  const [title, setTitle] = useState(node?.title || '');
  const [occupantType, setOccupantType] = useState(node?.occupantType || 'VACANT');
  const [nodeType, setNodeType] = useState(node?.nodeType || 'POSITION_GROUP');
  const [occupantName, setOccupantName] = useState(node?.occupantName || '');
  const [occupantEmail, setOccupantEmail] = useState(node?.occupantEmail || '');
  const [departmentId, setDepartmentId] = useState(node?.departmentId || '');

  return (
    <div className="mgmt-modal-overlay" onClick={onClose}>
      <div className="mgmt-modal mgmt-modal--wide" onClick={e => e.stopPropagation()}>
        <div className="mgmt-modal-header">
          <Edit3 size={18} className="mgmt-modal-icon" />
          <h3>{node ? 'Edit Position' : 'Add New Position'}</h3>
          <button className="mgmt-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mgmt-modal-body">
          <div className="mgmt-modal-grid">
            <div className="mgmt-modal-field">
              <label>Position Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. VP Engineering" />
            </div>
            <div className="mgmt-modal-field">
              <label>Node Type</label>
              <select value={nodeType} onChange={e => setNodeType(e.target.value)}>
                <option value="BOARD_MEMBER">Board Member</option>
                <option value="EXECUTIVE">Executive</option>
                <option value="DEPT_LEAD">Department Lead</option>
                <option value="POSITION_GROUP">Position Group</option>
              </select>
            </div>
            <div className="mgmt-modal-field">
              <label>Occupant Type</label>
              <select value={occupantType} onChange={e => setOccupantType(e.target.value)}>
                <option value="HUMAN">Human</option>
                <option value="AI_VACANT">AI (Vacant)</option>
                <option value="VACANT">Vacant</option>
              </select>
            </div>
            <div className="mgmt-modal-field">
              <label>Department</label>
              <select value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
                <option value="">None (Executive / Board)</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            {occupantType === 'HUMAN' && (
              <>
                <div className="mgmt-modal-field">
                  <label>Occupant Name</label>
                  <input value={occupantName} onChange={e => setOccupantName(e.target.value)} placeholder="Jane Smith" />
                </div>
                <div className="mgmt-modal-field">
                  <label>Occupant Email</label>
                  <input value={occupantEmail} onChange={e => setOccupantEmail(e.target.value)} placeholder="jane@company.com" type="email" />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mgmt-modal-footer">
          <button className="mgmt-modal-btn mgmt-modal-btn--secondary" onClick={onClose}>Cancel</button>
          <button
            className="mgmt-modal-btn mgmt-modal-btn--primary"
            onClick={() => onSubmit({
              title, occupantType, nodeType, occupantName, occupantEmail,
              departmentId: departmentId || null,
              assignmentStatus: occupantType === 'HUMAN' && occupantName ? 'ASSIGNED' : occupantType === 'AI_VACANT' ? 'AI_VACANT' : 'VACANT',
            })}
            disabled={!title.trim() || loading}
          >
            {loading ? 'Saving...' : (node ? 'Save Changes' : 'Add Position')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export function CompanyManagementPage() {
  // Get tenantId from the user object or session
  const user = useAuthStore(s => s.user);
  const [tenantId, setTenantId] = useState(null);

  const [rawNodes, setRawNodes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modals
  const [inviteTarget, setInviteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null); // null = closed, 'new' = add, nodeId = edit
  const [addParentId, setAddParentId] = useState(null);

  // Dirty tracking for unsaved reparent changes
  const [pendingReparents, setPendingReparents] = useState([]);

  // Resolve tenantId from session
  useEffect(() => {
    const stored = sessionStorage.getItem('sovereign_active_tenant');
    if (stored) {
      setTenantId(stored);
    } else if (user?.tenantId) {
      setTenantId(user.tenantId);
      sessionStorage.setItem('sovereign_active_tenant', user.tenantId);
    } else {
      // Derive from URL or use a default
      const path = window.location.pathname;
      const match = path.match(/\/company\/([^/]+)/);
      if (match) {
        setTenantId(match[1]);
      } else {
        // Try to get from the last created company
        const lastTenant = sessionStorage.getItem('sovereign_last_tenant');
        setTenantId(lastTenant || 'default-tenant');
      }
    }
  }, [user]);

  // ─── Fetch Hierarchy from DB ─────────────────────────────────────────
  const fetchHierarchy = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await organizationApi.getHierarchy(tenantId);
      const dbNodes = data.nodes || [];
      const dbDepts = data.departments || [];

      setRawNodes(dbNodes);
      setDepartments(dbDepts);

      // Build department name map
      const deptMap = {};
      dbDepts.forEach(d => { deptMap[d.id] = d.name; });

      // Build flow nodes and edges from DB data
      const fNodes = [];
      const fEdges = [];

      dbNodes.forEach((n) => {
        fNodes.push({
          id: n.id,
          type: 'orgNode',
          position: { x: 0, y: 0 }, // Will be auto-laid-out
          data: {
            nodeId: n.id,
            title: n.title,
            department: deptMap[n.departmentId] || '',
            occupantType: n.occupantType,
            occupantName: n.occupantName,
            assignmentStatus: n.assignmentStatus,
            groupCount: n.groupCount || 1,
            nodeType: n.nodeType,
            departmentId: n.departmentId,
            occupantEmail: n.occupantEmail,
            onInvite: (id) => setInviteTarget(id),
            onRecruit: handleRecruit,
            onEdit: (id) => setEditTarget(id),
            onDelete: handleDelete,
          },
        });

        if (n.parentNodeId) {
          fEdges.push({
            id: `e-${n.parentNodeId}-${n.id}`,
            source: n.parentNodeId,
            target: n.id,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: '#94A3B8' },
            style: { stroke: '#94A3B8', strokeWidth: 1.5 },
          });
        }
      });

      // Auto-layout
      const laid = autoLayout(fNodes, fEdges);
      setFlowNodes(laid);
      setFlowEdges(fEdges);
      setPendingReparents([]);
    } catch (err) {
      console.error('Failed to fetch hierarchy:', err);
      setError('Failed to load organization hierarchy. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchHierarchy();
  }, [fetchHierarchy]);

  // ─── Invite Handler ──────────────────────────────────────────────────
  const handleInviteSubmit = async (nodeId, name, email) => {
    setSaving(true);
    try {
      await organizationApi.inviteHuman(tenantId, nodeId, { name, email });
      setInviteTarget(null);
      setSuccessMsg(`Invitation sent to ${name}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchHierarchy();
    } catch (err) {
      setError(`Invite failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ─── Recruit AI Handler ──────────────────────────────────────────────
  const handleRecruit = async (nodeId) => {
    setSaving(true);
    try {
      await organizationApi.recruitAI(tenantId, nodeId);
      setSuccessMsg('Position marked for AI recruitment');
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchHierarchy();
    } catch (err) {
      setError(`Recruit failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete Handler ──────────────────────────────────────────────────
  const handleDelete = async (nodeId) => {
    if (!confirm('Delete this position? Children will be re-parented automatically.')) return;
    setSaving(true);
    try {
      await organizationApi.deleteNode(tenantId, nodeId);
      setSuccessMsg('Position deleted');
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchHierarchy();
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit / Add Node Handler ─────────────────────────────────────────
  const handleEditSubmit = async (updates) => {
    setSaving(true);
    try {
      if (editTarget === 'new') {
        // Adding a new node
        await organizationApi.addNode(tenantId, {
          ...updates,
          parentNodeId: addParentId || null,
        });
        setSuccessMsg('New position added');
      } else {
        // Editing existing node
        await organizationApi.updateNode(tenantId, editTarget, updates);
        setSuccessMsg('Position updated');
      }
      setEditTarget(null);
      setAddParentId(null);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchHierarchy();
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ─── Drag-to-reparent via edge creation ──────────────────────────────
  const onConnect = useCallback(async (params) => {
    // When user draws an edge, reparent the target node to the source
    setSaving(true);
    try {
      await organizationApi.updateNode(tenantId, params.target, {
        parentNodeId: params.source,
      });
      setSuccessMsg('Node reparented successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchHierarchy();
    } catch (err) {
      setError(`Reparent failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [tenantId, fetchHierarchy]);

  const onNodesChange = useCallback((changes) => {
    setFlowNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setFlowEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // ─── Get node data for edit modal ────────────────────────────────────
  const editNodeData = useMemo(() => {
    if (!editTarget || editTarget === 'new') return null;
    return rawNodes.find(n => n.id === editTarget) || null;
  }, [editTarget, rawNodes]);

  // ─── Stats ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const human = rawNodes.filter(n => n.occupantType === 'HUMAN').length;
    const ai = rawNodes.filter(n => n.occupantType === 'AI' || n.occupantType === 'AI_VACANT').length;
    const vacant = rawNodes.filter(n => n.occupantType === 'VACANT').length;
    const totalPositions = rawNodes.reduce((s, n) => s + (n.groupCount || 1), 0);
    return { human, ai, vacant, totalPositions, totalNodes: rawNodes.length, deptCount: departments.length };
  }, [rawNodes, departments]);

  return (
    <div className="mgmt-page">
      {/* Header */}
      <div className="mgmt-header">
        <div>
          <h1 className="mgmt-title">
            <Building2 size={22} /> Company Management
          </h1>
          <p className="mgmt-subtitle">
            Interactive Org Chart. Drag handles to connect and reparent nodes. Click nodes to edit.
          </p>
        </div>
        <div className="mgmt-header-actions">
          <button
            className="mgmt-btn mgmt-btn--add"
            onClick={() => { setEditTarget('new'); setAddParentId(null); }}
          >
            <Plus size={14} /> Add Position
          </button>
          <button className="mgmt-btn mgmt-btn--refresh" onClick={fetchHierarchy} disabled={loading}>
            <GitBranch size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mgmt-stats">
        <div className="mgmt-stat">
          <Users size={14} /> <strong>{stats.totalNodes}</strong> Nodes
        </div>
        <div className="mgmt-stat">
          <Briefcase size={14} /> <strong>{stats.totalPositions}</strong> Total Positions
        </div>
        <div className="mgmt-stat">
          <User size={14} /> <strong>{stats.human}</strong> Human
        </div>
        <div className="mgmt-stat">
          <Bot size={14} /> <strong>{stats.ai}</strong> AI
        </div>
        <div className="mgmt-stat">
          <span className="mgmt-stat-vacant" /> <strong>{stats.vacant}</strong> Vacant
        </div>
        <div className="mgmt-stat">
          <Building2 size={14} /> <strong>{stats.deptCount}</strong> Departments
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mgmt-message mgmt-message--error"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          >
            {error}
            <button onClick={() => setError(null)}><X size={14} /></button>
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            className="mgmt-message mgmt-message--success"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          >
            <Check size={14} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ReactFlow Canvas */}
      <div className="mgmt-canvas">
        {loading ? (
          <div className="mgmt-loading">
            <div className="mgmt-loading-spinner" />
            <span>Loading organization hierarchy...</span>
          </div>
        ) : flowNodes.length === 0 ? (
          <div className="mgmt-empty">
            <Building2 size={48} style={{ opacity: 0.15, marginBottom: 16 }} />
            <h3>No Organization Structure</h3>
            <p>This tenant has no organization build yet. Use the Enterprise Wizard to create one, or add positions manually.</p>
            <button
              className="mgmt-btn mgmt-btn--add"
              onClick={() => { setEditTarget('new'); setAddParentId(null); }}
            >
              <Plus size={14} /> Add First Position
            </button>
          </div>
        ) : (
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            connectionLineStyle={{ stroke: '#FF5C00', strokeWidth: 2 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: '#94A3B8' },
              style: { stroke: '#94A3B8', strokeWidth: 1.5 },
            }}
          >
            <Background color="#CBD5E1" gap={20} size={1} />
            <Controls
              showInteractive={false}
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
            />
            <MiniMap
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
              nodeColor={(n) => {
                const ot = n.data?.occupantType;
                if (ot === 'HUMAN') return '#16A34A';
                if (ot === 'AI' || ot === 'AI_VACANT') return '#FF5C00';
                return '#94A3B8';
              }}
              maskColor="rgba(241, 245, 249, 0.7)"
            />
          </ReactFlow>
        )}
      </div>

      {/* Invite Modal */}
      {inviteTarget && (
        <InviteModal
          nodeId={inviteTarget}
          onClose={() => setInviteTarget(null)}
          onSubmit={handleInviteSubmit}
          loading={saving}
        />
      )}

      {/* Edit/Add Node Modal */}
      {editTarget && (
        <EditNodeModal
          node={editTarget === 'new' ? null : editNodeData}
          departments={departments}
          onClose={() => { setEditTarget(null); setAddParentId(null); }}
          onSubmit={handleEditSubmit}
          loading={saving}
        />
      )}
    </div>
  );
}
