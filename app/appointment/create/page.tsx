"use client";

import React, { useState } from "react";
import { AppointmentPayload } from "@/lib/types/appointment";
import { createAppointment } from "@/actions/actions";

const appointmentTypes = [
  { code: "1508", display: "Surgery" },
  { code: "1509", display: "New Patient" },
  { code: "1510", display: "Follow-up" },
];


const CreateAppointmentPage: React.FC = () => {
  const [status, setStatus] =
    useState<AppointmentPayload["status"]>("booked");

  const [appointmentTypeCode, setAppointmentTypeCode] = useState("1509");
  const [appointmentTypeDisplay, setAppointmentTypeDisplay] =
    useState("New Patient");

  const [startLocal, setStartLocal] = useState("");
  const [minutesDuration, setMinutesDuration] = useState(10);
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");

  const [patientRef, setPatientRef] = useState("");
  const [patientDisplay, setPatientDisplay] = useState("");
  const [practitionerRef, setPractitionerRef] = useState("");
  const [practitionerDisplay, setPractitionerDisplay] = useState("");
  const [locationRef, setLocationRef] = useState("");
  const [locationDisplay, setLocationDisplay] = useState("");

  // UI feedback state
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateEndTime = (startISO: string, duration: number) => {
    const startDate = new Date(startISO);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return endDate.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!startLocal || !patientRef || !practitionerRef || !locationRef) {
      setErrorMessage(
        "Please provide required fields: start time, patient, practitioner, and location."
      );
      return;
    }

    const startISO = new Date(startLocal).toISOString();
    const endISO = calculateEndTime(startISO, minutesDuration);

    const payload: AppointmentPayload = {
      resourceType: "Appointment",
      status,
      appointmentType: {
        coding: [
          {
            system:
              "{base url}/{firm_url_prefix}/ema/fhir/v2/ValueSet/appointment-type",
            code: appointmentTypeCode,
            display: appointmentTypeDisplay,
          },
        ],
        text: appointmentTypeDisplay,
      },
      start: startISO,
      end: endISO,
      minutesDuration,
      description,
      comment,
      participant: [
        {
          actor: {
            reference: `Location/${locationRef}`,
            display: locationDisplay || "",
          },
          status: "accepted",
        },
        {
          actor: {
            reference: `Practitioner/${practitionerRef}`,
            display: practitionerDisplay || "",
          },
          status: "accepted",
        },
        {
          actor: {
            reference: `Patient/${patientRef}`,
            display: patientDisplay || "",
          },
          status: "accepted",
        },
      ],
    };

    try {
      setLoading(true);
      const response = await createAppointment(payload);
      if (!response.success) {
        setErrorMessage(`${response.error.code}: ${response.error.message}`)
      } else {
      setSuccessMessage("✅ Appointment created successfully!");
      }
      console.log(response);
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md font-sans"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create Appointment
      </h2>

      {/* Status */}
      <label className="block mb-3 font-medium text-gray-700">
        Status:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">pending</option>
          <option value="booked">booked</option>
          <option value="arrived">arrived</option>
          <option value="fulfilled">fulfilled</option>
          <option value="cancelled">cancelled</option>
          <option value="noshow">noshow</option>
          <option value="checked-in">checked-in</option>
        </select>
      </label>

      {/* Appointment Type */}
      <label className="block mb-3 font-medium text-gray-700">
        Appointment Type:
        <select
          value={appointmentTypeCode}
          onChange={(e) => {
            const selected = appointmentTypes.find(
              (a) => a.code === e.target.value
            );
            setAppointmentTypeCode(selected?.code || "");
            setAppointmentTypeDisplay(selected?.display || "");
          }}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {appointmentTypes.map((type) => (
            <option key={type.code} value={type.code}>
              {type.display}
            </option>
          ))}
        </select>
      </label>

      {/* Start Time */}
      <label className="block mb-3 font-medium text-gray-700">
        Start Time:
        <input
          type="datetime-local"
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
          required
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Duration */}
      <label className="block mb-3 font-medium text-gray-700">
        Duration (minutes):
        <input
          type="number"
          value={minutesDuration}
          onChange={(e) => setMinutesDuration(parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Description */}
      <label className="block mb-3 font-medium text-gray-700">
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Comment */}
      <label className="block mb-3 font-medium text-gray-700">
        Comment:
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Patient */}
      <label className="block mb-3 font-medium text-gray-700">
        Patient Reference (ID):
        <input
          type="text"
          value={patientRef}
          onChange={(e) => setPatientRef(e.target.value)}
          required
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="block mb-3 font-medium text-gray-700">
        Patient Display:
        <input
          type="text"
          value={patientDisplay}
          onChange={(e) => setPatientDisplay(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Practitioner */}
      <label className="block mb-3 font-medium text-gray-700">
        Practitioner Reference (ID):
        <input
          type="text"
          value={practitionerRef}
          onChange={(e) => setPractitionerRef(e.target.value)}
          required
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="block mb-3 font-medium text-gray-700">
        Practitioner Display:
        <input
          type="text"
          value={practitionerDisplay}
          onChange={(e) => setPractitionerDisplay(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Location */}
      <label className="block mb-3 font-medium text-gray-700">
        Location Reference (ID):
        <input
          type="text"
          value={locationRef}
          onChange={(e) => setLocationRef(e.target.value)}
          required
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="block mb-6 font-medium text-gray-700">
        Location Display:
        <input
          type="text"
          value={locationDisplay}
          onChange={(e) => setLocationDisplay(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Error & Success Messages */}
      {errorMessage && (
        <p className="mb-4 text-red-600 font-medium">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mb-4 text-green-600 font-medium">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Creating..." : "Create Appointment"}
      </button>
    </form>
  );
};

export default CreateAppointmentPage;

