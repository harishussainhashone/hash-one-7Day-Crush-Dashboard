"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, List, Search, Menu, X } from "lucide-react"
import ActiveUsersCard from "./dashboard/ActiveUsersCard"

export default function Navbar() {
  const [dropdown, setDropdown] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null) // New ref for search bar
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle click outside for search bar
  useEffect(() => {
    function handleClickOutsideSearch(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutsideSearch)
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch)
  }, [])

  // Focus input when search bar is shown
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showSearch])

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[6rem] z-50 bg-white px-4 py-3 flex items-center shadow">
        {/* Toggle Button (mobile/tablet) */}
        {/* <div className="flex lg:hidden items-center ml-4">
          <button
            type="button"
            className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div> */}

        {/* Right - Actions */}
        <div className="flex items-center space-x-6">
      </div>
         <div className=" h-16 ml-5   mt-4 hidden sm:block">
      <Image
        src="/aubonlogo.png"
        alt="Choice Logo"
        width={160}
        height={100}
        className="object-contain"
      />
    </div> 
        <div className="ml-auto flex mr-4 items-center gap-3 md:gap-4">

          
          {/* Go To Website Button */}
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 hover:underline h-9 text-white px-4 rounded font-semibold shadow text-sm md:text-base"
          >
            {/* <a href="https://choice-delivery.com/demo/choice-delivery/">Go To Website</a> */}
            <a href="#">Go To Website</a>
          </Button>

          {/* Search Icon (only mobile) */}
          {/* <div className="flex items-center sm:hidden">
            <Search
              className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowSearch(!showSearch)}
            />
          </div> */}

          {/* Divider (only desktop) */}
          <div className="hidden md:block w-px h-8 bg-gray-300" />

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdown(!dropdown)}>
              <span className="hidden md:inline text-gray-700 text-sm font-medium">cvsadmin</span>
              <Image
                src="https://choice-delivery.com/dashboard/img/undraw_profile.svg"
                alt="User"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>

            {dropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="mr-2 h-4 w-4" /> Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <List className="mr-2 h-4 w-4" /> Activity Log
                </a>
                <div className="border-t my-1" />
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar (toggle) */}
      {/* {showSearch && (
        <div
          className="sm:hidden left-0 px-4 py-2  min-w-full z-50 mt-[5.9rem]"
          ref={searchRef} // Attach ref to search bar container
        >
          <div className="flex items-center p-[16px] border bg-white rounded-lg overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for..."
              className="flex-1 px-3 py-2 h-10 text-sm outline-none bg-gray-50"
            />
            <button className="bg-blue-600 p-3">
              <Search className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )} */}
    </>
  )
}