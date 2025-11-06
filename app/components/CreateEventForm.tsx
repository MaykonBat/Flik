"use client";

import { useState, FormEvent } from "react";
import { useEvents } from "../context/EventContext";
import { CreateEventInput } from "../types/event";
import styles from "./CreateEventForm.module.css";

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
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Create New Event</h2>

      {(formError || error) && (
        <div className={styles.error} role="alert">
          {formError || error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter event title"
          required
          aria-required="true"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Describe your event"
          rows={4}
          required
          aria-required="true"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="date" className={styles.label}>
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            required
            aria-required="true"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="location" className={styles.label}>
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
            placeholder="Event location"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
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

        <div className={styles.field}>
          <label htmlFor="maxAttendees" className={styles.label}>
            Max Attendees
          </label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={formData.maxAttendees || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="imageUrl" className={styles.label}>
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={styles.input}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>
            Price (USDC)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Free"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}

