// src/types/socket.io.d.ts
import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: {
      userId: string;
    };
  }
}
