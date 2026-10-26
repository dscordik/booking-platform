import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {AuthProvider} from "./Entities/session";
import {RouterProvider} from "react-router-dom";
import {router} from "./App/providers/router";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./Shared/lib/query-client.ts";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <RouterProvider router={router}/>
          </AuthProvider>
          <ReactQueryDevtools/>
      </QueryClientProvider>
  </StrictMode>,
)
