const VALID_AA = /^[ACDEFGHIKLMNPQRSTVWY]+$/;

export function sanitizeInput(rawText) {
  const lines = rawText.split('\n');
  const cleaned = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) return trimmed;
    return trimmed.replace(/[^A-Za-z]/g, '').toUpperCase();
  }).filter(line => line.length > 0);
  return cleaned.join('\n');
}

export function validateSequences(rawText) {
  if (!rawText || !rawText.trim()) {
    return { isValid: false, errors: ['Nenhuma sequência fornecida.'], sequenceCount: 0 };
  }
  
  const lines = rawText.split('\n');
  const errors = [];
  let sequenceCount = 0;
  let hasSequenceContent = false;
  const isFasta = lines.some(l => l.trim().startsWith('>'));

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('>')) {
      sequenceCount++;
      return;
    }
    hasSequenceContent = true;
    const cleaned = trimmed.replace(/\s/g, '').toUpperCase();
    if (!VALID_AA.test(cleaned)) {
      const invalid = [...new Set(cleaned.replace(/[ACDEFGHIKLMNPQRSTVWY]/g, '').split(''))];
      errors.push(`Linha ${idx + 1}: caracteres inválidos: ${invalid.join(', ')}`);
    }
  });

  if (!isFasta && hasSequenceContent) sequenceCount = 1;
  if (!hasSequenceContent) {
    errors.push('Nenhuma sequência de aminoácidos encontrada.');
  }

  return { isValid: errors.length === 0, errors, sequenceCount };
}
