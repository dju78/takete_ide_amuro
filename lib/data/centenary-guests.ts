import {
  CENTENARY_GUESTS,
  CENTENARY_RSVP_CONTACTS,
  getGroupedCentenaryGuests,
  type CentenaryGuest,
  type CentenaryGuestGroup,
  type CentenaryRSVPContact,
} from "@/lib/media/centenary-guests";

export async function getCentenaryGuests(): Promise<CentenaryGuest[]> {
  return CENTENARY_GUESTS;
}

export async function getCentenaryGuestGroups(): Promise<CentenaryGuestGroup[]> {
  return getGroupedCentenaryGuests();
}

export async function getCentenaryRSVP(): Promise<CentenaryRSVPContact[]> {
  return CENTENARY_RSVP_CONTACTS;
}
