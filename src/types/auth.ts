export type UserRole = "admin" | "manager" | "client";

export const isValidUserRole = (role: string): role is UserRole => {
  return ["admin", "manager", "client"].includes(role);
};