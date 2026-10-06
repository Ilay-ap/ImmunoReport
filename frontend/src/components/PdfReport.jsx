import React, { forwardRef } from 'react';

function AffinityBadgePrint({ affinity, color }) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '9px',
        fontWeight: 'bold',
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      {affinity}
    </span>
  );
}

const formatHeader = (key) => {
  const labels = {
    allele: 'Alelo', seq_num: 'Seq #', start: 'Início', end: 'Fim', length: 'Tam.',
    peptide: 'Peptídeo', percentile_rank: 'Rank %', binding_affinity: 'Afinidade',
    ic50: 'IC50 (nM)', score: 'Score', ann_ic50: 'ANN IC50', ann_rank: 'ANN Rank',
    smm_ic50: 'SMM IC50', smm_rank: 'SMM Rank', position: 'Pos.', residue: 'Resíduo',
  };
  return labels[key] || key.replace(/_/g, ' ').toUpperCase();
};

const PdfReport = forwardRef(function PdfReport(
  { data, logo, chartImageBase64, metadata, customProps },
  ref
) {
  const { reportTitle, reportAuthor, reportNotes } = customProps || {};
  const now = new Date().toLocaleString('pt-BR');
  
  if (!data || data.length === 0) return null;

  const strongCount = data.filter(r => r.binding_affinity === 'Strong').length;
  const intermediateCount = data.filter(r => r.binding_affinity === 'Intermediate').length;
  const weakCount = data.filter(r => r.binding_affinity === 'Weak').length;

  let availableKeys = Object.keys(data[0]).filter(k => k !== 'color_code');
  availableKeys = availableKeys.filter(k => k !== 'binding_affinity');
  availableKeys.push('binding_affinity');

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11px',
        color: '#1a1a1a',
        backgroundColor: '#fff',
        padding: '10mm',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #1e3a8a', paddingBottom: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '30%' }}>
          {logo && <img src={logo} alt="Logo" style={{ maxHeight: '60px', maxWidth: '100%' }} />}
        </div>
        <div style={{ textAlign: 'right', flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px 0' }}>
            {reportTitle || 'T Cell Prediction - Class I (MHC)'}
          </h1>
          {reportAuthor && <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', margin: '0 0 3px 0' }}>{reportAuthor}</p>}
          <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Gerado em: {now}</p>
        </div>
      </div>

      {/* Metadata */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
        <table style={{ width: '100%', fontSize: '11px', borderSpacing: '0 4px', borderCollapse: 'separate' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%' }}><strong>Método Algorítmico:</strong> {metadata?.method || 'N/A'}</td>
              <td style={{ width: '50%' }}><strong>Comprimento(s):</strong> {metadata?.lengths?.join(', ') || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Alelo(s) Analisado(s):</strong> {metadata?.alleles?.join(', ') || 'N/A'}</td>
              <td><strong>Total de Peptídeos:</strong> {data.length}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <strong style={{marginRight: '12px'}}>Resumo de Afinidade:</strong>
                <span style={{ color: '#166534', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>■ Strong: {strongCount}</span>
                <span style={{ color: '#854d0e', backgroundColor: '#fef9c3', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>■ Intermediate: {intermediateCount}</span>
                <span style={{ color: '#334155', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>■ Weak: {weakCount}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Chart */}
      {chartImageBase64 && (
        <div style={{ marginBottom: '20px', textAlign: 'center', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#334155' }}>Perfil de Afinidade por Posição</h3>
          <img src={chartImageBase64} alt="Chart" style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px' }} />
        </div>
      )}

      {/* Full Table */}
      <h3 style={{ fontSize: '14px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px', color: '#0f172a' }}>Resultados Detalhados (Completo)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', marginBottom: '20px', tableLayout: 'auto' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>
            {availableKeys.map(key => (
              <th key={key} style={{ padding: '6px', textAlign: key === 'allele' || key === 'peptide' ? 'left' : 'center', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                {formatHeader(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc', pageBreakInside: 'avoid' }}>
              {availableKeys.map(key => {
                if (key === 'binding_affinity') {
                  return (
                    <td key={key} style={{ padding: '4px 6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <AffinityBadgePrint affinity={row[key]} color={row.color_code} />
                    </td>
                  );
                }
                const isString = typeof row[key] === 'string';
                const isNum = typeof row[key] === 'number';
                return (
                  <td key={key} style={{ 
                    padding: '4px 6px', 
                    border: '1px solid #e2e8f0', 
                    textAlign: key === 'allele' || key === 'peptide' ? 'left' : 'center',
                    fontFamily: key === 'allele' || key === 'peptide' ? 'monospace' : 'inherit',
                    fontWeight: key === 'peptide' ? 'bold' : 'normal',
                    whiteSpace: 'nowrap'
                  }}>
                    {isNum ? row[key].toFixed(3) : (row[key] !== null ? row[key] : '-')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Notes / Conclusion */}
      {reportNotes && (
        <div style={{ pageBreakInside: 'avoid', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', backgroundColor: '#fff' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 8px 0', color: '#0f172a' }}>Observações e Conclusões</h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#334155', lineHeight: '1.4' }}>{reportNotes}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '10px', fontSize: '9px', color: '#64748b', textAlign: 'center', pageBreakInside: 'avoid' }}>
        <p style={{ margin: '0 0 4px 0' }}>Predições geradas através do algoritmo NetMHCpan via integração oficial com a API do IEDB (Immune Epitope Database).</p>
        <p style={{ margin: 0 }}>Este relatório é uma ferramenta de triagem in silico preditiva e os resultados devem ser validados experimentalmente (in vitro/in vivo).</p>
      </div>
    </div>
  );
});

export default PdfReport;
