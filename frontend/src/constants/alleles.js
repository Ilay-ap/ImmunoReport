export const COMMON_ALLELES = [
  'HLA-A*01:01',
  'HLA-A*02:01',
  'HLA-A*02:03',
  'HLA-A*02:06',
  'HLA-A*03:01',
  'HLA-A*11:01',
  'HLA-A*23:01',
  'HLA-A*24:02',
  'HLA-A*26:01',
  'HLA-A*30:01',
  'HLA-A*30:02',
  'HLA-A*31:01',
  'HLA-A*32:01',
  'HLA-A*33:01',
  'HLA-A*68:01',
  'HLA-A*68:02',
  'HLA-B*07:02',
  'HLA-B*08:01',
  'HLA-B*15:01',
  'HLA-B*35:01',
  'HLA-B*40:01',
  'HLA-B*44:02',
  'HLA-B*44:03',
  'HLA-B*51:01',
  'HLA-B*53:01',
  'HLA-B*57:01',
  'HLA-B*58:01',
];

export const PREDICTION_METHODS = [
  { value: 'netmhcpan_el', label: 'NetMHCpan 4.1 EL (IEDB Recommended)' },
  { value: 'netmhcpan_ba', label: 'NetMHCpan 4.1 BA (Binding Affinity)' },
  { value: 'ann', label: 'ANN 4.0' },
  { value: 'smm', label: 'SMM' },
  { value: 'consensus', label: 'Consensus' },
];

export const PEPTIDE_LENGTHS = [8, 9, 10, 11];
