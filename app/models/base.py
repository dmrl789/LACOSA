"""Pydantic models shared across endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Literal

from pydantic import BaseModel, Field


class GeoPoint(BaseModel):
    lat: float = Field(..., description="Latitude coordinate")
    lng: float = Field(..., description="Longitude coordinate")


class SafetyZone(BaseModel):
    id: str
    neighborhood: str
    risk_level: Literal["low", "medium", "high"]
    description: str
    trend: str = Field(..., description="Day/night or temporal trend information")
    updated_at: datetime
    polygon: List[GeoPoint]


class RentalListing(BaseModel):
    id: str
    title: str
    price_eur: int
    bedrooms: int
    furnished: bool
    kid_friendly: bool
    pet_friendly: bool
    neighborhood: str
    verified: bool
    coordinates: GeoPoint
    contact: str
    url: Optional[str] = None


class School(BaseModel):
    id: str
    name: str
    curriculum: str
    level: str
    language: List[str]
    rating: float = Field(..., ge=0, le=5)
    tuition_eur: Optional[int] = None
    address: str
    application_tips: str


class Venue(BaseModel):
    id: str
    name: str
    type: str
    tags: List[str]
    description: str
    neighborhood: str
    coordinates: GeoPoint
    url: Optional[str] = None


class Market(BaseModel):
    id: str
    name: str
    category: str
    schedule: str
    delivery_partners: List[str]
    coordinates: GeoPoint


class Event(BaseModel):
    id: str
    name: str
    category: str
    venue: str
    start_time: datetime
    end_time: datetime
    summary: str
    ticket_url: Optional[str] = None


class TransportOption(BaseModel):
    id: str
    mode: str
    provider: str
    description: str
    contact: Optional[str] = None
    availability: str
    safety_notes: str


class Alert(BaseModel):
    id: str
    category: str
    message: str
    severity: str
    published_at: datetime


class UserProfile(BaseModel):
    id: str
    name: str
    nationality: str
    interests: List[str]
    has_kids: bool
    languages: List[str]
    verified: bool
    bio: Optional[str] = None


class Group(BaseModel):
    id: str
    name: str
    description: str
    interests: List[str]
    member_count: int


class ConciergeAnswer(BaseModel):
    query: str
    answer: str
    sources: List[str]
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score for the synthesized answer.")
    language: str = Field(
        ..., min_length=2, max_length=8, description="Language code used for the generated answer."
    )
    requested_language: str = Field(
        ..., min_length=2, max_length=8, description="Language code originally requested by the client."
    )


class RelocationPack(BaseModel):
    city: str
    visa_tips: str
    connectivity: str
    healthcare: str
    cultural_notes: str
    emergency_contacts: List[str]
    pdf_url: Optional[str] = None
