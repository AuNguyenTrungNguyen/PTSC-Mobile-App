export default class Constant {

  //ROUTE
  static ROUTE__AUTH = 'AUTH';
  static ROUTE__LOGIN = 'LOGIN';
  static ROUTE__HOME = 'HOME';
  static ROUTE__CAMERA = 'CAMERA';
  static ROUTE__PDF = 'PDF';
  static ROUTE__COMMON = 'COMMON_STACK';

  static ROUTE__PIPING = 'PIPING';
  static ROUTE__PIP_CONS = 'PIP-CONS';
  static ROUTE__PIP_QC = 'PIP-QC';
  static ROUTE__PIP_QCDEPT = 'PIP-QCDEPT';
  static ROUTE__PIP_QCWS = 'PIP-QCWS';
  static ROUTE__PIP_VIEWER = 'PIP-VIEWER';

  static ROUTE__STRUCTURAL = 'STRUCTURAL';
  static ROUTE__STR_CONS = 'STR-CONS';
  static ROUTE__STR_QCDEPT = 'STR-QCDEPT';
  static ROUTE__STR_QCWS = 'STR-QCWS';

  //-- CAMERA SOURCE
  static CAMERA_PIP_CONS_DIM = 'CAMERA_PIP_CONS_DIM';
  static CAMERA_PIP_CONS = 'CAMERA_PIP_CONS';
  static CAMERA_PIP_QC = 'CAMERA_PIP_QC';

  //-- IMAGE ROLE
  static IMAGE_ROLE_CONS = 'CONS';
  static IMAGE_ROLE_QC = 'QC';

  // CODE FILTER
  static FILTER_ALL = 'ALL';
  static FILTER_NOT_YET = 'NOT_YET';
  static FILTER_ALREADY = 'ALREADY';
  static FILTER_MY = 'MY';
  static FILTER_THEIR = 'THEIR';

  // CODE TYPE
  static CODE_FITUP = 'FitUp';
  static CODE_WELD = 'Weld';
  static CODE_VISUAL = 'Visual';
  static CODE_CUT = 'Cut';
  static CODE_PAINT = 'Paint';
  static CODE_DIM = 'Dim';

  // CODE IMAGE
  static CODE_MAN_HOURS_IMPACT = 'WOFactor';

  static PIECE_MARK_ALL = 'ALL';
  static PIECE_MARK_CHECKED = 'CHECKED';
  static PIECE_MARK_UNCHECKED = 'UNCHECKED';

  static EMPTY_VALUE_STRING = 'EMPTY_VALUE';
  static COLUMN_CHANGE = 'ColumnChange';

  //STATUS
  static STATUS_DRAFT = 'Draft';
  static STATUS_FINAL = 'Final';
  static STATUS_ACCEPT = 'ACC';
  static STATUS_REJECT = 'REJ';
  static STATUS_NOT_YET = 'NOT_YET';

  //QA Observation
  static QA_OBSERVATION_DRAFT = 0;
  static QA_OBSERVATION_FINAL = 1;

  //ID
  static ID_TBA = 'TBA';

  //OPTION
  static OPTION_YES = 'Yes';
  static OPTION_NO = 'No';

  //NDT
  static NDT_MT_CODE = 'MT';
  static NDT_PT_CODE = 'PT';
  static NDT_RT_CODE = 'RT';
  static NDT_UT_CODE = 'UT';
  static NDT_PAUT_CODE = 'PAUT';

  static NDT_ACTUAL_ALL = 'ALL TYPE';
  static NDT_ACTUAL_FIELD = 'FIELD';
  static NDT_ACTUAL_SHOP = 'SHOP';
  static NDT_EMPTY_VALUE = '';

  static NDT_RESULT_ACC = 'ACC';
  static NDT_RESULT_REJ = 'REJ';
  static NDT_RESULT_EMPTY = null;

  static NDT_KEY_RESULT = 'NDTResult';
};
