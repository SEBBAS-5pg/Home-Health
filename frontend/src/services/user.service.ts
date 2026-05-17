import { User } from "@/types";
import { mockUsers } from "@/lib/mock-data";
import { IUserService } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class MockUserService implements IUserService {
  private users: User[] = [...mockUsers];

  async list() {
    await sleep(150);
    return this.users;
  }

  async getCurrent(): Promise<User | null> {
    await sleep(80);
    // En modo mock devolvemos siempre el primer cliente. Cuando haya backend
    // se reemplazará con la decodificación del JWT.
    return this.users.find((u) => u.role === "cliente") ?? null;
  }

  async updateProfile(id: string, data: Partial<Pick<User, "fullName" | "phone">>): Promise<User> {
    await sleep(200);
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("Usuario no encontrado");
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }
}

export const userService: IUserService = new MockUserService();
