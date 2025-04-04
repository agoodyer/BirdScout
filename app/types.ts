export type RootStackParamList = {
    birdDetail: {
      id: string;
      image: string;
      commonName: string;
      speciesName: string;
      date: string;
      location?: string;
      notes?: string;
      shortDesc?: string;
      longDesc?: string;
      foundBy?: string;
    };
    journal: undefined;
    identify: undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }