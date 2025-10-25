import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'



type WorkspaceState = {
  id: number | -1
  setId: (id: number) => void
  clear: () => void
}

export const WorkSpaceActivate = create<WorkspaceState>()(
  persist(
    (set) => ({
      id: -1,
      setId: (id) => set({ id }),
      clear: () => set({ id: -1 }),
    }),
    {
      name: 'workspace-id',
      storage: AsyncStorage as any,
      partialize: (state) => ({ id: state.id }),
    }
  )
)



/* To Use the WorkSpace State:

- Read the WorkSpace Activate:
const id = WorkSpaceActivate((state) => state.id)

- Change the WorkSpace Activate:
const setId = WorkSpaceActivate((state) => state.setId)
setId('workspace_123')

- Renisialiser:
const clear = WorkSpaceActivate((state) => state.clear)
clear()

*/