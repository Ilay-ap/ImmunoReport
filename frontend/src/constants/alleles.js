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

export const COMMON_ALLELES_MHCII = [
  'HLA-DRB1*01:01',
  'HLA-DRB1*03:01',
  'HLA-DRB1*04:01',
  'HLA-DRB1*04:05',
  'HLA-DRB1*07:01',
  'HLA-DRB1*08:02',
  'HLA-DRB1*09:01',
  'HLA-DRB1*11:01',
  'HLA-DRB1*12:01',
  'HLA-DRB1*13:02',
  'HLA-DRB1*15:01',
  'HLA-DQA1*05:01/DQB1*02:01',
  'HLA-DQA1*05:01/DQB1*03:01',
  'HLA-DQA1*03:01/DQB1*03:02',
  'HLA-DPA1*01/DPB1*04:01',
  'HLA-DPA1*01:03/DPB1*02:01',
  'HLA-DPA1*02:01/DPB1*01:01',
];

export const PREDICTION_METHODS_MHCII = [
  { value: 'netmhciipan', label: 'NetMHCIIpan 4.1' },
  { value: 'nn_align', label: 'NN-align 2.3' },
  { value: 'smm_align', label: 'SMM-align' },
  { value: 'consensus', label: 'Consensus (IEDB Recommended)' },
];
