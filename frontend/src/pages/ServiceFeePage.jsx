import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, Flame, Lock, CheckCircle,
  BarChart3, Cpu, Wallet
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useServiceFeeStore } from '../store/serviceFeeStore.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { platformApi } from '../services/platformApi.js';

/**
 * Sovereign Protocol — Module 2: Service Fee Engine Page
 * Deterministic revenue distribution with HITL pay actions.
 */
function ServiceFeePage() {
  const user = useAuthStore(s => s.user);
  const {
    revenueDistribution, burnRate, agentROI, payQueue, isLoading,
    setRevenueDistribution, setBurnRate, setAgentROI,
    requestPayDistribution, signPayDistribution, setLoading,
  } = useServiceFeeStore();
  const { can } = usePermission();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [revData, burnData, roiData] = await Promise.all([
          platformApi.getRevenueDistribution(),
          platformApi.getComputeBurnRate(),
          platformApi.getAgentROI(),
        ]);
        setRevenueDistribution(revData);
        setBurnRate(burnData);
        setAgentROI(roiData);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
      setLoading(false);
    };
    loadData();
  }, [dataLoaded]);

  const handleRequestPay = () => {
    requestPayDistribution({
      type: 'monthly_distribution',
      amount: revenueDistribution.totalRevenue,
      currency: 'USD',
      recipient: 'All Channels',
      description: `Monthly revenue distribution`,
    });
    AuditLogger.log({
      action: AUDIT_ACTIONS.PAY_DISTRIBUTION_REQUEST,
      userId: user?.id,
      context: 'service_fee_engine',
    });
  };

  const handleSign = (payId) => {
    signPayDistribution(payId, user?.id);
    AuditLogger.log({
      action: AUDIT_ACTIONS.PAY_DISTRIBUTION_SIGNED,
      userId: user?.id,
      context: 'service_fee_engine',
    });
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={14} style={{ color: '#059669' }} />;
    if (trend === 'down') return <TrendingDown size={14} style={{ color: '#dc2626' }} />;
    return <Minus size={14} style={{ color: '#94a3b8' }} />;
  };

  if (isLoading && !dataLoaded) {
    return (
      <div className="service-fee-page">
        <div className="page-header">
          <h1 className="page-title">Service Fee Engine</h1>
          <p className="page-subtitle">Loading financial data</p>
        </div>
        <Card><div className="skeleton" style={{ height: 300 }} /></Card>
      </div>
    );
  }

  const rd = revenueDistribution;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div className="service-fee-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title">Service Fee Engine</h1>
        <p className="page-subtitle">
          Deterministic revenue distribution and operational cost tracking
        </p>
      </motion.div>

      {/* HITL Notice */}
      <motion.div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb' }} variants={itemVariants}>
        <Lock size={14} style={{ color: '#d97706', flexShrink: 0 }} />
        <span>All distribution actions require human authorization. No AI agent can trigger transactions.</span>
      </motion.div>

      {/* Revenue Distribution */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Revenue Distribution
          </h3>
          <Badge color="blue">{rd.period}</Badge>
        </div>

        {/* Formula */}
        <div className="revenue-formula">
          <span className="formula-var">R<sub>total</sub></span> =
          <span className="formula-var">C<sub>treasury</sub></span> +
          <span className="formula-var">C<sub>ops</sub></span> +
          <span className="formula-var">C<sub>agent</sub></span> +
          <span className="formula-var">C<sub>platform</sub></span>
        </div>

        {/* Total */}
        <div className="revenue-total-display">
          <div className="revenue-total-value">${rd.totalRevenue.toLocaleString()}</div>
          <div className="revenue-total-label">Total Revenue This Period</div>
        </div>

        {/* Flow Bars */}
        <div className="revenue-flow-bars">
          {[
            { key: 'treasury', label: 'Treasury', data: rd.treasury, cls: 'treasury' },
            { key: 'operations', label: 'Operations', data: rd.operations, cls: 'operations' },
            { key: 'agentFees', label: 'Agent Fees', data: rd.agentFees, cls: 'agent-fees' },
            { key: 'platform', label: 'Platform', data: rd.platform, cls: 'platform' },
          ].map((item, i) => (
            <motion.div key={item.key} className="revenue-flow-item" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }}>
              <span className="revenue-flow-label">{item.label}</span>
              <div className="revenue-flow-bar-track">
                <motion.div
                  className={`revenue-flow-bar-fill ${item.cls}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.data.percent}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span className="revenue-flow-amount">${item.data.amount.toLocaleString()}</span>
                </motion.div>
              </div>
              <span className="revenue-flow-percent">{item.data.percent}%</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-primary)' }}>
          <button className="btn btn-primary" onClick={handleRequestPay} disabled={!can('canSignPayDistribution')} id="request-pay-btn">
            <Lock size={13} /> Request Distribution
          </button>
        </div>
      </Card>
      </motion.div>

      {/* Burn Tracker */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <Flame size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Compute Burn Rate
          </h3>
          <Badge color={burnRate.runwayDays < 14 ? 'rose' : burnRate.runwayDays < 30 ? 'amber' : 'emerald'}>
            {burnRate.runwayDays} days runway
          </Badge>
        </div>

        <div className="burn-tracker-grid">
          {[
            { label: 'Current Rate', value: `$${burnRate.currentRate.toFixed(2)}/hr` },
            { label: 'Daily Average', value: `$${burnRate.dailyAverage.toFixed(0)}` },
            { label: 'Weekly Total', value: `$${burnRate.weeklyTotal.toFixed(0)}` },
            { label: 'Ops Balance', value: `$${burnRate.opsWalletBalance.toFixed(0)}` },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="burn-metric-card">
                <div className="burn-metric-value">{m.value}</div>
                <div className="burn-metric-label">{m.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Providers Table */}
        <div className="m2-subsection-header">Compute Providers</div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr><th>Provider</th><th>Type</th><th>Rate</th><th>Usage</th><th style={{ textAlign: 'right' }}>Cost</th></tr>
            </thead>
            <tbody>
              {burnRate.providers.map(p => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 'var(--font-semibold)' }}>{p.name}</td>
                  <td><span className={`provider-type ${p.type}`}>{p.type}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${p.costPerHour}/hr</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{p.usageHours}h</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>${p.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      </motion.div>

      {/* Agent ROI */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Agent Yield (ROI of Labor)
          </h3>
        </div>
        <div className="roi-grid">
          {agentROI.map((agent, i) => (
            <motion.div key={agent.agentId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className={`roi-card trend-${agent.trend}`}>
                <div className="roi-header">
                  <span className="roi-agent-name">{agent.agentName}</span>
                  {getTrendIcon(agent.trend)}
                </div>
                <div className="m2-roi-main">
                  <span className={`roi-value ${agent.roi >= 200 ? 'positive' : ''}`}>{agent.roi}%</span>
                  <span className="m2-roi-label">ROI</span>
                </div>
                <div className="m2-roi-compare">
                  <span>Generated: <strong style={{ color: '#059669' }}>${agent.valueGenerated.toLocaleString()}</strong></span>
                  <span>Cost: <strong style={{ color: '#dc2626' }}>${agent.maintenanceCost.toLocaleString()}</strong></span>
                </div>
                <ProgressBar value={agent.valueGenerated} max={agent.valueGenerated + agent.maintenanceCost} />
                <div className="roi-breakdown">
                  <div className="roi-breakdown-item"><span>Compute</span><span className="roi-breakdown-value">${agent.computeCost}</span></div>
                  <div className="roi-breakdown-item"><span>Memory</span><span className="roi-breakdown-value">${agent.memoryCost}</span></div>
                  <div className="roi-breakdown-item"><span>API</span><span className="roi-breakdown-value">${agent.apiCost}</span></div>
                  <div className="roi-breakdown-item"><span>Total</span><span className="roi-breakdown-value">${agent.maintenanceCost}</span></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
      </motion.div>

      {/* Pay Queue */}
      {payQueue.length > 0 && (
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Distribution Queue</h3>
            <Badge color="amber">{payQueue.filter(p => p.status === 'awaiting_signature').length} pending</Badge>
          </div>
          <div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb', marginBottom: 'var(--space-4)' }}>
            <Lock size={13} style={{ color: '#d97706' }} />
            <span>Each distribution requires a human signature before execution.</span>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr><th>Status</th><th>Description</th><th style={{ textAlign: 'right' }}>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {payQueue.map(pay => (
                  <tr key={pay.id}>
                    <td>
                      <span className={`pay-status ${pay.status === 'awaiting_signature' ? 'awaiting' : pay.status}`}>
                        {pay.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{pay.description}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>
                      ${pay.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {pay.status === 'awaiting_signature' && can('canSignPayDistribution') && (
                        <button className="btn btn-success btn-sm" onClick={() => handleSign(pay.id)} id={`sign-pay-${pay.id}`}>
                          <CheckCircle size={13} /> Sign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export { ServiceFeePage };
