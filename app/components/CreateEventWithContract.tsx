"use client";

import { useState, FormEvent } from "react";
import { useEventContract } from "../hooks/useEventContract";
import { prepareEventForContract } from "../lib/service/createEvent";
import { CreateEventInput } from "../types/event";
import { useAccount } from "wagmi";

interface CreateEventWithContractProps {
  creatorFid: number;
  creatorName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Exemplo de componente que cria eventos diretamente no contrato blockchain
 *
 * Para usar este componente:
 * 1. Atualize o endereço do contrato em app/lib/contracts.ts
 * 2. Certifique-se de que o usuário está conectado com a carteira
 * 3. Substitua CreateEvent por CreateEventWithContract em app/page.tsx
 */
export function CreateEventWithContract({
  creatorFid,
  creatorName,
  onSuccess,
  onCancel,
}: CreateEventWithContractProps) {
  const { createPublicEvent, isPending, isSuccess, error } = useEventContract();
  const { isConnected } = useAccount();

  const [formData, setFormData] = useState<CreateEventInput>({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
    category: "",
    maxAttendees: undefined,
    price: undefined,
  });

  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validação básica
    if (!isConnected) {
      setFormError("Please connect your wallet first");
      return;
    }

    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!formData.date) {
      setFormError("Date is required");
      return;
    }
    if (!formData.location.trim()) {
      setFormError("Location is required");
      return;
    }

    // Valida que a data está no futuro
    const eventDate = new Date(formData.date);
    if (eventDate < new Date()) {
      setFormError("Event date must be in the future");
      return;
    }

    try {
      // Prepara os dados para o contrato
      const contractParams = prepareEventForContract(formData);

      // Chama o contrato
      await createPublicEvent(contractParams);

      // Reset form se sucesso
      if (isSuccess) {
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          imageUrl: "",
          category: "",
          maxAttendees: undefined,
          price: undefined,
        });

        // Opcional: salvar dados adicionais no backend
        // (imageUrl, price, etc não estão no contrato)
        await saveAdditionalEventData(formData, creatorFid, creatorName);

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setFormError(
        error?.message || "Failed to create event on blockchain"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maxAttendees" || name === "price"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 backdrop-blur-[10px] max-w-[800px] w-full mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Create New Event (Blockchain)
      </h2>

      {!isConnected && (
        <div
          className="bg-[rgba(247,217,84,0.2)] border-2 border-[rgba(247,217,84,0.3)] text-[#f7d954] p-4 rounded-lg mb-6 text-sm"
          role="alert"
        >
          Please connect your wallet to create an event
        </div>
      )}

      {(formError || error) && (
        <div
          className="bg-[rgba(255,107,107,0.2)] border-2 border-[rgba(255,107,107,0.3)] text-[#ff6b6b] p-4 rounded-lg mb-6 text-sm"
          role="alert"
        >
          {formError || error?.message}
        </div>
      )}

      {isSuccess && (
        <div
          className="bg-[rgba(76,217,100,0.2)] border-2 border-[rgba(76,217,100,0.3)] text-[#4cd964] p-4 rounded-lg mb-6 text-sm"
          role="alert"
        >
          Event created successfully on blockchain!
        </div>
      )}

      {/* Campos do formulário - igual ao CreateEventForm.tsx */}
      <div className="flex flex-col gap-2 mb-6">
        <label htmlFor="title" className="text-white/90 font-semibold text-sm">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="description"
          className="text-white/90 font-semibold text-sm"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] resize-y min-h-[100px]"
          placeholder="Describe your event"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-white/90 font-semibold text-sm">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="location"
            className="text-white/90 font-semibold text-sm"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            placeholder="Event location"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="text-white/90 font-semibold text-sm"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer [&>option]:bg-[#1a1a2e] [&>option]:text-white"
          >
            <option value="">Select category</option>
            <option value="tech">Tech</option>
            <option value="social">Social</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="networking">Networking</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="maxAttendees"
            className="text-white/90 font-semibold text-sm"
          >
            Max Attendees
          </label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={formData.maxAttendees || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-white/10 md:flex-row flex-col-reverse">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 border-2 border-transparent bg-white/10 text-white/80 border-white/20 hover:bg-white/15 hover:border-white/30 w-full md:w-auto"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-8 py-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 border-2 border-transparent bg-[#f7d954] text-black border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(247,217,84,0.3)] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          disabled={isPending || !isConnected}
        >
          {isPending ? "Creating on Blockchain..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}

/**
 * Função auxiliar para salvar dados adicionais no backend
 * (imageUrl, price, etc não estão no contrato)
 */
async function saveAdditionalEventData(
  eventData: CreateEventInput,
  creatorFid: number,
  creatorName?: string
) {
  try {
    await fetch("/api/events/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...eventData,
        creatorFid,
        creatorName,
      }),
    });
  } catch (err) {
    console.error("Error saving additional event data:", err);
    // Não falhar a operação principal se isto falhar
  }
}
