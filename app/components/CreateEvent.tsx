"use client";

import { CreateEventForm } from "./CreateEventForm";

interface CreateEventProps {
  creatorFid: number;
  creatorName: string | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateEvent({
  creatorFid,
  creatorName,
  onSuccess,
  onCancel,
}: CreateEventProps) {
  return (
    <CreateEventForm
      creatorFid={creatorFid}
      creatorName={creatorName}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}
