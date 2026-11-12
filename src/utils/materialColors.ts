

// Definisci una mappa di colori.  Puoi personalizzare questi colori.
const materialColorMap: { [index: number]: string } = {
    0: '#ff0000', // Rosso per il materiale 0
    1: '#00ff00', // Verde per il materiale 1
    2: '#0000ff', // Blu per il materiale 2
    
  };
  
  // Funzione per ottenere il colore da un indice di materiale
  export function getMaterialColor(materialIndex: number): string {
    return materialColorMap[materialIndex] || '#808080'; // Grigio come colore predefinito
  }