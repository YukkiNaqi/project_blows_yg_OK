"use client";

import { useEffect } from "react";
import { clientAuth } from "@/lib/client-auth";

// Komponen yang mengelola session timeout
// Harus digunakan di layout yang memerlukan otentikasi
export default function SessionTimeoutManager() {
  useEffect(() => {
    // Fungsi untuk memulai inactivity timer
    const initializeInactivityTimer = () => {
      if (typeof window === "undefined") return;

      // Cek apakah pengguna sudah login
      if (clientAuth.isAuthenticated()) {
        // Hanya inisialisasi jika belum diinisialisasi sebelumnya
        if (!(window as any).inactivityTimerInitialized) {
          // Inisialisasi listener
          const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'];
          const resetTimer = () => {
            // Hapus timer yang ada jika ada
            if ((window as any).inactivityTimeout) {
              clearTimeout((window as any).inactivityTimeout);
            }
            
            // Set timer baru untuk logout otomatis setelah 5 menit
            (window as any).inactivityTimeout = setTimeout(() => {
              clientAuth.clearAuth();
              const currentPath = window.location.pathname;
              if (currentPath.startsWith('/admin')) {
                window.location.href = '/admin/login';
              } else {
                window.location.href = '/login';
              }
            }, 5 * 60 * 1000); // 5 menit
          };

          // Tambahkan event listener
          events.forEach(event => {
            document.addEventListener(event, resetTimer, true);
          });

          // Set flag bahwa timer telah diinisialisasi
          (window as any).inactivityTimerInitialized = true;
          
          // Mulai timer pertama
          resetTimer();
        }
      }
    };

    // Inisialisasi saat komponen dimount
    initializeInactivityTimer();

    // Cleanup saat komponen di-unmount
    return () => {
      if (typeof window !== "undefined" && (window as any).inactivityTimeout) {
        clearTimeout((window as any).inactivityTimeout);
        (window as any).inactivityTimerInitialized = false;
      }
    };
  }, []);

  return null; // Komponen ini tidak merender apa pun
}