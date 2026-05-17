import { Notification } from "@/types";
import { mockNotifications } from "@/lib/mock-data";
import { INotificationService } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class MockNotificationService implements INotificationService {
  private notifications: Notification[] = [...mockNotifications];

  async list(): Promise<Notification[]> {
    await sleep(120);
    return [...this.notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async markAsRead(id: string): Promise<void> {
    await sleep(80);
    const n = this.notifications.find((x) => x.id === id);
    if (n) n.read = true;
  }

  async unreadCount(): Promise<number> {
    return this.notifications.filter((n) => !n.read).length;
  }
}

export const notificationService: INotificationService = new MockNotificationService();
