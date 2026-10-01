import React, { forwardRef } from 'react';

const VariantPdfReport = forwardRef(function VariantPdfReport(
  { data, logo, customProps },
  ref
) {
  const now = new Date().toLocaleString('pt-BR');
  
  const escapeCount = data.filter(r => r.escape).length;
  const noEscapeCount = data.length - escapeCount;

  return (
    <div
      ref={ref}
      className="print-area"
      style={{
        width: '100%',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11px',
        color: '#1a1a1a',
        backgroundColor: '#fff',
        padding: '15mm',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #059669', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {logo && <img src={logo} alt="Logo" style={{ height: '50px' }} />}
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#064e3b', margin: 0 }}>
            {customProps?.reportTitle || 'Relatório de Comparação de Variantes'}
          </h1>
          <p style={{ fontSize: '10px', color: '#666', margin: '4px 0 0' }}>{now}</p>
        </div>
      </div>

      {/* Metadata */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px', marginBottom: '15px' }}>
        <table style={{ width: '100%', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '3px 8px' }}><strong>Pesquisador/Lab:</strong> {customProps?.reportAuthor || 'Não informado'}</td>
              <td style={{ padding: '3px 8px' }}><strong>Total de Pares Analisados:</strong> {data.length}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: '3px 8px' }}>
                <strong>Resumo de Fuga Imunológica (Escape):</strong>{' '}
                <span style={{ color: '#dc2626' }}>■ Detectado: {escapeCount}</span>{' | '}
                <span style={{ color: '#059669' }}>■ Não Detectado: {noEscapeCount}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Full Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: '#1e293b', color: '#fff', padding: '6px 4px', textAlign: 'left' }}>Alelo</th>
            <th style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '6px 4px', textAlign: 'left' }}>WT Peptídeo</th>
            <th style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '6px 4px', textAlign: 'center' }}>WT Rank</th>
            <th style={{ backgroundColor: '#7f1d1d', color: '#fff', padding: '6px 4px', textAlign: 'left' }}>MUT Peptídeo</th>
            <th style={{ backgroundColor: '#7f1d1d', color: '#fff', padding: '6px 4px', textAlign: 'center' }}>MUT Rank</th>
            <th style={{ backgroundColor: '#1e293b', color: '#fff', padding: '6px 4px', textAlign: 'center' }}>Fold Change</th>
            <th style={{ backgroundColor: '#1e293b', color: '#fff', padding: '6px 4px', textAlign: 'center' }}>Escape</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb', pageBreakInside: 'avoid' }}>
              <td style={{ padding: '5px 4px', fontFamily: 'monospace', borderBottom: '1px solid #e2e8f0' }}>{row.allele}</td>
              <td style={{ padding: '5px 4px', fontFamily: 'monospace', fontWeight: 'bold', color: '#1e3a8a', borderBottom: '1px solid #e2e8f0' }}>{row.wt_peptide}</td>
              <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{row.wt_rank.toFixed(3)}</td>
              <td style={{ padding: '5px 4px', fontFamily: 'monospace', fontWeight: 'bold', color: '#7f1d1d', borderBottom: '1px solid #e2e8f0' }}>{row.mut_peptide}</td>
              <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{row.mut_rank.toFixed(3)}</td>
              <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>{row.fold_change.toFixed(2)}x</td>
              <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ 
                  backgroundColor: row.escape ? '#fee2e2' : '#d1fae5', 
                  color: row.escape ? '#991b1b' : '#065f46',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  {row.escape ? 'SIM' : 'NÃO'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Notes */}
      {customProps?.reportNotes && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f1f5f9', borderLeft: '4px solid #059669', fontSize: '10px' }}>
          <strong>Observações da Análise:</strong><br/>
          <span style={{ whiteSpace: 'pre-wrap' }}>{customProps.reportNotes}</span>
        </div>
      )}

      <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#666', textAlign: 'center' }}>
        <p>Relatório Analítico de Comparação de Variantes (Wild Type vs Mutante) - ImmunoReport.</p>
        <p>Predições geradas com base no risco de fuga imunológica computacional.</p>
      </div>
    </div>
  );
});

export default VariantPdfReport;
