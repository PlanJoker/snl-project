# We are using Zustand to create and manage Global States

## Why use `Zustand` over `useContext`?
Zustand and React's `useContext` serve different purposes for state management, and choosing Zustand over `useContext` depends on your project's needs. Here's a concise comparison:

1. **Simpler API for Global State**:  
   Zustand provides a lightweight, intuitive store with minimal boilerplate. You define a store with `create` and access it with hooks, avoiding the nested provider hell often seen with `useContext`.  
   Example:
   ```javascript
   import { create } from 'zustand';
   const useStore = create((set) => ({
     count: 0,
     increment: () => set((state) => ({ count: state.count + 1 })),
   }));
   ```
   With `useContext`, you need to create a context, wrap components in a provider, and manage updates manually, which can get verbose.

2. **Performance Optimization**:  
   Zustand minimizes re-renders by allowing components to subscribe only to specific slices of state. With `useContext`, any change to the context value triggers re-renders for all consumers, unless you split contexts or use memoization hacks.  
   Zustand example (selective subscription):
   ```javascript
   const count = useStore((state) => state.count); // Only re-renders if count changes
   ```

3. **No Provider Overhead**:  
   Zustand doesn’t require wrapping your app in providers, unlike `useContext`, which needs a `Context.Provider` for every context. This simplifies the component tree and avoids issues with deeply nested providers.

4. **Flexibility Beyond React**:  
   Zustand stores are framework-agnostic and can be used outside React components (e.g., in utilities or non-React code). `useContext` is tightly coupled to React’s rendering cycle.

5. **Built-in Features**:  
   Zustand offers middleware like `persist` (for localStorage syncing) or `immer` (for immutable updates) out of the box. Achieving similar functionality with `useContext` requires custom logic or additional libraries.

6. **Scalability**:  
   For complex apps, Zustand’s single store can handle global state efficiently without the fragmentation of multiple contexts. `useContext` works better for passing props down a tree (e.g., theming) than managing app-wide state.

**When to Use `useContext` Instead**:  
If your state is simple, localized, or primarily for passing data through a component tree (e.g., theme or auth status), `useContext` is sufficient and avoids adding dependencies. Zustand shines for global, performance-sensitive, or complex state management.

**Conclusion**:  
Use Zustand over `useContext` for a more scalable, performant, and flexible global state solution with less boilerplate. Stick with `useContext` for lightweight, tree-scoped data passing.


