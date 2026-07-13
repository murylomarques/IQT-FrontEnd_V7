// ── Hierarchy helpers ─────────────────────────────────────────────────────────
const hierMatchStr = (node, q) =>
  !q ||
  (node.name        || '').toLowerCase().includes(q.toLowerCase()) ||
  (node.employee_id || '').toLowerCase().includes(q.toLowerCase()) ||
  (node.cpf         || '').toLowerCase().includes(q.toLowerCase());

export const hierMatchNode = (node, q) =>
  hierMatchStr(node, q) ||
  (node.subordinates || []).some((s) =>
    hierMatchStr(s, q) || (s.subordinates || []).some((t) => hierMatchStr(t, q))
  );

const LEVEL_STYLE = {
  0: { bg: 'rgba(174,46,42,0.08)', border: 'rgba(174,46,42,0.25)', label: 'Coordenador', labelColor: '#ae2e2a' },
  1: { bg: 'rgba(212,113,32,0.07)', border: 'rgba(212,113,32,0.22)', label: 'Supervisor', labelColor: '#d47120' },
  2: { bg: 'rgba(53,48,45,0.04)', border: 'rgba(53,48,45,0.12)', label: 'Técnico', labelColor: '#5a5551' },
};

export const HierNode = ({ node, depth = 0, search = '' }) => {
  const s = LEVEL_STYLE[depth] || LEVEL_STYLE[2];
  const subs = node.subordinates || [];
  const visibleSubs = search
    ? subs.filter((sub) =>
        hierMatchStr(sub, search) || (sub.subordinates || []).some((t) => hierMatchStr(t, search))
      )
    : subs;

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      padding: depth === 0 ? '1rem 1.1rem' : depth === 1 ? '0.75rem 1rem' : '0.55rem 0.9rem',
      marginLeft: depth * 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: s.labelColor,
          background: 'rgba(255,255,255,0.7)', borderRadius: 4,
          padding: '2px 7px', border: `1px solid ${s.border}`,
        }}>
          {s.label}
        </span>
        <span style={{ fontWeight: depth === 0 ? 700 : depth === 1 ? 600 : 500, fontSize: depth === 0 ? '0.97rem' : '0.88rem' }}>
          {node.name}
        </span>
        {node.employee_id && (
          <span style={{ fontSize: '0.76rem', color: '#9a948f', background: 'rgba(255,255,255,0.6)', borderRadius: 4, padding: '1px 6px' }}>
            Mat: <strong>{node.employee_id}</strong>
          </span>
        )}
        {node.cpf && (
          <span style={{ fontSize: '0.76rem', color: '#9a948f', background: 'rgba(255,255,255,0.6)', borderRadius: 4, padding: '1px 6px' }}>
            CPF: <strong>{node.cpf}</strong>
          </span>
        )}
        {node.empresa && (
          <span style={{ fontSize: '0.74rem', color: '#5a5551', background: 'rgba(255,255,255,0.75)', borderRadius: 4, padding: '1px 7px', fontStyle: 'italic' }}>
            {node.empresa}
          </span>
        )}
        {node.regional && (
          <span style={{ fontSize: '0.72rem', color: '#9a948f', marginLeft: 'auto' }}>{node.regional}</span>
        )}
      </div>
      {visibleSubs.length > 0 && (
        <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {visibleSubs.map((sub) => (
            <HierNode key={sub.id} node={sub} depth={depth + 1} search={search} />
          ))}
        </div>
      )}
    </div>
  );
};
