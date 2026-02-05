"use client";

import { Lock, Unlock, Trash2 } from "lucide-react";
import { UserData } from "@/types/user";
import { confirmDanger } from "@/lib/confirm";
import { notify } from "@/lib/toast";

interface ActionButtonsProps {
  user: UserData;
  onToggleBlock: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}

export function ActionButtons({
  user,
  onToggleBlock,
  onDelete,
}: ActionButtonsProps) {
  const handleToggleBlock = async () => {
    const ok = await confirmDanger({
      title: user.isBlocked ? "Unblock user?" : "Block user?",
      text: user.isBlocked
        ? "This user will regain access to the platform."
        : "This user will be prevented from accessing the platform.",
      confirmText: user.isBlocked ? "Yes, unblock" : "Yes, block",
    });

    if (!ok) return;

    try {
      await onToggleBlock();
      notify.success(
        user.isBlocked ? "User unblocked successfully" : "User blocked successfully"
      );
    } catch (err) {
      console.error(err);
      notify.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async () => {
    const ok = await confirmDanger({
      title: "Delete user?",
      text: "This action is permanent and cannot be undone.",
      confirmText: "Yes, delete user",
    });

    if (!ok) return;

    try {
      await onDelete();
      notify.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete user");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">User Actions</h3>

      <div className="space-y-5"> {/* Increased spacing to prevent outlines from overlapping */}
        {/* BLOCK / UNBLOCK */}
        <button
          onClick={handleToggleBlock}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all 
            outline outline-2 outline-offset-[-4px] outline-white/60
            border-[3px] border-transparent
            ${
              user.isBlocked
                ? "bg-green-600 hover:bg-green-700 shadow-[0_0_0_2px_rgba(22,163,74,1)]"
                : "bg-blue-500 hover:bg-blue-600 shadow-[0_0_0_2px_rgba(59,130,246,1)]"
            }`}
        >
          {user.isBlocked ? (
            <Unlock className="h-4 w-4 text-white" />
          ) : (
            <Lock className="h-4 w-4 text-white" />
          )}
          {user.isBlocked ? "Unblock User" : "Block User"}
        </button>

        {/* DELETE USER */}
        <button
          onClick={handleDeleteUser}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all 
            bg-red-600 hover:bg-red-700
            outline outline-2 outline-offset-[-4px] outline-white/60
            border-[3px] border-transparent
            shadow-[0_0_0_2px_rgba(220,38,38,1)]"
        >
          <Trash2 className="h-4 w-4 text-white" />
          Delete User
        </button>
      </div>
    </div>
  );
}
