export interface login {
  user: string;
  password: string;
}

export interface data {
  success: success;
  data: user | null;
}

export interface success {
  success: boolean;
}

export interface signup {
  user: string;
  password: string;
  email: string;
}

export interface user {
  id: number;
  rol_id: string;
  user: string;
  // password: string;
  image: string;
  email: string;
}
