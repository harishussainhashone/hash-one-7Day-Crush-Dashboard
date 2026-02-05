"use client";

import { useState } from "react";
import { UserData } from "@/types/user";
import { Trash2, CheckSquare, Square } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import { confirmDanger } from "@/lib/confirm";
import { notify } from "@/lib/toast";

interface PersonalityQuizTabProps {
  user: UserData;
}

export function PersonalityQuizTab({ user }: PersonalityQuizTabProps) {
  const [quizQuestions, setQuizQuestions] = useState(
    user.personalityQuizQuestions || []
  );
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Handle single question deletion
  const handleDeleteQuestion = async (questionId: number) => {
    if (!user._id || deletingIds.includes(questionId)) return;

    const ok = await confirmDanger({
      title: "Delete personality question?",
      text: "This question will be permanently removed from the user's quiz.",
      confirmText: "Yes, delete",
    });

    if (!ok) return;

    try {
      setDeletingIds((prev) => [...prev, questionId]);

      const res = await apiFetch(
        `/quiz/user/${user._id}/personality-questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete personality quiz question");
      }

      // Update UI
      setQuizQuestions((prev) =>
        prev.filter((question) => question.id !== questionId)
      );
      
      // Remove from selected if it was selected
      setSelectedQuestions((prev) =>
        prev.filter((id) => id !== questionId)
      );

      notify.success("Personality quiz question deleted");
    } catch (err: any) {
      console.error(err);
      notify.error(err.message || "Failed to delete question");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== questionId));
    }
  };

  // Handle multiple question deletion
  const handleDeleteMultipleQuestions = async () => {
    if (!user._id || deletingMultiple || selectedQuestions.length === 0) return;

    const ok = await confirmDanger({
      title: `Delete ${selectedQuestions.length} questions?`,
      text: "These questions will be permanently removed from the user's quiz.",
      confirmText: "Yes, delete all",
    });

    if (!ok) return;

    try {
      setDeletingMultiple(true);

      const res = await apiFetch(
        `/quiz/user/${user._id}/personality-questions`,
        {
          method: "DELETE",
          body: JSON.stringify({
            questionIds: selectedQuestions,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete personality quiz questions");
      }

      // Update UI
      setQuizQuestions((prev) =>
        prev.filter((question) => !selectedQuestions.includes(question.id))
      );

      notify.success(`${selectedQuestions.length} questions deleted`);
      setSelectedQuestions([]); // Clear selection
      setSelectionMode(false); // Exit selection mode after deletion
    } catch (err: any) {
      console.error(err);
      notify.error(err.message || "Failed to delete questions");
    } finally {
      setDeletingMultiple(false);
    }
  };

  // Toggle question selection
  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedQuestions.length === quizQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(quizQuestions.map((q) => q.id));
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    if (selectionMode) {
      // Exit selection mode
      setSelectionMode(false);
      setSelectedQuestions([]); // Clear all selections when exiting
    } else {
      // Enter selection mode
      setSelectionMode(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Personality Quiz Questions ({quizQuestions.length})
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Select Button - Always visible */}
          <button
            onClick={toggleSelectionMode}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectionMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {selectionMode ? (
              <>
               
                Cancel Selection
              </>
            ) : (
              <>
                
                Select
              </>
            )}
          </button>
          
          {/* Delete Selected Button - Only shows when in selection mode and has selections */}
          {selectionMode && selectedQuestions.length > 0 && (
            <button
              onClick={handleDeleteMultipleQuestions}
              disabled={deletingMultiple}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
                       flex items-center gap-2"
            >
              {deletingMultiple ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedQuestions.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {quizQuestions.length > 0 ? (
        <div className="space-y-3">
          {/* Select All Controls - Only shows when in selection mode */}
          {selectionMode && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="selectAll"
                checked={
                  quizQuestions.length > 0 &&
                  selectedQuestions.length === quizQuestions.length
                }
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="selectAll"
                className="text-sm text-gray-700 cursor-pointer font-medium"
              >
                {selectedQuestions.length === quizQuestions.length
                  ? "Deselect All"
                  : "Select All"}
              </label>
              <span className="text-sm text-gray-500 ml-auto font-medium">
                {selectedQuestions.length} selected
              </span>
            </div>
          )}

          {/* Questions List */}
          {quizQuestions.map((q, index) => {
            const isDeleting = deletingIds.includes(q.id);
            const isSelected = selectedQuestions.includes(q.id);
            const serialNumber = index + 1; // This will automatically renumber

            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg transition ${
                  selectionMode && isSelected
                    ? "bg-blue-50 border border-blue-200"
                    : selectionMode
                    ? "bg-gray-50 border border-transparent"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox for selection - Only shows when in selection mode */}
                  {selectionMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQuestionSelection(q.id)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                    />
                  )}

                  {/* Serial Number */}
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold">
                    {serialNumber}
                  </div>
                  
                  {/* Question Text */}
                  <div className="flex-1">
                    <p className="text-gray-800">{q.question}</p>
                  </div>

                  {/* Delete Icon - Always visible for single deletion */}
                  <div
                    className="cursor-pointer z-10 flex items-center justify-center"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center 
                      transition-colors duration-300 shadow-lg border-2 border-white
                      ${
                        isDeleting
                          ? "bg-red-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {isDeleting ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      ) : (
                        <Trash2 className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No personality quiz questions available
        </p>
      )}
    </div>
  );
}