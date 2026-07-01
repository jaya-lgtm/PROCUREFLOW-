import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationDrawerOpen: false,
  theme: localStorage.getItem('theme') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    setCommandPaletteOpen: (state, action) => {
      state.commandPaletteOpen = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationDrawerOpen = !state.notificationDrawerOpen;
    },
    setNotificationsOpen: (state, action) => {
      state.notificationDrawerOpen = action.payload;
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
      
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
    initTheme: (state) => {
      const root = window.document.documentElement;
      if (state.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleCommandPalette,
  setCommandPaletteOpen,
  toggleNotifications,
  setNotificationsOpen,
  toggleTheme,
  initTheme
} = uiSlice.actions;

export default uiSlice.reducer;
