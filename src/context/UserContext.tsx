"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  roleTitle?: string;
  _count?: {
    ownedDocuments: number;
    shares: number;
  };
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  isDrawerOpen: boolean;
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default fallback users if API is loading
const SEEDED_USERS_DEFAULT: User[] = [
  {
    id: "user-alice",
    name: "Alice Johnson",
    email: "alice@ajaia.com",
    avatarUrl: null,
    roleTitle: "Team Lead & Document Owner",
  },
  {
    id: "user-bob",
    name: "Bob Smith",
    email: "bob@ajaia.com",
    avatarUrl: null,
    roleTitle: "Full Stack Engineer",
  },
  {
    id: "user-charlie",
    name: "Charlie Davis",
    email: "charlie@ajaia.com",
    avatarUrl: null,
    roleTitle: "Product Designer / Reviewer",
  },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEEDED_USERS_DEFAULT);
  const [currentUser, setCurrentUser] = useState<User | null>(SEEDED_USERS_DEFAULT[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedUsers = data.map((u: any) => ({
            ...u,
            roleTitle:
              u.id === "user-alice"
                ? "Team Lead & Document Owner"
                : u.id === "user-bob"
                ? "Full Stack Engineer"
                : "Product Reviewer",
          }));
          setUsers(mappedUsers);

          // Restore saved user or default to first
          const savedUserId = typeof window !== "undefined" ? localStorage.getItem("ajaia_active_user") : null;
          const matched = mappedUsers.find((u: any) => u.id === savedUserId);
          if (matched) {
            setCurrentUser(matched);
          } else {
            setCurrentUser(mappedUsers[0]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (userId: string) => {
    const selected = users.find((u) => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      if (typeof window !== "undefined") {
        localStorage.setItem("ajaia_active_user", selected.id);
        document.cookie = `ajaia_user_id=${selected.id}; path=/; max-age=86400`;
      }
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        isDrawerOpen,
        setCurrentUser,
        switchUser,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
