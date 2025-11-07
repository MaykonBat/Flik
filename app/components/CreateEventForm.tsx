"use client";

import { useState, FormEvent } from "react";
import { useEvents } from "../context/EventContext";
import { CreateEventInput } from "../types/event";

interface CreateEventFormProps {
  creatorFid: number;
  creatorName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateEventForm({ creatorFid, creatorName, onSuccess, onCancel }: CreateEventFormProps) {
  const { createEvent, loading, error } = useEvents();
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

    // Validation
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

    // Validate date is in the future
    const eventDate = new Date(formData.date);
    if (eventDate < new Date()) {
      setFormError("Event date must be in the future");
      return;
    }

    const newEvent = await createEvent(formData, creatorFid, creatorName);

    if (newEvent) {
      // Reset form
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
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setFormError(error || "Failed to create event");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxAttendees" || name === "price" ? (value ? Number(value) : undefined) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 backdrop-blur-[10px] max-w-[800px] w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Create New Event</h2>

      {(formError || error) && (
        <div className="bg-[rgba(255,107,107,0.2)] border-2 border-[rgba(255,107,107,0.3)] text-[#ff6b6b] p-4 rounded-lg mb-6 text-sm" role="alert">
          {formError || error}
        </div>
      )}

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
          aria-required="true"
        />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label htmlFor="description" className="text-white/90 font-semibold text-sm">
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
          aria-required="true"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
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
            aria-required="true"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-white/90 font-semibold text-sm">
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
            aria-required="true"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-white/90 font-semibold text-sm">
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
          <label htmlFor="maxAttendees" className="text-white/90 font-semibold text-sm">
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

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="imageUrl" className="text-white/90 font-semibold text-sm">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-white/90 font-semibold text-sm">
            Price (USDC)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-white/10 border-2 border-white/20 rounded-lg text-white backdrop-blur-[10px] transition-all duration-300 font-inherit placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            placeholder="Free"
            min="0"
            step="0.01"
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
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}

