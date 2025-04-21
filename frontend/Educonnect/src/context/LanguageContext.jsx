import React, { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const translations = {
    en: {
      // General
      loading: "Loading...",
      retry: "Retry",
      noPosts: "No posts available.",
      failedToLoadPosts: "Failed to load posts. Please try again.",

      // Auth (Login/Signup)
      login: "Login",
      signup: "Signup",
      email: "Email",
      password: "Password",
      name: "Name",
      role: "Role",
      bio: "Bio",
      educationalInstitution: "Educational Institution",
      student: "Student",
      educator: "Educator",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      signUpLink: "Sign Up",
      loginLink: "Login",
      loginFailed: "Login failed. Please try again.",
      signupFailed: "Signup failed. Please try again.",

      // Navbar & Sidebar
      home: "Home",
      bookmarks: "Bookmarks",
      logout: "Logout",
      educonnect: "EduConnect",
      aboutUs: "About Us",
      search: "Search 🔍",
      searchResults: "Search Results",
      noResults: "No results found.",
      failedToLoadSearch: "Failed to load search results.",
      viewPost: "View Post",
      viewDiscussion: "View Discussion",
      viewProfile: "View Profile",
      viewEvent: "View Event",

      // Feed & MainContent
      welcome: "Welcome to 🚀EduConnect",
      whatsOnMind: "What's on your mind?",
      attach: "Attach 😎",
      post: "Post",
      posting: "Posting...",
      recentPosts: "Recent Posts",
      removeFile: "Remove File",
      comment: "Comment",
      bookmarkText: "Bookmark",
      bookmarked: "Bookmarked",

      // Bookmarks
      bookmarkedPosts: "Bookmarked Posts",
      noBookmarks: "No bookmarked posts yet.",

      // Discussions
      discussions: "Discussions",
      startDiscussion: "Start a New Discussion",
      discussionTitle: "Discussion Title",
      discussionContent: "Discussion Content",
      tags: "Tags (comma separated)",
      postDiscussion: "Post Discussion",
      noDiscussions: "No discussions yet.",

      // Educators
      educators: "Educators",
      ourEducators: "Our Educators",
      loadingEducators: "Loading educators...",
      failedToLoadEducators: "Failed to load educators",
      noBio: "No bio available",
      noInstitution: "No institution provided",

      // PostDetails
      addComment: "Add a comment...",
      postComment: "Post Comment",
      comments: "Comments",
      noComments: "No comments yet.",
      failedToLoadComments: "Failed to load comments. Please try again.",
      commentPostedSuccess: "Comment posted successfully!",

      // Profile
      followers: "Followers",
      following: "Following",
      follow: "Follow",
      unfollow: "Unfollow",
      noPostsYet: "No posts yet.",
      loadingProfile: "Loading profile...",
      failedToLoadProfile: "Failed to load profile",
      userNotFound: "User not found",

      // Events
      events: "Events",
      addEvent: "Add Event",
      title: "Title",
      date: "Date",
      time: "Time",
      location: "Location",
      description: "Description",
      organizedBy: "Organized by",
      register: "Register",
      registered: "Registered",
      noEvents: "No events available.",
      failedToLoadEvents: "Failed to load events.",
      eventCreationFailed: "Failed to create event.",
      registrationFailed: "Failed to register for event.",
      save: "Save",
      cancel: "Cancel",

      // NotificationList
      notifications: "Notifications",
      clearAll: "Clear All Notifications",
      markAsRead: "Mark as Read",
      noNotifications: "No notifications yet.",
      loadingNotifications: "Loading notifications...",
      failedToLoadNotifications: "Failed to load notifications",
      failedToClearNotifications: "Failed to clear notifications",
    },
    hi: {
      // General
      loading: "लोड हो रहा है...",
      retry: "पुनः प्रयास करें",
      noPosts: "कोई पोस्ट उपलब्ध नहीं।",
      failedToLoadPosts: "पोस्ट लोड करने में विफल। कृपया पुनः प्रयास करें।",

      // Auth (Login/Signup)
      login: "लॉगिन",
      signup: "साइन अप",
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      role: "भूमिका",
      bio: "जीवनी",
      educationalInstitution: "शैक्षिक संस्थान",
      student: "छात्र",
      educator: "शिक्षक",
      dontHaveAccount: "खाता नहीं है?",
      alreadyHaveAccount: "पहले से खाता है?",
      signUpLink: "साइन अप करें",
      loginLink: "लॉगिन करें",
      loginFailed: "लॉगिन विफल। कृपया पुनः प्रयास करें।",
      signupFailed: "साइन अप विफल। कृपया पुनः प्रयास करें।",

      // Navbar & Sidebar
      home: "होम",
      bookmarks: "बुकमार्क",
      logout: "लॉगआउट",
      educonnect: "एडुकनेक्ट",
      aboutUs: "हमारे बारे में",
      search: "पोस्ट, चर्चाएँ, शिक्षक, आयोजन खोजें...",
      searchResults: "खोज परिणाम",
      noResults: "कोई परिणाम नहीं मिला।",
      failedToLoadSearch: "खोज परिणाम लोड करने में विफल।",
      viewPost: "पोस्ट देखें",
      viewDiscussion: "चर्चा देखें",
      viewProfile: "प्रोफाइल देखें",
      viewEvent: "आयोजन देखें",

      // Feed & MainContent
      welcome: "🚀एडुकनेक्ट में आपका स्वागत है",
      whatsOnMind: "आपके मन में क्या है?",
      attach: "संलग्न करें 😎",
      post: "पोस्ट करें",
      posting: "पोस्ट हो रहा है...",
      recentPosts: "हाल की पोस्ट",
      removeFile: "फ़ाइल हटाएँ",
      comment: "टिप्पणी",
      bookmarkText: "बुकमार्क",
      bookmarked: "बुकमार्क किया गया",

      // Bookmarks
      bookmarkedPosts: "बुकमार्क की गई पोस्ट",
      noBookmarks: "अभी तक कोई बुकमार्क पोस्ट नहीं।",

      // Discussions
      discussions: "चर्चाएँ",
      startDiscussion: "नई चर्चा शुरू करें",
      discussionTitle: "चर्चा शीर्षक",
      discussionContent: "चर्चा सामग्री",
      tags: "टैग (अल्पविराम से अलग)",
      postDiscussion: "चर्चा पोस्ट करें",
      noDiscussions: "अभी तक कोई चर्चाएँ नहीं।",

      // Educators
      educators: "शिक्षक",
      ourEducators: "हमारे शिक्षक",
      loadingEducators: "शिक्षकों को लोड कर रहा है...",
      failedToLoadEducators: "शिक्षकों को लोड करने में विफल",
      noBio: "कोई जीवनी उपलब्ध नहीं",
      noInstitution: "कोई संस्थान प्रदान नहीं किया गया",

      // PostDetails
      addComment: "टिप्पणी जोड़ें...",
      postComment: "टिप्पणी पोस्ट करें",
      comments: "टिप्पणियाँ",
      noComments: "अभी तक कोई टिप्पणी नहीं।",
      failedToLoadComments: "टिप्पणियाँ लोड करने में विफल। कृपया पुनः प्रयास करें।",
      commentPostedSuccess: "टिप्पणी सफलतापूर्वक पोस्ट की गई!",

      // Profile
      followers: "अनुयायी",
      following: "अनुसरण",
      follow: "अनुसरण करें",
      unfollow: "अनुसरण रद्द करें",
      noPostsYet: "अभी तक कोई पोस्ट नहीं।",
      loadingProfile: "प्रोफ़ाइल लोड हो रही है...",
      failedToLoadProfile: "प्रोफ़ाइल लोड करने में विफल",
      userNotFound: "उपयोगकर्ता नहीं मिला",

      // Events
      events: "आयोजन",
      addEvent: "आयोजन जोड़ें",
      title: "शीर्षक",
      date: "तारीख",
      time: "समय",
      location: "स्थान",
      description: "विवरण",
      organizedBy: "द्वारा आयोजित",
      register: "पंजीकरण करें",
      registered: "पंजीकृत",
      noEvents: "कोई आयोजन उपलब्ध नहीं।",
      failedToLoadEvents: "आयोजन लोड करने में विफल।",
      eventCreationFailed: "आयोजन बनाने में विफल।",
      registrationFailed: "आयोजन के लिए पंजीकरण विफल।",
      save: "सहेजें",
      cancel: "रद्द करें",

      // NotificationList
      notifications: "सूचनाएँ",
      clearAll: "सभी सूचनाएँ साफ़ करें",
      markAsRead: "पढ़ा हुआ चिह्नित करें",
      noNotifications: "अभी तक कोई सूचनाएँ नहीं।",
      loadingNotifications: "सूचनाएँ लोड हो रही हैं...",
      failedToLoadNotifications: "सूचनाएँ लोड करने में विफल",
      failedToClearNotifications: "सूचनाएँ साफ़ करने में विफल",
    },
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};