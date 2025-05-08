export async function fetchRaceData(raceId) {
    const response = await fetch(`/api/races/${raceId}`);
    return await response.json();
}