import { NextRequest, NextResponse } from "next/server";
import { getEventById, updateEvent } from "../../../../lib/eventStorage";

// POST /api/events/[id]/rsvp - RSVP to an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userFid } = body;

    if (!userFid) {
      return NextResponse.json(
        { success: false, message: "Missing userFid" },
        { status: 400 }
      );
    }

    const event = getEventById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Check if already RSVP'd
    if (event.attendees.includes(Number(userFid))) {
      return NextResponse.json(
        { success: false, message: "Already RSVP'd to this event" },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json(
        { success: false, message: "Event is full" },
        { status: 400 }
      );
    }

    // Add user to attendees
    const updatedEvent = {
      ...event,
      attendees: [...event.attendees, Number(userFid)],
    };
    updateEvent(updatedEvent);

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: "Successfully RSVP'd to event",
    });
  } catch (error) {
    console.error("Error RSVPing to event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to RSVP to event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/rsvp - Cancel RSVP
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userFid } = body;

    if (!userFid) {
      return NextResponse.json(
        { success: false, message: "Missing userFid" },
        { status: 400 }
      );
    }

    const event = getEventById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Remove user from attendees
    const updatedEvent = {
      ...event,
      attendees: event.attendees.filter(
        (fid: number) => fid !== Number(userFid)
      ),
    };
    updateEvent(updatedEvent);

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: "Successfully canceled RSVP",
    });
  } catch (error) {
    console.error("Error canceling RSVP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel RSVP" },
      { status: 500 }
    );
  }
}
