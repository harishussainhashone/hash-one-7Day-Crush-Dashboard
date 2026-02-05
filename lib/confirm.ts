// lib/confirm.ts
import Swal from "sweetalert2";

interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}

// For dangerous actions (delete, block, etc.)
export async function confirmDanger({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmText = "Yes, proceed",
  cancelText = "Cancel"
}: ConfirmOptions = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626", // red-600
    cancelButtonColor: "#6b7280", // gray-500
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
}

// For success/neutral actions (resolve, approve, etc.)
export async function confirmSuccess({
  title = "Are you sure?",
  text = "Please confirm your action.",
  confirmText = "Yes, continue",
  cancelText = "Cancel"
}: ConfirmOptions = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#059669", // emerald-600
    cancelButtonColor: "#6b7280", // gray-500
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
}

// For information confirmations
export async function confirmInfo({
  title = "Please confirm",
  text = "Do you want to proceed?",
  confirmText = "Yes, confirm",
  cancelText = "No, cancel"
}: ConfirmOptions = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#2563eb", // blue-600
    cancelButtonColor: "#6b7280", // gray-500
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
}

// For success notifications (non-interactive)
export function showSuccess({
  title = "Success!",
  text = "Operation completed successfully.",
  timer = 3000
}: {
  title?: string;
  text?: string;
  timer?: number;
}) {
  Swal.fire({
    title,
    text,
    icon: "success",
    timer,
    showConfirmButton: false,
  });
}