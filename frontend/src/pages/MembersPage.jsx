import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { companyApi } from '../services/companyApi.js';
import { useAuthStore } from '../store/authStore.js';

export function MembersPage() {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');
  
  const tenantId = useAuthStore(s => s.activeTenantId);

  useEffect(() => {
    if (tenantId) {
      loadMembers();
    }
  }, [tenantId]);

  const loadMembers = async () => {
    try {
      const { data } = await companyApi.getMembers(tenantId);
      setMembers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInviteLink('');
    try {
      const { data } = await companyApi.inviteMember(tenantId, email);
      setInviteLink(`${window.location.origin}/invite/${data.token}`);
      setEmail('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (membershipId) => {
    try {
      await companyApi.removeMember(tenantId, membershipId);
      loadMembers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSuspend = async (membershipId) => {
    try {
      await companyApi.suspendMember(tenantId, membershipId);
      loadMembers();
    } catch (e) {
      alert(e.message);
    }
  };

  if (!tenantId) return <div>Please select a workspace first.</div>;

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>Workspace Members</h1>
      
      <Card style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 'var(--space-4)' }}>Invite New Member</h2>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border-primary)', background: 'var(--color-bg-primary)', color: 'white' }}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Inviting...' : 'Send Invite'}</Button>
        </form>
        {error && <div style={{ color: 'var(--color-accent-rose)', marginTop: 'var(--space-2)', fontSize: 14 }}>{error}</div>}
        {inviteLink && (
          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 6 }}>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Share this link with the user:</p>
            <code style={{ display: 'block', padding: 8, background: 'var(--color-bg-primary)', borderRadius: 4, wordBreak: 'break-all' }}>
              {inviteLink}
            </code>
          </div>
        )}
      </Card>

      <Card style={{ padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 'var(--space-4)' }}>Active Members</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {members.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', border: '1px solid var(--color-border-primary)', borderRadius: 6 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.userId}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', gap: 8, marginTop: 4 }}>
                  <span>{m.membershipType}</span>
                  <span>•</span>
                  <span style={{ color: m.status === 'ACTIVE' ? 'var(--color-accent-emerald)' : m.status === 'SUSPENDED' ? 'var(--color-accent-amber)' : 'var(--color-accent-rose)' }}>{m.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {m.status === 'ACTIVE' && (
                  <Button variant="ghost" size="sm" onClick={() => handleSuspend(m.id)}>Suspend</Button>
                )}
                <Button variant="danger" size="sm" onClick={() => handleRemove(m.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
