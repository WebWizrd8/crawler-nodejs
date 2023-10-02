import "dotenv/config";

export const DB_URL = process.env.DB_URL || "";
export const NOTIFICATION_SOCKET = process.env.NOTIFICATION_SOCKET || "/tmp/notification_socket"
