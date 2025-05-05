import type { NextApiRequest, NextApiResponse } from 'next';

// Endpoint mockado que retorna distâncias simuladas sem chamar a API do Google
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ message: 'Origin and destination are required' });
  }

  try {
    // Simular um pequeno atraso como se fosse uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Extrair strings dos parâmetros
    const originStr = Array.isArray(origin) ? origin[0] : origin;
    const destinationStr = Array.isArray(destination) ? destination[0] : destination;
    
    // Lógica mockada similar à função getDistance em lib/distance.ts
    const combinedLength = originStr.length + destinationStr.length;
    const seemsInternational = originStr.includes(',') && destinationStr.includes(',') &&
      originStr.split(',').pop()?.trim() !== destinationStr.split(',').pop()?.trim();
    
    // Gerar valores simulados de distância
    let distanceKm = Math.floor(combinedLength * 8 * (seemsInternational ? 100 : 5));
    distanceKm = distanceKm * (0.8 + Math.random() * 0.4);
    distanceKm = Math.max(5, distanceKm);
    
    // Calcular tempo de viagem
    const speedFactor = seemsInternational ? 500 : 60; // km/h
    const hours = distanceKm / speedFactor;
    const seconds = Math.floor(hours * 3600);
    
    // Formatar texto de distância
    let distanceText = '';
    if (distanceKm < 1) {
      distanceText = `${Math.round(distanceKm * 1000)} m`;
    } else if (distanceKm < 10) {
      distanceText = `${distanceKm.toFixed(1)} km`;
    } else {
      distanceText = `${Math.round(distanceKm)} km`;
    }
    
    // Formatar texto de duração
    let durationText = '';
    if (seconds < 60) {
      durationText = `${seconds} seconds`;
    } else if (seconds < 3600) {
      durationText = `${Math.floor(seconds / 60)} mins`;
    } else if (seconds < 86400) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      durationText = `${h} hour${h > 1 ? 's' : ''}${m > 0 ? ` ${m} mins` : ''}`;
    } else {
      const d = Math.floor(seconds / 86400);
      const h = Math.floor((seconds % 86400) / 3600);
      durationText = `${d} day${d > 1 ? 's' : ''}${h > 0 ? ` ${h} hours` : ''}`;
    }
    
    // Montar resposta no formato esperado pelo Google Distance Matrix API
    const response = {
      destination_addresses: [destinationStr],
      origin_addresses: [originStr],
      rows: [
        {
          elements: [
            {
              distance: {
                text: distanceText,
                value: Math.floor(distanceKm * 1000) // em metros
              },
              duration: {
                text: durationText,
                value: seconds // em segundos
              },
              status: "OK"
            }
          ]
        }
      ],
      status: "OK"
    };
    
    console.log(`[MOCK API] Calculated distance from "${originStr}" to "${destinationStr}": ${distanceText} (${durationText})`);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in mock distance calculation:', error);
    return res.status(500).json({ message: 'Error calculating mock distance' });
  }
} 