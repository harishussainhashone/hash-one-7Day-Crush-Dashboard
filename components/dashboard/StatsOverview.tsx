import React from "react";
import { User } from "lucide-react";

function DashboardCard() {
  return (
    <div className="flex flex-col mb-6">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-wrap gap-6">
          {/* Total Users */}
          <div className="flex-1 min-w-[260px] bg-white rounded-xl shadow p-6 border-l-4 border-purple-500 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-600 mb-1">
                TOTAL USERS
              </div>
              <div className="text-2xl font-bold text-gray-700">7</div>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
