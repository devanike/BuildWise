export type AuthActionState = {
  error?: string;
  success?: string;
  values?: {
    name?: string;
    email?: string;
  };
  nonce?: number;
};

export type SignUpFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInFields = {
  email: string;
  password: string;
};
