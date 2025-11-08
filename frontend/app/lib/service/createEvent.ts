import { CreateEventInput } from "../../types/event";
import { CreateEventContractParams } from "../../hooks/useEventContract";

/**
 * Converte os dados do formulário para os parâmetros do contrato
 */
export function prepareEventForContract(
  eventInput: CreateEventInput
): CreateEventContractParams {
  // Converte startsAt para timestamp Unix (segundos)
  const startsAtDate = new Date(eventInput.startsAt);
  const startsAt = BigInt(Math.floor(startsAtDate.getTime() / 1000));

  // Converte endsAt para timestamp Unix (segundos)
  const endsAtDate = new Date(eventInput.endsAt);
  const endsAt = BigInt(Math.floor(endsAtDate.getTime() / 1000));

  // Prepara as tags baseadas na categoria
  const tags: string[] = [];
  if (eventInput.category) {
    tags.push(eventInput.category);
  }

  return {
    title: eventInput.title,
    location: eventInput.location,
    maxAttendees: eventInput.maxAttendees || 0,
    description: eventInput.description,
    tags,
    startsAt,
    endsAt,
  };
}
