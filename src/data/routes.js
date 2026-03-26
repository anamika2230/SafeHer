export const routes = [
  {
    id: 1,
    name: 'Route A — MG Road',
    safetyScore: 9.1,
    distance: '2.3 km',
    eta: '8 min',
    tags: ['Well lit', 'CCTV coverage', 'Busy road'],
    recommended: true,
    lightingLevel: 'High',
    crowdLevel: 'Busy',
    incidents7Days: 2,
  },
  {
    id: 2,
    name: 'Route B — Brigade Road',
    safetyScore: 6.4,
    distance: '1.9 km',
    eta: '6 min',
    tags: ['Shorter', 'Moderate crowd'],
    recommended: false,
    lightingLevel: 'Medium',
    crowdLevel: 'Moderate',
    incidents7Days: 4,
  },
  {
    id: 3,
    name: 'Route C — Church Street',
    safetyScore: 4.2,
    distance: '1.7 km',
    eta: '5 min',
    tags: ['Avoid after 10PM', 'Isolated stretch'],
    recommended: false,
    lightingLevel: 'Low',
    crowdLevel: 'Low',
    incidents7Days: 6,
  },
];

export default routes;

