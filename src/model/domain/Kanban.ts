import { z } from 'zod'

export type Status = 'TODO'|'IN_PROGRESS'| 'DONE'

export interface Kanban{
  id:number
  name: string
  description:string
  status: Status
}

export const KanbanSchema =
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    status: z.string()
  })

