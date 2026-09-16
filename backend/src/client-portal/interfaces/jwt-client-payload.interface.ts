export interface JwtClientPayload {
  sub: string;
  email: string | null;
  type: 'client';
}
