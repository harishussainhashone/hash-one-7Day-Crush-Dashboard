// app/userList/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { Header } from "@/components/userDetail/Header";
import { ProfileCard } from "@/components/userDetail/ProfileCard";
import { TabsNavigation } from "@/components/userDetail/TabsNavigation";
import { OverviewTab } from "@/components/userDetail/TabContent/OverviewTab";
import { GalleryTab } from "@/components/userDetail/TabContent/GalleryTab";
import { PersonalityQuizTab } from "@/components/userDetail/TabContent/PersonalityQuizTab";
import { QuickStats } from "@/components/userDetail/RightSideSection/QuickStats";
import { ContactInfo } from "@/components/userDetail/RightSideSection/ContactInfo";
import { Interests } from "@/components/userDetail/RightSideSection/Interests";
import { AccountStatus } from "@/components/userDetail/RightSideSection/AccountStatus";
import { ActionButtons } from "@/components/userDetail/RightSideSection/ActionButtons";
import { LoadingState } from "@/components/userDetail/LoadingState";
import { ErrorState } from "@/components/userDetail/ErrorState";
import { UserData } from "@/types/user";
import { MatchesTab } from "@/components/userDetail/TabContent/MatchesTab";
import { ChatsTab } from "@/components/userDetail/TabContent/ChatsTab";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "quiz"  | "matches" | "chats">("overview");
  const [modalImage, setModalImage] = useState<string | null>(null);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch(`/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: UserData = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  /* ---------------- ACTIONS ---------------- */
  const toggleBlock = async () => {
    if (!user) return;

    try {
      const endpoint = user.isBlocked
        ? `/users/${user._id}/unblock`
        : `/users/${user._id}/block`;

      const res = await apiFetch(endpoint, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to update user");

      setUser({ ...user, isBlocked: !user.isBlocked });
    } catch {
      alert("Failed to update block status");
    }
  };

  const deleteUser = async () => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) return;

    try {
      const res = await apiFetch(`/users/${user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      router.push("/userList");
    } catch {
      alert("Failed to delete user");
    }
  };

  const editUser = () => {
    alert("Edit functionality to be implemented");
    // You can implement edit functionality here
    // router.push(`/userList/${id}/edit`);
  };

  /* ---------------- CALCULATE AGE ---------------- */
  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  /* ---------------- LOADING & ERROR STATES ---------------- */
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} router={router} />;
  }

  if (!user) return null;

  const age = calculateAge(user.dateOfBirth);
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <Header user={user} />

      {/* IMAGE MODAL (for both profile and gallery images) */}
      {modalImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-full max-h-full p-4" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition"
              onClick={() => setModalImage(null)}
              aria-label="Close image modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white p-2 rounded-xl">
              <img
                src={modalImage}
                alt="Full Image"
                className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl"
                onError={(e) => {
                  console.error(`Failed to load modal image: ${modalImage}`);
                  e.currentTarget.src = "https://placehold.co/800x600/3b82f6/ffffff?text=Image+Failed+to+Load";
                }}
              />
            </div>
            <p className="text-center text-white mt-4 text-sm">Click anywhere to close</p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - User Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <ProfileCard 
            user={user} 
            age={age}
            onImageClick={(url) => setModalImage(url)}
          />

          {/* Tabs Navigation */}
          <TabsNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            galleryImagesCount={user.galleryImages?.length || 0}
           
          />

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'gallery' && (
              <GalleryTab 
                user={user} 
                onImageClick={(url) => setModalImage(url)} 
                modalImage={modalImage}
                onCloseModal={() => setModalImage(null)}
              />
            )}
            {activeTab === 'quiz' && <PersonalityQuizTab user={user} />}
            
            {activeTab === 'matches' && <MatchesTab user={user} />} 
            {activeTab === 'chats' && <ChatsTab user={user} />}
            
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <ActionButtons 
            user={user}
            onToggleBlock={toggleBlock}
            onDelete={deleteUser}
             />

          {/* Quick Stats */}
          <QuickStats 
            user={user} 
            memberSince={memberSince} 
            age={age}
          />

          {/* Contact Info */}
          <ContactInfo user={user} age={age} />
          
                    {/* Account Status */}
                    <AccountStatus user={user} />

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <Interests interests={user.interests} />
          )}

           
         
        </div>
      </div>
    </div>
  );
}