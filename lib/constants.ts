export const ROLES = {
  COURT_EMPLOYEE: 'court_employee',
  CITIZEN: 'citizen',
  LAWYER: 'lawyer',
  JUDGE: 'judge',
};

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
