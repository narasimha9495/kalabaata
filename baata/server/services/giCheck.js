export const GI_DISTRICT_MAP = {
  "pochampally ikat": "Yadadri Bhuvanagiri", "pochampally": "Yadadri Bhuvanagiri",
  "gadwal saree": "Jogulamba Gadwal", "gadwal": "Jogulamba Gadwal",
  "narayanpet saree": "Narayanpet", "narayanpet": "Narayanpet",
  "cheriyal scroll painting": "Siddipet", "cheriyal": "Siddipet",
  "siddipet gollabhama": "Siddipet", "gollabhama": "Siddipet",
  "karimnagar silver filigree": "Karimnagar", "silver filigree": "Karimnagar",
  "adilabad dokra": "Adilabad", "dokra": "Adilabad",
  "pembarthi metal craft": "Jangaon", "pembarthi": "Jangaon",
  "hyderabad lac bangles": "Hyderabad", "lac bangles": "Hyderabad",
};
const normalize = (s = "") => s.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
export function giDistrictCheck(declaredCraft, district) {
  const key = normalize(declaredCraft);
  let expected = null;
  for (const [craft, d] of Object.entries(GI_DISTRICT_MAP)) {
    if (key.includes(craft)) { expected = d; break; }
  }
  if (!expected) return { matched: false, expectedDistrict: null };
  return { matched: normalize(expected) === normalize(district), expectedDistrict: expected };
}
