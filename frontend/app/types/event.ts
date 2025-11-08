export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  maxAttendees: number; // Obrigatório conforme contrato
  tags: string[]; // Array de tags do contrato
  startsAt: bigint; // Timestamp Unix (segundos) - obrigatório
  endsAt: bigint; // Timestamp Unix (segundos) - obrigatório
  // Campos de compatibilidade/UI (opcionais)
  date?: string; // ISO string - mantido para compatibilidade com componentes existentes
  imageUrl?: string;
  creatorFid: number;
  creatorName?: string;
  creatorAddress?: string;
  attendees: number[]; // Array of FIDs
  category?: string; // Mantido para compatibilidade, pode ser derivado de tags[0]
  price?: number; // in USDC (optional)
  createdAt: string; // ISO string
}

// Interface para o formulário (antes da conversão)
export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  maxAttendees?: number;
  category?: string;
  startsAt: string; // datetime-local format
  endsAt: string; // datetime-local format
  imageUrl?: string;
  price?: number;
}
